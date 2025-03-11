import { Case, Default, SwitchRender } from "@/components/base/SwitchRender";
import { Tooltip } from "@/components/base/Tooltip";
import { CheckIcon } from "@/icons/check";
import { WarningIcon } from "@/icons/warning";
import { formatMoneyAmount } from "@/services/price";

export const BitcoinPrice = ({
  isLoading,
  price,
  error,
}: {
  isLoading: boolean;
  price: number;
  error: boolean;
}) => {
  const icon = !!error ? (
    <WarningIcon />
  ) : (
    <CheckIcon className="text-green-600" />
  );
  const tooltipText = !!error
    ? "Using cached Bitcoin price from local storage. The request to fetch the latest price failed."
    : "Using the latest Bitcoin price from the server.";
  return (
    <>
      <h1 className="text-2xl font-bold text-center ">Bitcoin Price:</h1>
      <SwitchRender>
        <Case condition={isLoading}>
          <span className="text-gray-600">Loading...</span>
        </Case>
        <Default>
          <div
            className={`flex flex-row items-center gap-2 ${!!error ? "text-red-600" : "text-green-600"}`}
          >
            <span className={`text-4xl font-bold `}>
              {formatMoneyAmount(price, true, 2)}
            </span>
            <span>
              <Tooltip content={tooltipText} position="bottom">
                {icon}
              </Tooltip>
            </span>
          </div>
        </Default>
      </SwitchRender>
    </>
  );
};
