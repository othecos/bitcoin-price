import { BitcoinService } from "./bitcoin";

describe("BitcoinService", () => {
  describe("calculateBitcoinAmount", () => {
    it("should correctly calculate bitcoin amount for valid inputs", () => {
      const result = BitcoinService.calculateBitcoinAmount(50000, 25000);
      expect(result.value).toBe(2);
      expect(result.error).toBeNull();
    });

    it("should handle decimal values correctly", () => {
      const result = BitcoinService.calculateBitcoinAmount(12500, 50000);
      expect(result.value).toBe(0.25);
      expect(result.error).toBeNull();
    });

    it("should return error for negative value", () => {
      const result = BitcoinService.calculateBitcoinAmount(-100, 25000);
      expect(result.value).toBe(0);
      expect(result.error).toBe("Invalid value");
    });

    it("should return error for zero value", () => {
      const result = BitcoinService.calculateBitcoinAmount(0, 25000);
      expect(result.value).toBe(0);
      expect(result.error).toBe("Invalid value");
    });

    it("should return error for NaN value", () => {
      const result = BitcoinService.calculateBitcoinAmount(NaN, 25000);
      expect(result.value).toBe(0);
      expect(result.error).toBe("Invalid value");
    });

    it("should return error for negative price", () => {
      const result = BitcoinService.calculateBitcoinAmount(50000, -25000);
      expect(result.value).toBe(0);
      expect(result.error).toBe("Invalid price");
    });

    it("should return error for zero price", () => {
      const result = BitcoinService.calculateBitcoinAmount(50000, 0);
      expect(result.value).toBe(0);
      expect(result.error).toBe("Invalid price");
    });

    it("should handle undefined price", () => {
      const result = BitcoinService.calculateBitcoinAmount(
        50000,
        undefined as unknown as number,
      );
      expect(result.value).toBe(0);
      expect(result.error).toBe("Invalid price");
    });
  });
});
