const express = require('express');
const router = express.Router();
const controller = require('../controllers/usercontrollers');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.post('/', controller.createUser);
router.post('/login', controller.loginUser);
router.get('/', verifyToken, isAdmin, controller.getAllUsers);

module.exports = router;