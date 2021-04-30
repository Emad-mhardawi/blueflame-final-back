const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const calculateOrderPrice = require('../utils/calculateOrderPrice');
const asyncHandler = require("express-async-handler");
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const bodyParser = require('body-parser');


//@ route: POST/  /create-checkout-session
//@ description:  Create a Checkout Session
//@ access: private
const DOMAIN = 'http://localhost:3001/checkout';
exports.checkoutSession = asyncHandler(async (req, res, next)=>{
    const {portraitName, portraitStyle, portraitSize, fullBody, commentsToArtist} = req.body;
    const image = req.file;

    if (!portraitName) {
        res.status(400);
        throw new Error("portraitName is required");
    }

    if (!portraitStyle) {
        res.status(400);
        throw new Error("portraitStyle is required");
    }

    if (!portraitSize) {
        res.status(400);
        throw new Error("portraitSize is required");
    }

    //// calculate order price
    const orderPrice = await calculateOrderPrice(portraitStyle ,portraitSize, fullBody)
    

    const userId = await req.user._id;
    //// create new order 
    const newOrder = await Order.create({
        user:userId,
        portraitName: portraitName,
        portraitStyle:portraitStyle,
        portraitSize: portraitSize,
        fullBody:fullBody,
        price:orderPrice,
        commentsToArtist:commentsToArtist,
        imageUrl:image.path,
        paymentResult:{
            id:null,
            status:'unpaid',
        },

    })
    
    /// create checkout session stripe
    const session = await stripe.checkout.sessions.create({
        payment_method_types : ['card'],
        customer_email: req.user.email,
        client_reference_id: newOrder._id.toString(),
        line_items :[{
            price_data:{
                currency: 'usd',
                product_data:{
                name: portraitName,
                images: ['https://i.imgur.com/EHyR2nP.png'],
            },
            unit_amount: orderPrice * 100,
        },
            quantity: 1
            },
        ],
            mode: 'payment',
            success_url: `${DOMAIN}?success=true`,
            cancel_url: `${DOMAIN}?canceled=true`,
            
    });
    res.json(session)
}) 







const fulfillOrder = async(session) => {
    // TODO: fill me in
    const orderId = session.client_reference_id;
    const order = await Order.findById(orderId);
    order.paymentResult.status = session.payment_status;
    order.save()
    
    console.log("Fulfilling order", session);
  }


const endpointSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET;
/// stripe require the row body to construct the event
exports.webhook = asyncHandler(async (req, res, next)=>{
    
    const payload = req.body;
    const sig = req.headers['stripe-signature'];
  
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
        console.log(err)
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  
    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
  
      // Fulfill the purchase...
      fulfillOrder(session);
    }
  
    res.status(200);

}) 


  
  