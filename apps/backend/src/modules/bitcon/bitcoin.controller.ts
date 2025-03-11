import { Request, Response } from "express";
import { BitcoinService } from "./bitcoin.service";

export class BitcoinController {
  private bitcoinService: BitcoinService;

  constructor(bitcoinService: BitcoinService) {
    this.bitcoinService = bitcoinService;
  }

  async getLatestPrice(req: Request, res: Response) {
    try {
      const latestPrice = await this.bitcoinService.getLatestPrice();

      if (!latestPrice) {
        const currentPrice = await this.bitcoinService.fetchBitcoinPrice();

        await this.bitcoinService.saveBitcoinPrice(currentPrice);

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
      const history = await this.bitcoinService.getPriceHistory(Number(limit));

      return res.json(history);
    } catch (error) {
      console.error("Error fetching Bitcoin price history:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch Bitcoin price history" });
    }
  }
}
