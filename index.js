const express = require('express');
const connectDb = require('./config/db');
const cors =require('cors');
require('dotenv').config()
const {notFound, errorHandler} = require('./middleware/errorMiddleware');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors())
app.use(express.json());





app.use(userRoutes);
app.use(notFound)
app.use(errorHandler)

connectDb();
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}` ))