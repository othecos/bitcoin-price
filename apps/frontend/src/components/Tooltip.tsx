import { ReactNode, useState } from "react";

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

export const Tooltip = ({
  children,
  content,
  position = "top",
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-md shadow-sm max-w-xs whitespace-normal ${positionClasses[position]}`}
          style={{ width: "max-content", maxWidth: "200px" }}
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === "top"
                ? "top-full -translate-y-1/2 left-1/2 -translate-x-1/2"
                : position === "bottom"
                  ? "bottom-full translate-y-1/2 left-1/2 -translate-x-1/2"
                  : position === "left"
                    ? "left-full -translate-x-1/2 top-1/2 -translate-y-1/2"
                    : "right-full translate-x-1/2 top-1/2 -translate-y-1/2"
            }`}
          />
        </div>
      )}
    </div>
  );
};
