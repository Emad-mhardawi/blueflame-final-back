const express = require('express');
const router = express.Router();
const PreviousWorkController = require('../controllers/previousWorkController');

 
router.post('/add-previous-work',  PreviousWorkController.PostAddPreviousWork);
router.get('/previous-work',  PreviousWorkController.getPreviousWork);



module.exports = router;