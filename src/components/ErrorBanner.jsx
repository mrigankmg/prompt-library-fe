export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg px-4 py-3 mb-4"
    >
      <p className="flex-1 text-sm">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss error"
        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 font-bold leading-none hover:cursor-pointer"
      >
        ×
      </button>
    </div>
  );
}
