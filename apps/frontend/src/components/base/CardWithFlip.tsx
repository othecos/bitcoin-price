import React, { ReactNode, useState } from "react";

interface CardWithFlipProps {
  frontContent: ReactNode;
  backContent: ReactNode;
  frontButtonText?: string;
  secondaryButtonText?: string;
  secondaryButtonOnClick?: () => void;
  className?: string;
}

export const CardWithFlip: React.FC<CardWithFlipProps> = ({
  frontContent,
  backContent,
  frontButtonText = "View Details",
  secondaryButtonText = "View History",
  secondaryButtonOnClick = () => {},
  className = "",
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className={`perspective-1000 w-full h-full max-w-[600px] ${className}`}
    >
      <div
        className="relative w-full h-full min-h-[500px] transition-transform duration-800 transform-style-3d"
        // Tailwind doesn't support runtime classes, so we need to use inline styles
        style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Front of the card */}
        <div className="absolute w-full h-full backface-hidden rounded-lg shadow-md flex flex-col bg-white">
          <div className="p-6 flex-1 flex flex-col">
            {frontContent}
            <div className="flex justify-center mt-auto pt-4 gap-2">
              <button
                onClick={handleFlip}
                className="bg-blue-500 text-white border-none py-2 px-4 rounded font-medium cursor-pointer transition-colors hover:bg-blue-600"
                aria-label="Flip card to see details"
              >
                {frontButtonText}
              </button>
              <button
                onClick={secondaryButtonOnClick}
                className="bg-blue-500 text-white border-none py-2 px-4 rounded font-medium cursor-pointer transition-colors hover:bg-blue-600"
                aria-label="Flip card to see details"
              >
                {secondaryButtonText}
              </button>
            </div>
          </div>
        </div>

        {/* Back of the card */}
        <div
          className="absolute w-full h-full backface-hidden rounded-lg shadow-md flex flex-col bg-white"
          // Tailwind doesn't support runtime classes, so we need to use inline styles
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="p-3 flex items-center border-b border-gray-200">
            <button
              onClick={handleFlip}
              className="bg-transparent border-none text-gray-600 cursor-pointer p-1 flex items-center justify-center rounded-full transition-colors hover:bg-gray-100 hover:text-gray-800"
              aria-label="Flip card back"
            >
              <BackIcon />
            </button>
          </div>
          <div className="p-6 flex-1">{backContent}</div>
        </div>
      </div>
    </div>
  );
};

// Simple back arrow icon component
const BackIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);
