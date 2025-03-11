const usNumberFormatter = {
  withoutCurrency: (decimals: number) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }),
  withCurrency: (decimals: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }),
};

// this function takes amount in cents
export const formatMoneyAmount = (
  amount: string | number | undefined,
  withCurrency = false,
  decimals = 2,
): string => {
  const value = amount
    ? typeof amount === "string"
      ? parseFloat(amount)
      : amount
    : 0;

  return withCurrency
    ? usNumberFormatter.withCurrency(decimals).format(value)
    : usNumberFormatter.withoutCurrency(decimals).format(value);
};
