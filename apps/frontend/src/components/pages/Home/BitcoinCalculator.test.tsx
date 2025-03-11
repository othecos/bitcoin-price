import { render, fireEvent, screen } from "@testing-library/react";
import { BitcoinCalculator } from "./BitcoinCalculator";

describe("BitcoinCalculator", () => {
  it("should display the correct bitcoin amount", () => {
    render(<BitcoinCalculator price={50000} />);
    const input = screen.getByPlaceholderText("Enter USD value");
    fireEvent.change(input, { target: { value: "100" } });
    expect(screen.getByText("0.00200000")).toBeInTheDocument();
  });

  it("should display 0.00000000 for invalid inputs", () => {
    render(<BitcoinCalculator price={50000} />);
    const input = screen.getByPlaceholderText("Enter USD value");
    fireEvent.change(input, { target: { value: "abc" } });
    expect(screen.getByText("0.00000000")).toBeInTheDocument();
  });
});
