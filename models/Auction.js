const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const auctionSchema = new Schema({
  item: {
    type: Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  price:{
    type: Number,
    required: true
  },
  reservePrice:{
    type: Number,
    required: true,
  },
  duration: {
    type:Number
  },
  startTime: {
    type:Date
  },
  winnerSelected:{
    type: Boolean
  },
  winner:{
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Finished'],
    default: 'Upcoming',
  },
  createdBy:{
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  

});

auctionSchema.index({createdAt:1});

const Auction = mongoose.model("Auction",auctionSchema);

module.exports = Auction;