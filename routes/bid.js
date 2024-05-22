// routes/index.js
const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');

router.get('/bid', bidController.getBids);
router.post('/bid',bidController.addBid);


module.exports = router;
