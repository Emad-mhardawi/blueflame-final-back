const express = require('express');
const router = express.Router();
const portraitController = require('../controllers/portraitController');
const protect = require('../middleware/authMiddleware');
 



router.post('/addportrait',portraitController.addPortrait);
router.get('/portraits',portraitController.getPortraits);


module.exports = router;