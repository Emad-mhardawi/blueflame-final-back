const express = require('express');
const connectDb = require('./config/db');
const cors =require('cors');
require('dotenv').config()
const {notFound, errorHandler} = require('./middleware/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const multer = require('multer');
const app = express();
app.use(cors())
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
app.use(notFound)
app.use(errorHandler)

connectDb();
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}` ))