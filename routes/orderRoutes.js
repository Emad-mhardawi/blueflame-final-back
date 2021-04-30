const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const protect = require('../middleware/authMiddleware');
 
router.post('/create-checkout-session',protect,  orderController.checkoutSession);




module.exports = router;