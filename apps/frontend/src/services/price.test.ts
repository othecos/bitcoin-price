import { formatMoneyAmount } from "./price";

describe("formatMoneyAmount", () => {
  describe("without currency symbol", () => {
    it("should format integer numbers correctly", () => {
      expect(formatMoneyAmount(1000, false)).toBe("1,000.00");
      expect(formatMoneyAmount(0, false)).toBe("0.00");
      expect(formatMoneyAmount(1000000, false)).toBe("1,000,000.00");
    });

    it("should format decimal numbers correctly", () => {
      expect(formatMoneyAmount(1000.5, false)).toBe("1,000.50");
      expect(formatMoneyAmount(1000.55, false)).toBe("1,000.55");
      expect(formatMoneyAmount(1000.555, false)).toBe("1,000.56");
      expect(formatMoneyAmount(0.01, false)).toBe("0.01");
      expect(formatMoneyAmount(0.1, false)).toBe("0.10");
    });

    it("should format string decimal numbers correctly", () => {
      expect(formatMoneyAmount("1000.5", false)).toBe("1,000.50");
      expect(formatMoneyAmount("1000.55", false)).toBe("1,000.55");
      expect(formatMoneyAmount("0.01", false)).toBe("0.01");
      expect(formatMoneyAmount("0.1", false)).toBe("0.10");
    });

    it("should format string numbers correctly", () => {
      expect(formatMoneyAmount("1000", false)).toBe("1,000.00");
      expect(formatMoneyAmount("0", false)).toBe("0.00");
      expect(formatMoneyAmount("1000000", false)).toBe("1,000,000.00");
    });

    it("should handle undefined values", () => {
      expect(formatMoneyAmount(undefined, false)).toBe("0.00");
    });

    it("should respect custom decimal places", () => {
      expect(formatMoneyAmount(1000, false, 3)).toBe("1,000.000");
      expect(formatMoneyAmount(1000, false, 0)).toBe("1,000");
      expect(formatMoneyAmount(1000, false, 4)).toBe("1,000.0000");
      expect(formatMoneyAmount(1000.5555, false, 4)).toBe("1,000.5555");
      expect(formatMoneyAmount(1000.5555, false, 2)).toBe("1,000.56");
      expect(formatMoneyAmount(1000.5555, false, 3)).toBe("1,000.556");
    });
  });

  describe("with currency symbol", () => {
    it("should format integer numbers correctly", () => {
      expect(formatMoneyAmount(1000, true)).toBe("$1,000.00");
      expect(formatMoneyAmount(0, true)).toBe("$0.00");
      expect(formatMoneyAmount(1000000, true)).toBe("$1,000,000.00");
    });

    it("should format decimal numbers correctly", () => {
      expect(formatMoneyAmount(1000.5, true)).toBe("$1,000.50");
      expect(formatMoneyAmount(1000.55, true)).toBe("$1,000.55");
      expect(formatMoneyAmount(1000.555, true)).toBe("$1,000.56");
      expect(formatMoneyAmount(0.01, true)).toBe("$0.01");
      expect(formatMoneyAmount(0.1, true)).toBe("$0.10");
    });

    it("should format string decimal numbers correctly", () => {
      expect(formatMoneyAmount("1000.5", true)).toBe("$1,000.50");
      expect(formatMoneyAmount("1000.55", true)).toBe("$1,000.55");
      expect(formatMoneyAmount("0.01", true)).toBe("$0.01");
      expect(formatMoneyAmount("0.1", true)).toBe("$0.10");
    });

    it("should format string numbers correctly", () => {
      expect(formatMoneyAmount("1000", true)).toBe("$1,000.00");
      expect(formatMoneyAmount("0", true)).toBe("$0.00");
      expect(formatMoneyAmount("1000000", true)).toBe("$1,000,000.00");
    });

    it("should handle undefined values", () => {
      expect(formatMoneyAmount(undefined, true)).toBe("$0.00");
    });

    it("should respect custom decimal places", () => {
      expect(formatMoneyAmount(1000, true, 3)).toBe("$1,000.000");
      expect(formatMoneyAmount(1000, true, 0)).toBe("$1,000");
      expect(formatMoneyAmount(1000, true, 4)).toBe("$1,000.0000");
      expect(formatMoneyAmount(1000.5555, true, 4)).toBe("$1,000.5555");
      expect(formatMoneyAmount(1000.5555, true, 2)).toBe("$1,000.56");
      expect(formatMoneyAmount(1000.5555, true, 3)).toBe("$1,000.556");
    });
  });

  describe("default parameters", () => {
    it("should use default values when parameters are omitted", () => {
      expect(formatMoneyAmount(1000)).toBe("1,000.00");
      expect(formatMoneyAmount("1000")).toBe("1,000.00");
      expect(formatMoneyAmount(1000.5)).toBe("1,000.50");
      expect(formatMoneyAmount("1000.5")).toBe("1,000.50");
      expect(formatMoneyAmount(1000.555)).toBe("1,000.56");
    });
  });
});
