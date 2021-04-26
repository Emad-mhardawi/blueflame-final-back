const express = require('express');
const cors =require('cors');

const app = express();



app.use(cors())

app.use('/', (req, res, next)=>{
    console.log('working')
});


app.listen(5000)