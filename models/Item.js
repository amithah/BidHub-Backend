const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    status:{
      type:"String"
    }
  },
  { timestamps: true }
);

// Create an index on the 'createdAt' field for pagination
itemSchema.index({ createdAt: 1 });

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
