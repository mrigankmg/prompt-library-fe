import { useTheme } from "../context/ThemeContext";

export default function NoteCard({
  note,
  promptOwnerId,
  currentUserId,
  onVoteNote,
  formatDate,
}) {
  const theme = useTheme();
  const authorId = note.userId ?? promptOwnerId;
  const isOwnNote = authorId === currentUserId;

  const hasUpvoted = note.userVote === "upvote";
  const hasDownvoted = note.userVote === "downvote";

  return (
    <div className={`${theme.card} p-4 rounded-lg border-2 ${theme.border}`}>
      <p className={`text-xs ${theme.textMuted} mb-1`}>
        {isOwnNote ? "You" : "Another user"}
      </p>
      <p className={`${theme.text} whitespace-pre-wrap mb-2`}>{note.content}</p>
      <p className={`text-xs ${theme.textSecondary} mb-2`}>
        {formatDate(note.updatedAt || note.createdAt)}
      </p>
      {onVoteNote ? (
        <div className="mt-1 flex flex-wrap items-end justify-end gap-1">
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              title={hasUpvoted ? "Remove upvote" : "Upvote"}
              onClick={() => onVoteNote("upvote")}
              className={`flex items-center gap-0.5 rounded-md px-2 py-1 text-sm transition hover:cursor-pointer ${
                hasUpvoted
                  ? `${theme.accentBg2} ${theme.accentText} ring-2 ring-orange-400/60`
                  : `${theme.textSecondary} hover:${theme.accentBg}`
              }`}
            >
              <span aria-hidden="true">👍</span>
              <span className={`tabular-nums ${theme.textMuted}`}>
                {note.upvoteCount ?? 0}
              </span>
            </button>
            <button
              type="button"
              title={hasDownvoted ? "Remove downvote" : "Downvote"}
              onClick={() => onVoteNote("downvote")}
              className={`flex items-center gap-0.5 rounded-md px-2 py-1 text-sm transition hover:cursor-pointer ${
                hasDownvoted
                  ? `${theme.accentBg2} ${theme.accentText} ring-2 ring-orange-400/60`
                  : `${theme.textSecondary} hover:${theme.accentBg}`
              }`}
            >
              <span aria-hidden="true">👎</span>
              <span className={`tabular-nums ${theme.textMuted}`}>
                {note.downvoteCount ?? 0}
              </span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
