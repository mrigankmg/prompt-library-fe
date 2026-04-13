import { useContext, useMemo, useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { LIST_PAGE_SIZE } from "../constants/constants";
import PaginationFooter from "./PaginationFooter";
import PromptCard from "./PromptCard";

const SORT = {
  NEWEST: "newest",
  OLDEST: "oldest",
};

const SCOPE = {
  MINE: "mine",
  COMMUNITY: "community",
};

function promptCreatedAtMs(p) {
  const raw = p.metadata?.createdAt || p.createdAt;
  const t = new Date(raw).getTime();
  return Number.isFinite(t) ? t : 0;
}

export default function PromptList({
  prompts,
  onDelete,
  onRatingSubmit,
  getUserRating,
  userId,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onVoteNote,
  onTogglePrivacy,
}) {
  const theme = useContext(ThemeContext);
  const [scope, setScope] = useState(SCOPE.MINE);
  const [sortOrder, setSortOrder] = useState(SORT.NEWEST);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (scope === SCOPE.MINE) {
      return prompts.filter((p) => p.userId === userId);
    }
    return prompts;
  }, [prompts, scope, userId]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const diff = promptCreatedAtMs(b) - promptCreatedAtMs(a);
      return sortOrder === SORT.NEWEST ? diff : -diff;
    });
    return copy;
  }, [filtered, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / LIST_PAGE_SIZE));

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  useEffect(() => {
    setPage(1);
  }, [scope, sortOrder]);

  const paginated = useMemo(() => {
    const start = (page - 1) * LIST_PAGE_SIZE;
    return sorted.slice(start, start + LIST_PAGE_SIZE);
  }, [sorted, page]);

  if (prompts.length === 0) {
    return (
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
          Create your first prompt to get started
        </p>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="space-y-4">
        <Toolbar
          theme={theme}
          scope={scope}
          setScope={setScope}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
        <div
          className={`${theme.card} rounded-lg ${theme.shadow} p-8 text-center transition-colors duration-200`}
        >
          <h3 className={`text-lg font-medium ${theme.text} mb-1`}>
            Nothing here yet
          </h3>
          <p className={theme.textSecondary}>
            {scope === SCOPE.MINE
              ? "You have not created any prompts. Switch to Community to see public prompts from others."
              : "No prompts match the current view."}
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
        setScope={setScope}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {paginated.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          onDelete={onDelete}
          onRatingSubmit={onRatingSubmit}
          userRating={getUserRating ? getUserRating(prompt.id) : 0}
          userId={userId}
          onAddNote={onAddNote}
          onUpdateNote={onUpdateNote}
          onDeleteNote={onDeleteNote}
          onVoteNote={onVoteNote}
          onTogglePrivacy={onTogglePrivacy}
        />
      ))}

      {sorted.length > LIST_PAGE_SIZE && (
        <PaginationFooter
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
      )}
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
            title="Your prompts plus public prompts from others"
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
