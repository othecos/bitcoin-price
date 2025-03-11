import { renderHook } from "@testing-library/react";
import { useEscapeListener } from "./useEscapeListener";
import { fireEvent } from "@testing-library/dom";

describe("useEscapeListener", () => {
  it("should call callback when escape is pressed", () => {
    const callback = jest.fn();
    renderHook(() => useEscapeListener(callback));

    fireEvent.keyDown(window, { key: "Escape" });
    expect(callback).toHaveBeenCalled();
  });
});
