import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function noteAuthorId(note, promptOwnerId) {
  return note.userId ?? promptOwnerId;
}

export default function NoteCard({
  note,
  promptOwnerId,
  currentUserId,
  onEdit,
  onDelete,
  onVoteNote,
  formatDate,
}) {
  const theme = useContext(ThemeContext);
  const authorId = noteAuthorId(note, promptOwnerId);
  const isOwnNote = authorId === currentUserId;

  const upvotes = note.upvotes || [];
  const downvotes = note.downvotes || [];
  const hasUpvoted = upvotes.includes(currentUserId);
  const hasDownvoted = downvotes.includes(currentUserId);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this note?")) {
      onDelete();
    }
  };

  return (
    <div className={`${theme.card} p-4 rounded-lg border-2 ${theme.border}`}>
      <p className={`text-xs ${theme.textMuted} mb-1`}>
        {isOwnNote ? "You" : `User ${authorId}`}
      </p>
      <p className={`${theme.text} whitespace-pre-wrap mb-2`}>{note.content}</p>
      <p className={`text-xs ${theme.textSecondary} mb-2`}>
        {formatDate(note.updatedAt)}
      </p>
      <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {isOwnNote && (
            <>
              <button
                type="button"
                onClick={onEdit}
                className={`${theme.accentText} ${theme.accentTextHover} text-sm font-medium transition hover:cursor-pointer`}
              >
                ✏️ Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className={`${theme.accentText} ${theme.accentTextHover} text-sm font-medium transition hover:cursor-pointer`}
              >
                🗑️ Delete
              </button>
            </>
          )}
        </div>
        {onVoteNote && (
          <div className="ml-auto flex shrink-0 items-center gap-1">
            <button
              type="button"
              title={hasUpvoted ? "Remove upvote" : "Upvote"}
              onClick={() => onVoteNote("up")}
              className={`flex items-center gap-0.5 rounded-md px-2 py-1 text-sm transition hover:cursor-pointer ${
                hasUpvoted
                  ? `${theme.accentBg2} ${theme.accentText} ring-2 ring-orange-400/60`
                  : `${theme.textSecondary} hover:${theme.accentBg}`
              }`}
            >
              <span aria-hidden="true">👍</span>
              <span className={`tabular-nums ${theme.textMuted}`}>
                {upvotes.length}
              </span>
            </button>
            <button
              type="button"
              title={hasDownvoted ? "Remove downvote" : "Downvote"}
              onClick={() => onVoteNote("down")}
              className={`flex items-center gap-0.5 rounded-md px-2 py-1 text-sm transition hover:cursor-pointer ${
                hasDownvoted
                  ? `${theme.accentBg2} ${theme.accentText} ring-2 ring-orange-400/60`
                  : `${theme.textSecondary} hover:${theme.accentBg}`
              }`}
            >
              <span aria-hidden="true">👎</span>
              <span className={`tabular-nums ${theme.textMuted}`}>
                {downvotes.length}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
