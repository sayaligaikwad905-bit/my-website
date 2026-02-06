const express = require('express');
const router = express.Router();
const controller = require('../controllers/servicecontrollers');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', controller.getServices);
router.post('/', verifyToken, isAdmin, controller.createService);

module.exports = router;