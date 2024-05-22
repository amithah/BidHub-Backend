const mongoose = require("mongoose");
const { schema } = require("./User");
const Schema = mongoose.Schema;

const bidSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    auction: {
        type: Schema.Types.ObjectId,
        ref : 'Auctin'
    },
    addedBy: {
        type: Schema.Types.ObjectId,
        ref : 'User'
    }
  },
  { timestamps: true }
);

// Create an index on the 'createdAt' field for pagination
bidSchema.index({ createdAt: 1 });

const Bid = mongoose.model("bid",bidSchema);
module.exports = Bid;