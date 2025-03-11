import { BINANCE_BITCOIN_PRICE_URL } from "../bitcoin.constants";
import axios from "axios";
import { BitcoinPriceGateway } from "../bitcoin.gateway";

interface BinanceGetBitcoinPrice {
  symbol: string;
  price: string;
}
export class BinanceGateway implements BitcoinPriceGateway {
  public async getLatestPrice(): Promise<number> {
    try {
      const response = await axios.get<BinanceGetBitcoinPrice>(
        BINANCE_BITCOIN_PRICE_URL,
      );
      return Number(response.data.price);
    } catch (error) {
      console.error("Error fetching Bitcoin price from Binance:", error);
      throw new Error("Failed to fetch Bitcoin price from Binance");
    }
  }
  public getProviderName(): string {
    return "Binance";
  }
}
