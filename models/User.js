// models/User.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      // Validate email format using a regular expression
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      // You can add more validation rules for phone number format if needed
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create an index on the 'createdAt' field for pagination
userSchema.index({ createdAt: 1 });

const User = mongoose.model("User", userSchema);

module.exports = User;
