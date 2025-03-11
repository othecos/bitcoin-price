import { render, fireEvent, screen } from "@testing-library/react";
import { CardWithFlip } from "./CardWithFlip";

describe("CardWithFlip", () => {
  it("should render front content by default", () => {
    render(
      <CardWithFlip
        frontContent={<div>Front</div>}
        backContent={<div>Back</div>}
      />,
    );
    expect(screen.getByText("Front")).toBeInTheDocument();
  });

  it("should flip when button is clicked", () => {
    render(
      <CardWithFlip
        frontContent={<div>Front</div>}
        backContent={<div>Back</div>}
        frontButtonText="View Details"
        secondaryButtonText="View History"
      />,
    );
    expect(screen.getByText("View History")).toBeInTheDocument();
    fireEvent.click(screen.getByText("View Details"));
    expect(screen.getByText("Front")).toBeInTheDocument();
  });
});
