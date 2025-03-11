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
}
