const express = require("express");
const cors = require("cors");
const routes = require("./routes/index");
const dotenv = require("dotenv");
const http = require('http');
const WebSocket = require('ws');

dotenv.config({ path: ".env" });
const errorHandler = require('./middleware/errorHandler');
const connectDB = require("./config/db");
const cronJobs = require('./cronJobs'); // Import the cron job module

const app = express();
const PORT = process.env.PORT || 3000;

// Set global variable for base directory
global.__basedir = __dirname;

// Set allowed origins for CORS
const allowedOrigins = ["http://localhost:5173"];

// Configure CORS middleware
app.use(
  cors({
    origin: allowedOrigins,
    optionsSuccessStatus: 200,
  })
);

// Parse JSON bodies
app.use(express.json());

// Set up routes
app.use("/", routes);

// Error handler middleware (should be placed after all other middleware and routes)
app.use(errorHandler);

// Connect to database
connectDB();

// Create HTTP server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
// Map to store WebSocket connections associated with each auction room
const auctionRooms = new Map();

// WebSocket connection handler
wss.on("connection", function connection(ws, req) {
  // Extract auction room ID from the URL
  const auctionRoomId = req.url.substring(1);

  // Associate WebSocket connection with the auction room
  if (!auctionRooms.has(auctionRoomId)) {
    auctionRooms.set(auctionRoomId, new Set());
  }
  auctionRooms.get(auctionRoomId).add(ws);

  // Handle WebSocket messages (e.g., bid submissions)
  ws.on("message", function incoming(message) {
    // Broadcast the bid to all clients in the auction room
    broadcastToAuctionRoom(auctionRoomId, message);
  });

  // Remove WebSocket connection when closed
  ws.on("close", function () {
    auctionRooms.get(auctionRoomId).delete(ws);
    if (auctionRooms.get(auctionRoomId).size === 0) {
      auctionRooms.delete(auctionRoomId);
    }
  });
});

// Broadcast function to send messages to all clients in an auction room
function broadcastToAuctionRoom(auctionRoomId, message) {
 
  if (auctionRooms.has(auctionRoomId)) {
    auctionRooms.get(auctionRoomId).forEach((ws) => {
      ws.send(message);
    });
  }
}


// Start server
if (process.env.NODE_ENV !== 'test') server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = { app, server, wss };