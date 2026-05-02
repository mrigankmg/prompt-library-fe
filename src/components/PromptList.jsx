import { useTheme } from "../context/ThemeContext";
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
  const theme = useTheme();

  if (authGateMessage) {
    return (
      <div className="space-y-4">
        <Toolbar
          theme={theme}
          scope={scope}
          setScope={onScopeChange}
          sortOrder={sortOrder}
          setSortOrder={onSortChange}
        />
        <div
          className={`${theme.card} rounded-lg ${theme.shadow} p-8 text-center transition-colors duration-200`}
        >
          <h3 className={`text-lg font-medium ${theme.text} mb-1`}>
            Sign in required
          </h3>
          <p className={theme.textSecondary}>{authGateMessage}</p>
        </div>
      </div>
    );
  }

  if (listError) {
    return (
      <div className="space-y-4">
        <Toolbar
          theme={theme}
          scope={scope}
          setScope={onScopeChange}
          sortOrder={sortOrder}
          setSortOrder={onSortChange}
        />
        <div
          className={`${theme.card} rounded-lg ${theme.shadow} p-8 text-center border border-red-300 dark:border-red-800`}
        >
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
          theme={theme}
          scope={scope}
          setScope={onScopeChange}
          sortOrder={sortOrder}
          setSortOrder={onSortChange}
        />
        <div
          className={`${theme.card} rounded-lg ${theme.shadow} p-8 text-center ${theme.textMuted}`}
        >
          Loading prompts…
        </div>
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className="space-y-4">
        <Toolbar
          theme={theme}
          scope={scope}
          setScope={onScopeChange}
          sortOrder={sortOrder}
          setSortOrder={onSortChange}
        />
        <div
          className={`${theme.card} rounded-lg ${theme.shadow} p-8 text-center transition-colors duration-200`}
        >
          <div className={theme.textMuted}>
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
          <h3 className={`text-lg font-medium ${theme.text} mb-1`}>
            No prompts yet
          </h3>
          <p className={theme.textSecondary}>
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
        theme={theme}
        scope={scope}
        setScope={onScopeChange}
        sortOrder={sortOrder}
        setSortOrder={onSortChange}
      />

      {isFetching ? (
        <p className={`text-xs ${theme.textMuted} text-right`}>Updating…</p>
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

function Toolbar({ theme, scope, setScope, sortOrder, setSortOrder }) {
  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between ${theme.card} ${theme.border} border rounded-lg p-4 ${theme.shadow}`}
    >
      <div className="flex flex-col gap-1">
        <span
          className={`text-xs font-medium uppercase tracking-wide ${theme.textMuted}`}
        >
          Filter by
        </span>
        <div className="flex flex-wrap gap-2 mt-2">
          <FilterChip
            theme={theme}
            selected={scope === SCOPE.MINE}
            onClick={() => setScope(SCOPE.MINE)}
            label="My prompts"
          />
          <FilterChip
            theme={theme}
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
          className={`text-xs font-medium uppercase tracking-wide ${theme.textMuted}`}
        >
          Sort by
        </label>
        <select
          id="prompt-sort"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className={`rounded-lg border-2 ${theme.border} ${theme.card} ${theme.text} px-3 py-2 mt-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400`}
        >
          <option value={SORT.NEWEST}>Newest first</option>
          <option value={SORT.OLDEST}>Oldest first</option>
        </select>
      </div>
    </div>
  );
}

function FilterChip({ theme, selected, onClick, label, title }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition hover:cursor-pointer ${
        selected
          ? `${theme.accentBg2} ${theme.accentText}`
          : `${theme.card} ${theme.textSecondary} hover:${theme.accentBg}`
      }`}
    >
      {label}
    </button>
  );
}
