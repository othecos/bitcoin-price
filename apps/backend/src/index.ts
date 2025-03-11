import "reflect-metadata";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import { createBitcoinRoutes } from "./modules/bitcon/bitcoin.routes";
import { BitcoinFactory } from "./modules/bitcon/bitcoin.factory";
import { BitcoinPrice } from "./entities/BitcoinPrice";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
// eslint-disable-next-line turbo/no-undeclared-env-vars
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  },
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const bootstrap = async () => {
  // Intialize database prior to starting the server
  await AppDataSource.initialize();

  // Setup dependencies
  const repository = AppDataSource.getRepository(BitcoinPrice);
  const bitcoinService = BitcoinFactory.createService(repository);

  // Setup routes
  app.use("/api/bitcoin", createBitcoinRoutes({ service: bitcoinService }));

  // Setup Bitcoin price updates
  bitcoinService.setupBitcoinPriceUpdates(io);

  // Start the server
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

bootstrap().catch(console.error);
