const Auction = require("../models/Auction");
const Item = require("../models/Item");
const Bid = require("../models/Bid");

const auctionController = {};

auctionController.getAuctions = async (req, res) => {
  try {
    const page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10;
    const auctions = await Auction.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("item");

    const bidPromises = auctions.map(async (auction) => {
      const bids = await Bid.find({ auction: auction._id });
      return auction.set("bids", bids, { strict: false }); // Combine auction data with fetched bids
    });

    // Wait for all bid promises to resolve and combine auction data with bids
    const auctionsWithBids = await Promise.all(bidPromises);
    // Return successful response with updated auctions
    return res.status(200).json(auctionsWithBids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

auctionController.addAuction = async (req, res) => {
  try {
    const { item, price, reservePrice, duration, startTime, createdBy } =
      req.body;
    const auction = new Auction({
      item,
      price,
      reservePrice,
      duration,
      startTime,
      createdBy,
    });
    await auction.save();
    await Item.updateOne({ _id: item }, { status: "Upcoming Auction" });
    return res.status(200).json(auction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
auctionController.getAuction = async (req, res) => {
  try {
    const auction = await Auction.find({ _id: req.id }).populate("item");
    const bids = await Bid.find({ auction: req.id });
    auction.set("bids", bids, { strict: false });
    return res.status(200).json(auction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = auctionController;
