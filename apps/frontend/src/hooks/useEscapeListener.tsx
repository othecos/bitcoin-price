import { useEffect } from "react";

export const useEscapeListener = (
  callback: () => void,
  onClear?: () => void,
) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        callback();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
      if (onClear) {
        onClear();
      }
    };
  }, [callback, onClear]);
};
