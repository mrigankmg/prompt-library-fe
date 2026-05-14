export default function Star({
  fillPercentage = 0,
  interactive = false,
  onClick,
  onMouseEnter,
  rating,
  checked = false,
}) {
  const percentage = fillPercentage * 100;

  const starStyle =
    percentage > 0 && percentage < 100
      ? {
          background: `linear-gradient(90deg, rgb(250, 204, 21) ${percentage}%, rgb(209, 213, 219) ${percentage}%)`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }
      : {};

  const colorClass =
    fillPercentage === 1
      ? "text-yellow-400"
      : "text-gray-300 dark:text-gray-600";

  if (!interactive) {
    return (
      <span aria-hidden="true" style={starStyle} className={`text-lg ${colorClass}`}>
        ★
      </span>
    );
  }

  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      aria-label={`Rate ${rating} ${rating === 1 ? "star" : "stars"}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      style={starStyle}
      className={`text-lg rounded transition-transform hover:scale-110 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 ${colorClass}`}
    >
      ★
    </button>
  );
}
