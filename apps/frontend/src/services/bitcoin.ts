import { LocalStorageKeys, LocalStorageService } from "./localstorage";

export interface BitcoinHistoryData {
  timestamp: string;
  price: number;
}

export class BitcoinService {
  static calculateBitcoinAmount(value: number, price: number) {
    if (!value || isNaN(Number(value)) || Number(value) <= 0) {
      return { value: 0, error: "Invalid value" };
    }

    const currentPrice = price || 0;
    if (currentPrice <= 0) {
      return { value: 0, error: "Invalid price" };
    }

    // Calculate how many bitcoins the value would buy

    const bitcoinAmount = Number(value) / currentPrice;
    return { value: bitcoinAmount, error: null };
  }

  static getBitcoinPriceFromLocalStorage() {
    const price = LocalStorageService.getItem(LocalStorageKeys.BITCOIN_PRICE);
    return price ? Number(price) : null;
  }

  static setBitcoinPriceInLocalStorage(price: string | number) {
    LocalStorageService.setItem(
      LocalStorageKeys.BITCOIN_PRICE,
      price.toString(),
    );
  }
  static getBitcoinHistoryFromLocalStorage() {
    const history = LocalStorageService.getItem(
      LocalStorageKeys.BITCOIN_HISTORY,
    );
    return history ? (JSON.parse(history) as BitcoinHistoryData[]) : [];
  }

  static setBitcoinHistoryInLocalStorage(history: any[]) {
    LocalStorageService.setItem(
      LocalStorageKeys.BITCOIN_HISTORY,
      JSON.stringify(history),
    );
  }
}
