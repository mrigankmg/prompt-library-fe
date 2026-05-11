import { ThumbsUp, ThumbsDown, Trash2 } from "lucide-react";

export default function NoteCard({
  note,
  promptOwnerId,
  currentUserId,
  onVoteNote,
  onDeleteNote,
  formatDate,
}) {
  const authorId = note.userId ?? promptOwnerId;
  const isOwnNote = authorId === currentUserId;

  const hasUpvoted = note.userVote === "upvote";
  const hasDownvoted = note.userVote === "downvote";

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-gray-300 dark:border-gray-700">
      <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">
        {isOwnNote ? "You" : "Another user"}
      </p>
      <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap mb-2">{note.content}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        {formatDate(note.updatedAt || note.createdAt)}
      </p>
      {(onVoteNote || (isOwnNote && onDeleteNote)) ? (
        <div className="mt-1 flex flex-wrap items-center justify-between gap-1">
          {isOwnNote && onDeleteNote && (
            <button
              type="button"
              title="Delete note"
              onClick={onDeleteNote}
              className="rounded-md px-2 py-1 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition hover:cursor-pointer"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
          {onVoteNote && (
            <div className="flex shrink-0 items-center gap-1 ml-auto">
              <button
                type="button"
                title={hasUpvoted ? "Remove upvote" : "Upvote"}
                onClick={() => onVoteNote("upvote")}
                className={`flex items-center gap-0.5 rounded-md px-2 py-1 text-sm transition hover:cursor-pointer ${
                  hasUpvoted
                    ? "bg-orange-100 dark:bg-orange-700/30 text-orange-600 dark:text-orange-400 ring-2 ring-orange-400/60"
                    : "text-gray-500 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-900/30"
                }`}
              >
                <ThumbsUp className="w-4 h-4" aria-hidden="true" />
                <span className="tabular-nums text-gray-600 dark:text-gray-300">
                  {note.upvoteCount ?? 0}
                </span>
              </button>
              <button
                type="button"
                title={hasDownvoted ? "Remove downvote" : "Downvote"}
                onClick={() => onVoteNote("downvote")}
                className={`flex items-center gap-0.5 rounded-md px-2 py-1 text-sm transition hover:cursor-pointer ${
                  hasDownvoted
                    ? "bg-orange-100 dark:bg-orange-700/30 text-orange-600 dark:text-orange-400 ring-2 ring-orange-400/60"
                    : "text-gray-500 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-900/30"
                }`}
              >
                <ThumbsDown className="w-4 h-4" aria-hidden="true" />
                <span className="tabular-nums text-gray-600 dark:text-gray-300">
                  {note.downvoteCount ?? 0}
                </span>
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
