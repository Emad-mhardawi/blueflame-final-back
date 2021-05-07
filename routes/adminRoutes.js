const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const protect = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdminMiddleware');
 
router.get('/admin/users',protect, isAdmin, adminController.getUsers);




module.exports = router;