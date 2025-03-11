import { BitcoinService } from "@/services/bitcoin";
import { formatMoneyAmount } from "@/services/price";
import { useEffect, useState } from "react";

export const BitcoinCalculator = ({ price }: { price: number }) => {
  const [displayValue, setDisplayValue] = useState<string>("");
  const [bitcoinAmount, setBitcoinAmount] = useState<number | 0>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Extract just the numeric value (removing currency formatting)
    const numericValue = rawValue.replace(/[^\d.]/g, "");

    // Update the displayed value with formatting
    if (numericValue) {
      setDisplayValue(numericValue);
      const result = BitcoinService.calculateBitcoinAmount(
        parseFloat(numericValue),
        price
      );
      setBitcoinAmount(result.error ? 0 : result.value);
    } else {
      setDisplayValue("");
      setBitcoinAmount(0);
    }
  };

  const handlePriceChange = (price: number) => {
    if (price) {
      const result = BitcoinService.calculateBitcoinAmount(
        parseFloat(displayValue),
        price
      );
      setBitcoinAmount(result.error ? 0 : result.value);
    }
  };

  useEffect(() => {
    handlePriceChange(price);
  }, [price]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="bitcoinValue"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Enter USD amount:
        </label>
        <input
          id="bitcoinValue"
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          placeholder="Enter USD value"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Bitcoin Amount:</span>{" "}
          {formatMoneyAmount(bitcoinAmount, false, 8)}
        </p>
      </div>
    </div>
  );
};
