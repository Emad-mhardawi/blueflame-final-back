const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const calculateOrderPrice = require('../utils/calculateOrderPrice');
const asyncHandler = require("express-async-handler");
const User = require('../models/userModel');
const Order = require('../models/orderModel');


//@ route: POST/  /create-checkout-session
//@ description:  Create a Checkout Session
//@ access: private
const DOMAIN = 'http://localhost:3000/checkout';
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

    const orderPrice = await calculateOrderPrice(portraitStyle ,portraitSize, fullBody)


    const userId = await req.user._id;
    const user = await User.findById(userId);
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
    



    console.log(orderPrice)
    const session = await stripe.checkout.sessions.create({
        payment_method_types : ['card'],
        customer_email: req.user.email,
       

        line_items :[
            {
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

/// stripe require the row body to construct the event