import { useContext, useState, useMemo, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { LIST_PAGE_SIZE } from "../constants/constants";
import NoteEditor from "./NoteEditor";
import NoteCard from "./NoteCard";
import PaginationFooter from "./PaginationFooter";

export default function NotesList({
  promptId,
  promptOwnerId,
  currentUserId,
  notes = [],
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onVoteNote,
}) {
  const theme = useContext(ThemeContext);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [notesPage, setNotesPage] = useState(1);

  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return bTime - aTime;
    });
  }, [notes]);

  const noteTotalPages = Math.max(
    1,
    Math.ceil(sortedNotes.length / LIST_PAGE_SIZE),
  );

  useEffect(() => {
    setNotesPage((p) => Math.min(Math.max(1, p), noteTotalPages));
  }, [noteTotalPages, notes.length]);

  useEffect(() => {
    setEditingNoteId(null);
  }, [notesPage]);

  const paginatedNotes = useMemo(() => {
    const start = (notesPage - 1) * LIST_PAGE_SIZE;
    return sortedNotes.slice(start, start + LIST_PAGE_SIZE);
  }, [sortedNotes, notesPage]);

  const handleSaveNote = (pId, nId, content) => {
    if (nId) {
      onUpdateNote(pId, nId, content);
      setEditingNoteId(null);
    } else {
      onAddNote(pId, content);
      setIsAddingNote(false);
      setNotesPage(1);
    }
  };

  const handleDeleteNote = (pId, nId) => {
    onDeleteNote(pId, nId);
  };

  const handleCancel = () => {
    setIsAddingNote(false);
    setEditingNoteId(null);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="mt-4 pt-4 border-t-2 border-gray-300 dark:border-gray-700">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`${theme.accentText} ${theme.accentTextHover} font-medium text-sm transition flex items-center gap-1 mb-3`}
      >
        📝 {notes.length} note{notes.length !== 1 ? "s" : ""}
        <span className="text-xs">{isExpanded ? "▼" : "▶"}</span>
      </button>

      {isExpanded && (
        <div className="space-y-3">
          {paginatedNotes.map((note) => (
            <div key={note.id}>
              {editingNoteId === note.id ? (
                <NoteEditor
                  noteId={note.id}
                  promptId={promptId}
                  content={note.content}
                  onSave={handleSaveNote}
                  onCancel={handleCancel}
                />
              ) : (
                <NoteCard
                  note={note}
                  promptOwnerId={promptOwnerId}
                  currentUserId={currentUserId}
                  onEdit={() => setEditingNoteId(note.id)}
                  onDelete={() => handleDeleteNote(promptId, note.id)}
                  onVoteNote={(kind) => onVoteNote(promptId, note.id, kind)}
                  formatDate={formatDate}
                />
              )}
            </div>
          ))}

          {sortedNotes.length > LIST_PAGE_SIZE && (
            <PaginationFooter
              variant="compact"
              page={notesPage}
              totalPages={noteTotalPages}
              onPrev={() => setNotesPage((p) => Math.max(1, p - 1))}
              onNext={() =>
                setNotesPage((p) => Math.min(noteTotalPages, p + 1))
              }
              prevAriaLabel="Previous notes page"
              nextAriaLabel="Next notes page"
            />
          )}

          {isAddingNote ? (
            <NoteEditor
              noteId={null}
              promptId={promptId}
              content=""
              onSave={handleSaveNote}
              onCancel={handleCancel}
            />
          ) : (
            <button
              onClick={() => setIsAddingNote(true)}
              className={`w-full ${theme.accentBg} ${theme.accentHover} ${theme.accentText} py-2 rounded-lg text-sm font-medium transition hover:cursor-pointer`}
            >
              + Add Note
            </button>
          )}
        </div>
      )}
    </div>
  );
}
