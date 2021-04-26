const express = require('express');
const connectDb = require('./config/db');
const cors =require('cors');
require('dotenv').config()

const app = express();



app.use(cors())

app.use('/', (req, res, next)=>{
    console.log('working')
});



connectDb();
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}` ))