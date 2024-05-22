// controllers/userController.js
const User = require('../models/User');
const { validationResult } = require('express-validator');
const CustomError = require('../utils/CustomError');
const bcrypt = require("bcrypt");


// Controller for handling user-related operations
const userController = {};

// Controller action for fetching users with pagination
userController.getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(limit);
    
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Controller action for creating a new user
userController.createUser = async (req, res) => {
  // Validate user input
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // throw new CustomError('Validation failed', 400);
    return res.status(400).json({ errors: errors.array() });
  }
  // Extract user data from request body
  const { name, email, phone, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    const newUser = await User.create({ name, email, phone, "password":hashedPassword });
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Export controller object
module.exports = userController;
