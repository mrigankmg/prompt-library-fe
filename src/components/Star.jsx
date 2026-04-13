export default function Star({
  fillPercentage = 0,
  interactive = false,
  onClick,
  onMouseEnter,
  rating,
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

  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      disabled={!interactive}
      style={starStyle}
      className={`text-lg transition-transform focus:outline-none ${
        fillPercentage === 1
          ? "text-yellow-400"
          : "text-gray-300 dark:text-gray-600"
      } ${interactive ? "hover:scale-110 cursor-pointer" : "cursor-default"}`}
      aria-label={interactive ? `Rate ${rating} stars` : undefined}
    >
      ★
    </button>
  );
}
