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
  disablePrev,
  disableNext,
  variant = "default",
  prevAriaLabel = "Previous page",
  nextAriaLabel = "Next page",
  leading = null,
  className = "",
}) {
  const v = VARIANT[variant] ?? VARIANT.default;
  const hasLeading = leading != null && leading !== false;
  const rowLayout = hasLeading
    ? `flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between ${v.gap}`
    : `flex items-center justify-center md:justify-end ${v.gap}`;

  return (
    <div
      className={`${rowLayout} ${v.wrapper} border-gray-300 dark:border-gray-700 ${className}`}
    >
      {hasLeading && <div className="shrink-0">{leading}</div>}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={disablePrev !== undefined ? disablePrev : page <= 1}
          aria-label={prevAriaLabel}
          title={prevAriaLabel}
          className={`inline-flex items-center justify-center transition hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${v.button} border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
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
        <span className="min-w-[7rem] text-center text-sm text-gray-500 dark:text-gray-400">
          {totalPages != null && totalPages > 0
            ? `Page ${page} of ${totalPages}`
            : `Page ${page}`}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={
            disableNext !== undefined
              ? disableNext
              : totalPages != null && page >= totalPages
          }
          aria-label={nextAriaLabel}
          title={nextAriaLabel}
          className={`inline-flex items-center justify-center transition hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${v.button} border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
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
