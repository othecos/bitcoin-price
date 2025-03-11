import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { formatMoneyAmount } from "@/services/price";
import { BitcoinHistoryData, BitcoinService } from "@/services/bitcoin";
import { WarningIcon } from "@/icons/warning";
import { Tooltip } from "@/components/base/Tooltip";
import { BitcoinChart } from "./BitcoinChart";
import { LoadingState } from "@/components/base/LoadingState";

interface BitcoinHistoryProps {
  isInModal?: boolean;
}

export const BitcoinHistory = ({ isInModal = false }: BitcoinHistoryProps) => {
  const fetchBitcoinHistory = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/bitcoin/history`
    );
    const data = await response.json();
    if (data.length > 0) {
      BitcoinService.setBitcoinHistoryInLocalStorage(data);
    }
    return data;
  };
  const { data, isLoading, error, isFetched } = useQuery<
    BitcoinHistoryData[],
    Error
  >({
    queryKey: ["bitcoinHistory"],
    queryFn: () => fetchBitcoinHistory(),
    initialData: BitcoinService.getBitcoinHistoryFromLocalStorage(),
  });

  if (isLoading) {
    return <LoadingState isSquare />;
  }

  const messageColor = error ? "text-red-600" : "text-gray-500";
  return (
    <div id="bitcoin-history-chart">
      <BitcoinChart
        data={data}
        width={isInModal ? 700 : 500}
        height={isInModal ? 400 : 300}
        error={!!error}
      />
      {isFetched && data.length === 0 && (
        <div className="text-center py-4">No price history available</div>
      )}
      <div
        className={`flex items-center justify-center gap-2 text-xs text-center ${messageColor}`}
      >
        <span>Bitcoin price history over time</span>{" "}
        {error && (
          <Tooltip
            content="Error loading price history. Using local storage as fallback."
            position="top"
          >
            <WarningIcon className="w-4 h-4" />
          </Tooltip>
        )}
      </div>
    </div>
  );
};
