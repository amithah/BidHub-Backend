// controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const env = require("../config/env");

const authController = {};

authController.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword });
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

authController.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ "email":username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  // Generate access token
  const accessToken = jwt.sign(
    { email: user.email },
    env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  // Generate refresh token (store it in DB for better security)
  const refreshToken = jwt.sign(
    { email: user.email },
    env.REFRESH_TOKEN_SECRET
  );

user.set("accessToken",accessToken,{strict:false})

user.set("refreshToken",refreshToken,{strict:false})

  res.status(200).json(user);
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

authController.refreshToken = (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (refreshToken == null) return res.sendStatus(401);

  jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = jwt.sign(
      { email: user.email },
      env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ accessToken });
  });
};

module.exports = authController;
