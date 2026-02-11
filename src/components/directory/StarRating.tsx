import React from "react";
import { Star } from "lucide-react";

interface Props {
  rating: number;
  size?: "sm" | "md";
  showValue?: boolean;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

const StarRating: React.FC<Props> = ({ rating, size = "sm", showValue = true, interactive = false, onRate }) => {
  const starSize = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.round(rating);
          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onClick={() => onRate?.(star)}
              className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
            >
              <Star
                className={`${starSize} ${
                  filled
                    ? "fill-[hsl(var(--stars-color))] text-[hsl(var(--stars-color))]"
                    : "text-muted-foreground/30"
                }`}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-medium text-muted-foreground ml-0.5">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
