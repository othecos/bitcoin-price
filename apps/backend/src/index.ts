import "reflect-metadata";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import { bitcoinRoutes, BitcoinService } from "./modules/bitcon";
import { BitcoinPrice } from "./entities/BitcoinPrice";
import { BinanceGateway } from "./modules/bitcon/gateways/binance.gateway";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
// eslint-disable-next-line turbo/no-undeclared-env-vars
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/bitcoin", bitcoinRoutes);

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Initialize database and start server
AppDataSource.initialize()
  .then(() => {
    console.log("Database initialized");

    // Start the server
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);

      const bitcoinPriceRepository = AppDataSource.getRepository(BitcoinPrice);
      // Create an instance of BitcoinService
      const bitcoinService = new BitcoinService(
        bitcoinPriceRepository,
        new BinanceGateway()
      );

      // Setup Bitcoin price updates
      bitcoinService.setupBitcoinPriceUpdates(io);
    });
  })
  .catch((error) => {
    console.error("Error initializing database:", error);
  });
