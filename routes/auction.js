// routes/index.js
const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionController');
const { body } = require('express-validator');

router.get('/auction', auctionController.getAuctions);
router.post('/auction',auctionController.addAuction);


module.exports = router;
