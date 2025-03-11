import React, { ReactNode, useState } from "react";

interface CardWithFlipProps {
  frontContent: ReactNode;
  backContent: ReactNode;
  frontButtonText?: string;
  className?: string;
}

export const CardWithFlip: React.FC<CardWithFlipProps> = ({
  frontContent,
  backContent,
  frontButtonText = "View Details",
  className = "",
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={`flip-card-container ${className}`}>
      <div className={`flip-card ${isFlipped ? "flipped" : ""}`}>
        {/* Front of the card */}
        <div className="flip-card-front">
          <div className="flip-card-content">
            {frontContent}
            <div className="flip-card-button-container">
              <button
                onClick={handleFlip}
                className="flip-card-button"
                aria-label="Flip card to see details"
              >
                {frontButtonText}
              </button>
            </div>
          </div>
        </div>

        {/* Back of the card */}
        <div className="flip-card-back">
          <div className="flip-card-back-header">
            <button
              onClick={handleFlip}
              className="flip-card-back-button"
              aria-label="Flip card back"
            >
              <BackIcon />
            </button>
          </div>
          <div className="flip-card-content">{backContent}</div>
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
