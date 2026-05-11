import { useState } from "react";
import { Clipboard, Globe, Lock, Trash2, Unlock } from "lucide-react";
import { usePromptActions } from "../context/PromptActionsContext";
import ConfirmDialog from "./ConfirmDialog";
import PromptMetadata from "./PromptMetadata";
import StarRating from "./StarRating";
import NotesList from "./NotesList";

export default function PromptCard({ prompt }) {
  const { userId, onDelete, onTogglePrivacy, onRatingSubmit } =
    usePromptActions();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const { isPrivate = true } = prompt;

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content);
  };

  const handleTogglePrivacy = () => {
    setIsMenuOpen(false);
    if (isPrivate) {
      setPendingAction({
        title: "Make prompt public",
        message: "Are you sure you want to make this prompt public? Anyone will be able to view it.",
        confirmLabel: "Make public",
        onConfirm: () => onTogglePrivacy(prompt.id, true),
      });
    } else {
      onTogglePrivacy(prompt.id, false);
    }
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    setPendingAction({
      title: "Delete prompt",
      message: "Are you sure you want to delete this prompt? This cannot be undone.",
      confirmLabel: "Delete",
      danger: true,
      onConfirm: () => onDelete(prompt.id),
    });
  };

  const showNotes = !isPrivate;
  const showRating = !isPrivate && onRatingSubmit;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <ConfirmDialog
        isOpen={Boolean(pendingAction)}
        title={pendingAction?.title}
        message={pendingAction?.message}
        confirmLabel={pendingAction?.confirmLabel}
        danger={pendingAction?.danger}
        onConfirm={() => { pendingAction?.onConfirm(); setPendingAction(null); }}
        onCancel={() => setPendingAction(null)}
      />
      <div className="flex justify-between items-start mb-3">
        <div>
          {userId && userId !== prompt.userId && (
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">
              Shared by another user
            </p>
          )}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {prompt.title}
            </h3>
            <span
              className={`text-xs font-medium px-2 py-1 rounded ${
                isPrivate
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
              }`}
            >
              {isPrivate
                ? <><Lock className="inline w-3 h-3 mr-1" aria-hidden="true" />Private</>
                : <><Globe className="inline w-3 h-3 mr-1" aria-hidden="true" />Public</>
              }
            </span>
          </div>
        </div>
        {userId === prompt.userId && (
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-orange-600 dark:text-orange-400 hover:opacity-70 transition p-2 hover:cursor-pointer"
              title="Options"
            >
              ⋯
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-10">
                <button
                  onClick={handleTogglePrivacy}
                  className="w-full text-left px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/30 transition flex items-center gap-2 border-b border-gray-300 dark:border-gray-700 hover:cursor-pointer"
                >
                  {isPrivate
                    ? <><Unlock className="w-4 h-4" aria-hidden="true" />Make public</>
                    : <><Lock className="w-4 h-4" aria-hidden="true" />Make private</>
                  }
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 transition flex items-center gap-2 hover:cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap line-clamp-4">
        {prompt.content}
      </p>
      <button
        onClick={handleCopy}
        className="mt-4 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium text-sm transition hover:cursor-pointer"
      >
        <Clipboard className="inline w-4 h-4 mr-1" aria-hidden="true" />Copy to Clipboard
      </button>
      {prompt.metadata && <PromptMetadata metadata={prompt.metadata} />}
      {showRating ? (
        <StarRating
          prompt={prompt}
          userRating={prompt.userRating ?? 0}
          onRatingSubmit={onRatingSubmit}
        />
      ) : null}
      {showNotes && userId ? (
        <NotesList
          promptId={prompt.id}
          promptOwnerId={prompt.userId}
          currentUserId={userId}
        />
      ) : null}
    </div>
  );
}
