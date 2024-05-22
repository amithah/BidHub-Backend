// routes/index.js
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { body } = require('express-validator');

router.get('/item', itemController.getItems);
router.post('/item',itemController.addItem);


module.exports = router;
