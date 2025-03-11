import { Request, Response } from "express";
import { BitcoinPriceRepositoryType } from "../../entities/BitcoinPrice";
import { BitcoinService } from "./bitcoin.service";
import { BinanceGateway } from "./gateways/binance.gateway";

export class BitcoinController {
  private bitcoinPriceRepository: BitcoinPriceRepositoryType;
  private bitcoinService: BitcoinService;

  constructor(bitcoinPriceRepository: BitcoinPriceRepositoryType) {
    this.bitcoinPriceRepository = bitcoinPriceRepository;
    this.bitcoinService = new BitcoinService(
      bitcoinPriceRepository,
      new BinanceGateway()
    );
  }

  async getLatestPrice(req: Request, res: Response) {
    try {
      const latestPrice = await this.bitcoinService.getLatestPrice();

      if (!latestPrice) {
        const currentPrice = await this.bitcoinService.fetchBitcoinPrice();

        const newPrice = this.bitcoinPriceRepository.create({
          price: currentPrice,
          currency: "USD",
        });

        await this.bitcoinPriceRepository.save(newPrice);

        return res.json({ price: currentPrice });
      }

      return res.json({ price: latestPrice });
    } catch (error) {
      console.error("Error fetching Bitcoin price:", error);
      return res.status(500).json({ error: "Failed to fetch Bitcoin price" });
    }
  }

  async getPriceHistory(req: Request, res: Response) {
    try {
      const { limit = 10 } = req.query;
      const history = await this.bitcoinPriceRepository.find({
        order: { timestamp: "DESC" },
        take: Number(limit),
      });

      return res.json(history);
    } catch (error) {
      console.error("Error fetching Bitcoin price history:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch Bitcoin price history" });
    }
  }
}
