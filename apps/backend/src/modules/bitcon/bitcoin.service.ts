import { Server } from "socket.io";
import {
  BitcoinPrice,
  BitcoinPriceRepositoryType,
} from "../../entities/BitcoinPrice";
import { BitcoinPriceGateway } from "./bitcoin.gateway";
import { BITCOIN_PRICE_UPDATE_INTERVAL } from "./bitcoin.constants";

export class BitcoinService {
  private bitcoinPriceRepository: BitcoinPriceRepositoryType;
  private bitcoinPriceGateway: BitcoinPriceGateway;
  constructor(
    bitcoinPriceRepository: BitcoinPriceRepositoryType,
    bitcoinPriceGateway: BitcoinPriceGateway
  ) {
    this.bitcoinPriceRepository = bitcoinPriceRepository;
    this.bitcoinPriceGateway = bitcoinPriceGateway;
  }

  public async getLatestPrice(): Promise<number | null> {
    const latestPrice = await this.bitcoinPriceRepository.find({
      order: { timestamp: "DESC" },
      take: 1,
    });
    return latestPrice[0]?.price ?? null;
  }

  public async fetchBitcoinPrice(): Promise<number> {
    try {
      const response = await this.bitcoinPriceGateway.getLatestPrice();
      return response;
    } catch (error) {
      console.error("Error fetching Bitcoin price from API:", error);
      throw new Error("Failed to fetch Bitcoin price");
    }
  }

  public async saveBitcoinPrice(price: number): Promise<void> {
    const newPrice = this.bitcoinPriceRepository.create({
      price,
      currency: "USD",
    });
    await this.bitcoinPriceRepository.save(newPrice);
  }

  public async updateBitcoinPrice(io: Server): Promise<void> {
    try {
      const price = await this.fetchBitcoinPrice();

      const newPrice = this.bitcoinPriceRepository.create({
        price,
        currency: "USD",
      });

      await this.bitcoinPriceRepository.save(newPrice);
      io.emit("bitcoin:price-update", { price });
      console.log(`Bitcoin price updated: $${price}`);
    } catch (error) {
      console.error("Error updating Bitcoin price:", error);
    }
  }

  /**
   * Setup Bitcoin price updates
   * @param io - The Socket.IO server instance
   * @description This method sets up the Bitcoin price updates by calling the updateBitcoinPrice method and setting an interval to update the price every 30 seconds
   */
  public setupBitcoinPriceUpdates(io: Server): void {
    const updateInterval = BITCOIN_PRICE_UPDATE_INTERVAL;
    this.updateBitcoinPrice(io);
    setInterval(() => this.updateBitcoinPrice(io), updateInterval);
  }

  public async getPriceHistory(limit: number): Promise<BitcoinPrice[]> {
    return this.bitcoinPriceRepository.find({
      order: { timestamp: "DESC" },
      take: limit,
    });
  }
}
