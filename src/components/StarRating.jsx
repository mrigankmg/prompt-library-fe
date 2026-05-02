import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Star from "./Star";

const stars = Array.from({ length: 5 }, (_, i) => i + 1);

export default function StarRating({ prompt, userRating, onRatingSubmit }) {
  const { isAuthenticated } = useAuth();
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (score) => {
    onRatingSubmit(prompt.id, score);
  };

  const userRatingDisplay = hoverRating || userRating || 0;
  const averageRating = prompt.averageRating || 0;
  const ratingCount = prompt.ratingCount;

  const getAverageStarFillPercentage = (star) => {
    if (star <= Math.floor(averageRating)) return 1;
    if (star === Math.ceil(averageRating)) return averageRating % 1;
    return 0;
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 min-w-max">
          <div className="flex gap-0.5">
            {stars.map((star) => (
              <Star
                key={`avg-${star}`}
                rating={star}
                fillPercentage={getAverageStarFillPercentage(star)}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {averageRating > 0 ? averageRating.toFixed(1) : "—"}
          </span>
          {ratingCount != null && ratingCount > 0 ? (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({ratingCount})
            </span>
          ) : null}
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Your rating:
            </span>
            <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
              {stars.map((star) => (
                <Star
                  key={`user-${star}`}
                  rating={star}
                  fillPercentage={star <= userRatingDisplay ? 1 : 0}
                  interactive={true}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoverRating(star)}
                />
              ))}
            </div>
            {userRating > 0 && (
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {userRating}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
