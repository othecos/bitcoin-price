import { useState } from "react";
import { Button } from "@/components/Button";
import { useQuery } from "@tanstack/react-query";
import { Socket } from "socket.io-client";
import { SocketChannels, useSocketListener } from "@/hooks/useSocketListener";
import { Case, Default, SwitchRender } from "@/components/SwitchRender";
import { LocalStorageKeys, LocalStorageService } from "@/services/localstorage";
import { WarningIcon } from "@/icons/warning";
import { CheckIcon } from "@/icons/check";
import { Tooltip } from "@/components/Tooltip";
import { BitcoinService } from "@/services/bitcoin";

interface HomeProps {
  socket: Socket | null;
}

export default function Home({ socket }: HomeProps) {
  const [bitcoinPrice, setBitcoinPrice] = useState<number | null>(null);
  const [userValue, setUserValue] = useState<string>("");
  const [bitcoinAmount, setBitcoinAmount] = useState<number | null>(null);
  console.log("bitcoinAmount", bitcoinAmount);

  useSocketListener(socket, SocketChannels.BITCOIN_PRICE_UPDATE, (data) => {
    setBitcoinPrice(data.price);
  });

  const fetchBitcoinPrice = async () => {
    console.log("fetchBitcoinPrice");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/bitcoin/price`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch bitcoin price");
      }
      const data = await response.json();
      setBitcoinPrice(data.price);
      // Also save the price in local storage have last price even when server is down
      LocalStorageService.setItem(LocalStorageKeys.BITCOIN_PRICE, data.price);
      return data;
    } catch (error) {
      console.error("Error fetching bitcoin price", error);
      const lastPrice = LocalStorageService.getItem(
        LocalStorageKeys.BITCOIN_PRICE
      );
      if (lastPrice) {
        setBitcoinPrice(Number(lastPrice));
        console.log("Using last price", lastPrice);
        return;
      }
      throw new Error("Failed to fetch bitcoin price");
    }
  };
  // Fetch initial bitcoin price
  const { data, isLoading, error } = useQuery({
    queryKey: ["bitcoinPrice"],
    queryFn: fetchBitcoinPrice,
  });
  const priceToDisplay =
    bitcoinPrice || (data?.price ? Number(data.price).toFixed(2) : "N/A");

  const icon = !!error ? (
    <WarningIcon />
  ) : (
    <CheckIcon className="text-green-600" />
  );
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-row items-center gap-2">
          <h1 className="text-2xl font-bold text-center ">Bitcoin Price:</h1>
          <SwitchRender>
            <Case condition={isLoading}>
              <span className="text-gray-600">Loading...</span>
            </Case>
            <Default>
              <div className="flex flex-row items-center gap-2">
                <span
                  className={`text-4xl font-bold ${!!error ? "text-red-600" : "text-green-600"}`}
                >
                  ${priceToDisplay}
                </span>
                {!!error ? (
                  <span className="text-red-600">
                    <Tooltip
                      content="Using cached Bitcoin price from local storage. The request to fetch the latest price failed."
                      position="bottom"
                    >
                      {icon}
                    </Tooltip>
                  </span>
                ) : (
                  <span className="text-green-600">{icon}</span>
                )}
              </div>
            </Default>
          </SwitchRender>
        </div>

        <div className="mt-6">
          <div className="mb-4">
            <label
              htmlFor="bitcoinValue"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Enter USD amount:
            </label>
            <input
              id="bitcoinValue"
              type="number"
              value={userValue}
              onChange={(e) => {
                setUserValue(e.target.value);
                const { value } = BitcoinService.calculateBitcoinAmount(
                  Number(e.target.value),
                  bitcoinPrice || data?.price || 0
                );
                setBitcoinAmount(value);
              }}
              placeholder="Enter USD value"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {Boolean(bitcoinAmount) && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Bitcoin Amount:</span>{" "}
                {bitcoinAmount} BTC
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
