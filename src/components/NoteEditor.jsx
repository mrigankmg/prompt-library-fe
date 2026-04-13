import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function NoteEditor({
  noteId,
  promptId,
  content = "",
  onSave,
  onCancel,
}) {
  const theme = useContext(ThemeContext);
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
    <div className={`${theme.accentBg} p-4 rounded-lg`}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
        className={`w-full p-3 rounded-lg ${theme.card} ${theme.text} border-2 ${theme.border} focus:outline-none focus:border-orange-500 resize-none`}
        placeholder="Add a note..."
        rows="3"
      />
      <div className="flex justify-between items-center mt-2">
        <span className={`text-sm ${theme.textSecondary}`}>
          {text.length}/{MAX_CHARS}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleCancel}
            className={`${theme.textSecondary} hover:${theme.accentBg2} hover:${theme.text} px-3 py-1 rounded text-sm transition hover:cursor-pointer`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!text.trim()}
            className={`${
              text.trim()
                ? `${theme.accentText} hover:${theme.accentBg2} ${theme.accentTextHover}`
                : `${theme.textMuted}`
            } px-3 py-1 rounded text-sm font-medium transition ${text.trim() && "hover:cursor-pointer"}`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
