const express = require('express');
const connectDb = require('./config/db');
const cors =require('cors');
require('dotenv').config()
const {notFound, errorHandler} = require('./middleware/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const portraitRoutes = require('./routes/portraitRoutes');
const multer = require('multer');
const app = express();
app.use(cors())
const orderController = require('./controllers/orderController');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);




const bodyParser = require('body-parser');
const Order = require('./models/orderModel');

app.use('/webhook',bodyParser.raw({type: 'application/json'}),orderController.webhook )



app.use(express.json());


app.use('/images',express.static('images'))

////configure storage for uploaded images /multer
const fileStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'images')
    },
    filename: (req, file, cb)=>{
        cb(null, req.body.portraitStyle + '-' + file.originalname)
    }
});

/// check if uploaded files are images before saving 
const fileFilter = (req, file, cb)=>{
    if(file.mimetype === 'image/png'  || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null, true);
    }else{
        cb(null, false);
    }}

app.use(multer({storage:fileStorage, fileFilter:fileFilter }).single('image'))


app.use(userRoutes);
app.use(orderRoutes)
app.use(portraitRoutes);
app.use(notFound)
app.use(errorHandler)

connectDb();
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}` ))