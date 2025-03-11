import React, { useEffect, useRef, useState } from "react";

interface SlotCounterProps {
  value: number;
  duration?: number;
  formatValue?: (value: number) => string;
  className?: string;
}

export const SlotCounter: React.FC<SlotCounterProps> = ({
  value,
  duration = 500,
  formatValue = (val) => val.toString(),
  className = "",
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const previousValue = useRef(value);
  const animationFrame = useRef<number>();

  useEffect(() => {
    if (value !== previousValue.current) {
      setIsAnimating(true);
      const startTime = Date.now();
      const startValue = previousValue.current;
      const endValue = value;
      const difference = endValue - startValue;

      const animate = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + difference * easeOutQuart;

        setDisplayValue(currentValue);

        if (progress < 1) {
          animationFrame.current = requestAnimationFrame(animate);
        } else {
          setDisplayValue(endValue);
          setIsAnimating(false);
          previousValue.current = endValue;
        }
      };

      animate();
    }

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [value, duration]);

  return (
    <div className={`font-mono transition-all ${className}`}>
      {formatValue(Math.round(displayValue * 100) / 100)}
    </div>
  );
};
