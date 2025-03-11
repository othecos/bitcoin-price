import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Socket } from "socket.io-client";
import { SocketChannels, useSocketListener } from "@/hooks/useSocketListener";
import { BitcoinPrice } from "@/components/pages/Home/BitcoinPrice";
import { BitcoinCalculator } from "@/components/pages/Home/BitcoinCalculator";
import { CardWithFlip } from "@/components/base/CardWithFlip";
import { BitcoinHistory } from "@/components/pages/Home/BitcoinHistory/BitcoinHistory";
import { BitcoinService } from "@/services/bitcoin";
import { Modal } from "@/components/base/Modal";

interface HomeProps {
  socket: Socket | null;
}

export default function Home({ socket }: HomeProps) {
  const [bitcoinPrice, setBitcoinPrice] = useState<number | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);

  useSocketListener(socket, SocketChannels.BITCOIN_PRICE_UPDATE, (data) => {
    setBitcoinPrice(data.price);
  });

  const fetchBitcoinPrice = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/bitcoin/price`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch bitcoin price");
      }
      const data = await response.json();
      setBitcoinPrice(data.price);
      if (data.price !== null) {
        // Also save the price in local storage have last price even when server is down
        BitcoinService.setBitcoinPriceInLocalStorage(data.price);
      }
      return data;
    } catch (error) {
      console.error("Error fetching bitcoin price", error);
      // Try to get the last price from local storage
      const lastPrice = BitcoinService.getBitcoinPriceFromLocalStorage();
      // If last price is available, use it
      if (lastPrice !== null) {
        setBitcoinPrice(lastPrice);
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
    initialData: BitcoinService.getBitcoinPriceFromLocalStorage(),
  });
  const priceToDisplay = bitcoinPrice || (data?.price ? Number(data.price) : 0);

  const openHistoryModal = () => {
    setIsHistoryModalOpen(true);
  };

  const closeHistoryModal = () => {
    setIsHistoryModalOpen(false);
  };
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
            <BitcoinHistory isInModal={false} />
          </div>
        }
        frontButtonText="See history as card"
        secondaryButtonText="See history as modal"
        secondaryButtonOnClick={openHistoryModal}
      />

      {/* Bitcoin History Modal */}
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={closeHistoryModal}
        title="Bitcoin Price History"
      >
        <BitcoinHistory isInModal={true} />
      </Modal>
    </div>
  );
}
