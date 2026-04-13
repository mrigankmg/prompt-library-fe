import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const VARIANT = {
  default: {
    wrapper: "border-t-2 pt-4",
    button: "rounded-lg border-2 p-2",
    icon: "h-5 w-5",
    gap: "gap-3",
  },
  compact: {
    wrapper: "border-t pt-3",
    button: "rounded-lg border p-1.5",
    icon: "h-4 w-4",
    gap: "gap-2",
  },
};

export default function PaginationFooter({
  page,
  totalPages,
  onPrev,
  onNext,
  variant = "default",
  prevAriaLabel = "Previous page",
  nextAriaLabel = "Next page",
  leading = null,
  className = "",
}) {
  const theme = useContext(ThemeContext);
  const v = VARIANT[variant] ?? VARIANT.default;
  const hasLeading = leading != null && leading !== false;
  const rowLayout = hasLeading
    ? `flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between ${v.gap}`
    : `flex items-center justify-center md:justify-end ${v.gap}`;

  return (
    <div className={`${rowLayout} ${v.wrapper} ${theme.border} ${className}`}>
      {hasLeading && <div className="shrink-0">{leading}</div>}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={page <= 1}
          aria-label={prevAriaLabel}
          title={prevAriaLabel}
          className={`inline-flex items-center justify-center transition hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${v.button} ${theme.border} ${theme.card} ${theme.text}`}
        >
          <svg
            className={v.icon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden={true}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <span
          className={`min-w-[7rem] text-center text-sm ${theme.textSecondary}`}
        >
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={page >= totalPages}
          aria-label={nextAriaLabel}
          title={nextAriaLabel}
          className={`inline-flex items-center justify-center transition hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${v.button} ${theme.border} ${theme.card} ${theme.text}`}
        >
          <svg
            className={v.icon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden={true}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
