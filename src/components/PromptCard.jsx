import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import PromptMetadata from "./PromptMetadata";
import StarRating from "./StarRating";
import NotesList from "./NotesList";

export default function PromptCard({
  prompt,
  onDelete,
  onRatingSubmit,
  userRating,
  userId,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onVoteNote,
  onTogglePrivacy,
}) {
  const theme = useContext(ThemeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isPrivate = true } = prompt;

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content);
  };

  const handleTogglePrivacy = () => {
    setIsMenuOpen(false);
    if (
      isPrivate &&
      confirm("Are you sure you want to make this prompt public?")
    ) {
      onTogglePrivacy(prompt.id, true);
    } else {
      onTogglePrivacy(prompt.id, false);
    }
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    if (confirm("Are you sure you want to delete this prompt?")) {
      onDelete(prompt.id);
    }
  };

  return (
    <div
      className={`${theme.card} rounded-lg ${theme.shadow} p-6 hover:shadow-lg transition`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          {userId !== prompt.userId && (
            <p className={`text-xs ${theme.textMuted} mb-1`}>
              Shared by user {prompt.userId}
            </p>
          )}
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-lg font-semibold ${theme.text}`}>
              {prompt.title}
            </h3>
            <span
              className={`text-xs font-medium px-2 py-1 rounded ${isPrivate ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300" : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"}`}
            >
              {isPrivate ? "🔒 Private" : "🔓 Public"}
            </span>
          </div>
        </div>
        {userId === prompt.userId && (
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${theme.accentText} hover:opacity-70 transition p-2 hover:cursor-pointer`}
              title="Options"
            >
              ⋯
            </button>
            {isMenuOpen && (
              <div
                className={`absolute right-0 mt-2 w-48 ${theme.card} ${theme.border} border rounded-lg shadow-lg z-10`}
              >
                <button
                  onClick={handleTogglePrivacy}
                  className={`w-full text-left px-4 py-2 ${theme.text} hover:${theme.accentBg} transition flex items-center gap-2 border-b ${theme.border} hover:cursor-pointer`}
                >
                  {isPrivate ? "🔓 Make public" : "🔒 Make private"}
                </button>
                <button
                  onClick={handleDelete}
                  className={`w-full text-left px-4 py-2 ${theme.text} hover:${theme.accentBg} transition flex items-center gap-2 text-red-600 dark:text-red-400 hover:cursor-pointer`}
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <p className={`${theme.text} whitespace-pre-wrap line-clamp-4`}>
        {prompt.content}
      </p>
      <button
        onClick={handleCopy}
        className={`mt-4 ${theme.accentText} ${theme.accentTextHover} font-medium text-sm transition hover:cursor-pointer`}
      >
        📋 Copy to Clipboard
      </button>
      {prompt.metadata && <PromptMetadata metadata={prompt.metadata} />}
      {onRatingSubmit && (
        <StarRating
          prompt={prompt}
          userRating={userRating}
          onRatingSubmit={onRatingSubmit}
        />
      )}
      {userId && (
        <NotesList
          promptId={prompt.id}
          promptOwnerId={prompt.userId}
          currentUserId={userId}
          notes={prompt.notes || []}
          onAddNote={onAddNote}
          onUpdateNote={onUpdateNote}
          onDeleteNote={onDeleteNote}
          onVoteNote={onVoteNote}
        />
      )}
    </div>
  );
}
