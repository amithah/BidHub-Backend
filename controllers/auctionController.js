const Auction = require("../models/Auction");
const Item = require("../models/Item");
const Bid = require("../models/Bid");
const { default: mongoose } = require("mongoose");

const auctionController = {};

auctionController.getAuctions = async (req, res) => {
  try {
    const page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10;
    const auctions = await Auction.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("item")
      .populate("createdBy");

    const bidPromises = auctions.map(async (auction) => {
      const bids = await Bid.find({ auction: auction._id }).sort({ createdAt: -1 });
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
    // Use findById to fetch a single auction by its ID
    let auction = await Auction.findById(req.params.id)
      .populate("item")
      .populate("createdBy")
      .exec();

    // Check if the auction exists
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    // Fetch bids related to the auction
    const bids = await Bid.find({ auction: auction._id }).sort({ createdAt: -1 }).exec();

    // Convert the auction document to a plain JavaScript object
    let auctionObject = auction.toObject();
    
    // Add the bids to the auction object
    auctionObject.bids = bids;

    // Return the modified auction object
    return res.status(200).json(auctionObject);
  } catch (err) {
    // Handle errors and send a 500 status with the error message
    return res.status(500).json({ message: err.message });
  }
};
auctionController.getPreviousBids = async(id)=> {
  try {
    const auction = await Auction.findById(id);
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }
    const bids = await Bid.find({ auction: auction._id }).sort({ createdAt: -1 }).populate('addedBy');

    return bids;
  } catch (err) {
    return { message: err.message };
  }
}
auctionController.updateAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }
    const updatedAuction = await Auction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(200).json(updatedAuction);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


module.exports = auctionController;
