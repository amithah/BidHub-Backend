// routes/index.js
const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionController');
const { body } = require('express-validator');

router.get('/auction', auctionController.getAuctions);
router.get('/auction/:id',auctionController.getAuction);
router.post('/auction',auctionController.addAuction);
router.patch('/auction/:id', auctionController.updateAuction);




module.exports = router;
