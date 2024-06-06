const express = require("express");
const cors = require("cors");
const routes = require("./routes/index");
const dotenv = require("dotenv");
const http = require('http');
const { Server } = require("socket.io");

dotenv.config({ path: ".env" });
const errorHandler = require('./middleware/errorHandler');
const connectDB = require("./config/db");
const cronJobs = require('./cronJobs'); // Import the cron job module
const { getPreviousBids } = require("./controllers/auctionController");

const app = express();
const PORT = process.env.PORT || 3000;

// Set global variable for base directory
global.__basedir = __dirname;

// Set allowed origins for CORS
const origin = ['https://bid-hub.vercel.app', 'http://localhost:5173'];
app.use(cors({
    origin,
    optionsSuccessStatus: 200,
}));

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

// Initialize socket.io server
const io = new Server(server, {
    cors: {
        origin,
        methods: ["GET", "POST"]
    },
});

// Map to store socket connections associated with each auction room
const auctionRooms = new Map();

// Socket.io connection handler
io.on("connection", (socket) => {
    // Extract auction room ID from the query parameter
    const auctionRoomId = socket.handshake.query.roomId;

    // Associate socket connection with the auction room
    if (!auctionRooms.has(auctionRoomId)) {
        auctionRooms.set(auctionRoomId, new Set());
    }
    auctionRooms.get(auctionRoomId).add(socket.id);

    // Fetch and send previous bids to the newly connected client
    getPreviousBids(auctionRoomId).then((previousBids) => {
        socket.emit("previousBids", previousBids);
    }).catch((err) => {
        console.error("Error fetching previous bids:", err);
    });

    // Handle socket messages (e.g., bid submissions)
    socket.on("message", (message) => {
        // Broadcast the bid to all clients in the auction room
        broadcastToAuctionRoom(auctionRoomId, message);
    });

    socket.on("error", (error) => {
        console.error("Socket error:", error);
        // Implement additional error handling logic here (e.g., restart server)
    });

    socket.on("disconnect", () => {
        auctionRooms.get(auctionRoomId).delete(socket.id);
        if (auctionRooms.get(auctionRoomId).size === 0) {
            auctionRooms.delete(auctionRoomId);
        }
    });
});

// Broadcast function to send messages to all clients in an auction room
function broadcastToAuctionRoom(auctionRoomId, message) {
    if (auctionRooms.has(auctionRoomId)) {
        auctionRooms.get(auctionRoomId).forEach((socketId) => {
            io.to(socketId).emit("message", message);
        });
    }
}

// Start server
if (process.env.NODE_ENV !== 'test') server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

module.exports = { app, server, io };
