const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    item: {
      type: mongoose.Types.ObjectId,
      ref: "Item",
    },
    auction: {
      type: mongoose.Types.ObjectId,
      ref: "Auction",
    },
    paymentIntentId: {
      type: String,
    },
    invoiceNumber: {
      type: String,
      unique: true,
    },
    invoiceNumberIncrement: {
      type: Number,
      unique: true,
    },
    invoiceUrl: {
      type: String,
    },
    amount: { type: Number },
    status: { type: String, default: PAYMENT_STATUS.PENDING },
    paymentTime: { type: String },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

// Create an index on the 'createdAt' field for pagination
paymentSchema.index({ createdAt: 1 });

const payment = mongoose.model("payment", paymentSchema);
module.exports = payment;
