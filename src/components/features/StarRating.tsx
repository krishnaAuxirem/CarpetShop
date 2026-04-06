import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export const StarRating = ({ rating, max = 5, size = 16, showValue = false, interactive = false, onChange }: StarRatingProps) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map(i => (
        <button
          key={i}
          type={interactive ? "button" : undefined}
          onClick={interactive && onChange ? () => onChange(i) : undefined}
          className={interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}
        >
          <Star
            style={{ width: size, height: size }}
            className={i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}
          />
        </button>
      ))}
      {showValue && <span className="text-sm text-muted-foreground ml-1">({rating.toFixed(1)})</span>}
    </div>
  );
};
