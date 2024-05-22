const Bid = require("../models/Bid");
const Item = require("../models/Item");


const bidController = {};

bidController.getBids = async (req, res) => {
  try {
    const page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10;
    const bids = await Bid.find({}).skip((page - 1) * limit).limit(limit).populate('item');
    return res.status(200).json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

bidController.addBid = async (req, res) => {
  try {
    const { amount,auction,addedBy } = req.body;
    const bid =  new Bid({ amount,auction,addedBy });
    await bid.save();
    return res.status(200).json(bid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
bidController.getBid = async (req, res) => {
  try {
    const bid = await Bid.find({ _id: req.id });
    return res.status(200).json(bid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = bidController;