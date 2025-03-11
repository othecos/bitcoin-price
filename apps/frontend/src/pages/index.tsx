import { useState } from "react";
import { Button } from "@/components/base/Button";
import { useQuery } from "@tanstack/react-query";
import { Socket } from "socket.io-client";
import { SocketChannels, useSocketListener } from "@/hooks/useSocketListener";
import { Case, Default, SwitchRender } from "@/components/base/SwitchRender";
import { LocalStorageKeys, LocalStorageService } from "@/services/localstorage";
import { WarningIcon } from "@/icons/warning";
import { CheckIcon } from "@/icons/check";
import { Tooltip } from "@/components/base/Tooltip";
import { BitcoinService } from "@/services/bitcoin";
import { formatMoneyAmount } from "@/services/price";
import { BitcoinPrice } from "@/components/pages/Home/BitcoinPrice";
import { BitcoinCalculator } from "@/components/pages/Home/BitcoinCalculator";
import { CardWithFlip } from "@/components/base/CardWithFlip";
import { BitcoinHistory } from "@/components/pages/Home/BitcoinHistory";

interface HomeProps {
  socket: Socket | null;
}

export default function Home({ socket }: HomeProps) {
  const [bitcoinPrice, setBitcoinPrice] = useState<number | null>(null);

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
  const priceToDisplay = bitcoinPrice || (data?.price ? Number(data.price) : 0);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <CardWithFlip
        frontContent={
          <div>
            <div className="flex flex-row items-center gap-2">
              <BitcoinPrice
                isLoading={isLoading}
                price={priceToDisplay}
                error={!!error}
              />
            </div>

            <BitcoinCalculator price={priceToDisplay} />
          </div>
        }
        backContent={
          <div>
            <h3 className="text-lg font-semibold mb-2">Bitcoin History</h3>
            <BitcoinHistory />
          </div>
        }
        frontButtonText="See history"
      />
    </div>
  );
}
