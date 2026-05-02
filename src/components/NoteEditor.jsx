import { useState } from "react";

export default function NoteEditor({
  noteId,
  promptId,
  content = "",
  onSave,
  onCancel,
}) {
  const [text, setText] = useState(content);
  const MAX_CHARS = 500;

  const handleSave = () => {
    if (text.trim()) {
      onSave(promptId, noteId, text.trim());
      setText("");
    }
  };

  const handleCancel = () => {
    setText(content);
    onCancel();
  };

  return (
    <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
        className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-2 border-gray-300 dark:border-gray-700 focus:outline-none focus:border-orange-500 resize-none"
        placeholder="Add a note..."
        rows="3"
      />
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {text.length}/{MAX_CHARS}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleCancel}
            className="text-gray-500 dark:text-gray-400 hover:bg-orange-100 dark:hover:bg-orange-700/30 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-1 rounded text-sm transition hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!text.trim()}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              text.trim()
                ? "text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-700/30 hover:text-orange-700 dark:hover:text-orange-300 hover:cursor-pointer"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
