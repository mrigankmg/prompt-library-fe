import PaginationFooter from "./PaginationFooter";
import PromptCard from "./PromptCard";

export const SORT = {
  NEWEST: "newest",
  OLDEST: "oldest",
};

export const SCOPE = {
  MINE: "mine",
  COMMUNITY: "community",
};

export default function PromptList({
  scope,
  onScopeChange,
  sortOrder,
  onSortChange,
  prompts,
  userId,
  isInitialLoading,
  isFetching,
  listError,
  pageIndex,
  onPrevPage,
  onNextPage,
  canGoPrev,
  canGoNext,
  showPagination,
  onDelete,
  onTogglePrivacy,
  onRatingSubmit,
  authGateMessage,
}) {
  if (authGateMessage) {
    return (
      <div className="space-y-4">
        <Toolbar
          scope={scope}
          setScope={onScopeChange}
          sortOrder={sortOrder}
          setSortOrder={onSortChange}
        />
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center transition-colors duration-200">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
            Sign in required
          </h3>
          <p className="text-gray-500 dark:text-gray-400">{authGateMessage}</p>
        </div>
      </div>
    );
  }

  if (listError) {
    return (
      <div className="space-y-4">
        <Toolbar
          scope={scope}
          setScope={onScopeChange}
          sortOrder={sortOrder}
          setSortOrder={onSortChange}
        />
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center border border-red-300 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400">
            {listError instanceof Error
              ? listError.message
              : "Could not load prompts."}
          </p>
        </div>
      </div>
    );
  }

  if (isInitialLoading) {
    return (
      <div className="space-y-4">
        <Toolbar
          scope={scope}
          setScope={onScopeChange}
          sortOrder={sortOrder}
          setSortOrder={onSortChange}
        />
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center text-gray-600 dark:text-gray-300">
          Loading prompts…
        </div>
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className="space-y-4">
        <Toolbar
          scope={scope}
          setScope={onScopeChange}
          sortOrder={sortOrder}
          setSortOrder={onSortChange}
        />
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center transition-colors duration-200">
          <div className="text-gray-600 dark:text-gray-300">
            <svg
              className="w-12 h-12 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m0 0h6m-6-6H6m0 0H0"
              ></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
            No prompts yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {scope === SCOPE.MINE
              ? "You have no prompts in this view. Try creating one, or switch to Community."
              : "No public prompts from others match this view."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Toolbar
        scope={scope}
        setScope={onScopeChange}
        sortOrder={sortOrder}
        setSortOrder={onSortChange}
      />

      {isFetching ? (
        <p className="text-xs text-gray-600 dark:text-gray-300 text-right">Updating…</p>
      ) : null}

      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          onDelete={onDelete}
          onRatingSubmit={onRatingSubmit}
          userRating={prompt.userRating ?? 0}
          userId={userId}
          onTogglePrivacy={onTogglePrivacy}
        />
      ))}

      {showPagination ? (
        <PaginationFooter
          page={pageIndex + 1}
          totalPages={null}
          onPrev={onPrevPage}
          onNext={onNextPage}
          disablePrev={!canGoPrev}
          disableNext={!canGoNext}
        />
      ) : null}
    </div>
  );
}

function Toolbar({ scope, setScope, sortOrder, setSortOrder }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 shadow-md">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-300">
          Filter by
        </span>
        <div className="flex flex-wrap gap-2 mt-2">
          <FilterChip
            selected={scope === SCOPE.MINE}
            onClick={() => setScope(SCOPE.MINE)}
            label="My prompts"
          />
          <FilterChip
            selected={scope === SCOPE.COMMUNITY}
            onClick={() => setScope(SCOPE.COMMUNITY)}
            label="Community"
            title="Public prompts from other users"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1 sm:items-end">
        <label
          htmlFor="prompt-sort"
          className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-300"
        >
          Sort by
        </label>
        <select
          id="prompt-sort"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 mt-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value={SORT.NEWEST}>Newest first</option>
          <option value={SORT.OLDEST}>Oldest first</option>
        </select>
      </div>
    </div>
  );
}

function FilterChip({ selected, onClick, label, title }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition hover:cursor-pointer ${
        selected
          ? "bg-orange-100 dark:bg-orange-700/30 text-orange-600 dark:text-orange-400"
          : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-900/30"
      }`}
    >
      {label}
    </button>
  );
}
