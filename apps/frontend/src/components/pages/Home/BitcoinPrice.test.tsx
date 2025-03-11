import { render, screen } from "@testing-library/react";
import { BitcoinPrice } from "./BitcoinPrice";

describe("BitcoinPrice", () => {
  it("should show loading state", () => {
    render(<BitcoinPrice isLoading={true} price={0} error={false} />);
    expect(screen.getByTestId("loading-state")).toBeInTheDocument();
  });

  it("should display price with error state", () => {
    render(<BitcoinPrice isLoading={false} price={50000} error={true} />);
    expect(screen.getByText("$50,000.00")).toBeInTheDocument();
    expect(screen.getByTestId("warning-icon")).toBeInTheDocument();
  });
});
