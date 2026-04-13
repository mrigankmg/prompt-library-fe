import { useState, useContext, useMemo } from "react";
import { ThemeContext } from "./context/ThemeContext";
import { THEME, STORAGE_KEYS } from "./constants/constants";
import PromptForm from "./components/PromptForm";
import PromptList from "./components/PromptList";
import "./App.css";

const sessionUserId =
  sessionStorage.getItem(STORAGE_KEYS.SESSION_USER_ID) ||
  (() => {
    const id = Math.floor(Math.random() * 100).toString();
    sessionStorage.setItem(STORAGE_KEYS.SESSION_USER_ID, id);
    return id;
  })();

export default function App() {
  const theme = useContext(ThemeContext);
  const [allPrompts, setAllPrompts] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROMPTS);
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Error parsing prompts from localStorage:", e);
      return [];
    }
  });

  const visiblePrompts = useMemo(
    () =>
      allPrompts.filter(
        (p) => p.userId === sessionUserId || p.isPrivate === false,
      ),
    [allPrompts, sessionUserId],
  );

  const storePrompts = (nextAll) => {
    localStorage.setItem(STORAGE_KEYS.PROMPTS, JSON.stringify(nextAll));
    setAllPrompts(nextAll);
  };

  const updateAverageRating = (prompt) => {
    if (!prompt.ratings || prompt.ratings.length === 0) {
      prompt.averageRating = 0;
      prompt.ratingCount = 0;
      return;
    }

    const sum = prompt.ratings.reduce((acc, r) => acc + r.score, 0);
    prompt.averageRating = parseFloat((sum / prompt.ratings.length).toFixed(2));
    prompt.ratingCount = prompt.ratings.length;
  };

  const handleSubmitRating = (promptId, score) => {
    const updatedPrompts = allPrompts.map((prompt) => {
      if (prompt.id === promptId) {
        if (!prompt.ratings) {
          prompt.ratings = [];
        }

        const existingRatingIndex = prompt.ratings.findIndex(
          (r) => r.userId === sessionUserId,
        );

        if (existingRatingIndex >= 0) {
          prompt.ratings[existingRatingIndex].score = score;
          prompt.ratings[existingRatingIndex].timestamp =
            new Date().toISOString();
        } else {
          prompt.ratings.push({
            userId: sessionUserId,
            score,
            timestamp: new Date().toISOString(),
          });
        }

        updateAverageRating(prompt);
      }
      return prompt;
    });

    storePrompts(updatedPrompts);
  };

  const getUserRating = (promptId) => {
    const prompt = allPrompts.find((p) => p.id === promptId);
    if (!prompt || !prompt.ratings) return 0;

    const userRating = prompt.ratings.find((r) => r.userId === sessionUserId);
    return userRating ? userRating.score : 0;
  };

  const handleSavePrompt = (promptData) => {
    const { title, content, metadata } = promptData;

    const newPrompt = {
      id: crypto.randomUUID(),
      title,
      content,
      metadata,
      createdAt: metadata.createdAt,
      userId: sessionUserId,
      ratings: [],
      averageRating: 0,
      ratingCount: 0,
      notes: [],
      isPrivate: true,
    };

    const newPrompts = [newPrompt, ...allPrompts];
    storePrompts(newPrompts);
  };

  const handleTogglePrivacy = (id, isPrivate) => {
    const updatedPrompts = allPrompts.map((prompt) => {
      if (prompt.id === id) {
        return { ...prompt, isPrivate: !isPrivate };
      }
      return prompt;
    });
    storePrompts(updatedPrompts);
  };

  const handleDeletePrompt = (id) => {
    const newPrompts = allPrompts.filter((p) => p.id !== id);
    storePrompts(newPrompts);
  };

  const noteAuthorId = (note, prompt) => note.userId ?? prompt.userId;

  const handleAddNote = (promptId, content) => {
    const now = new Date().toISOString();
    const newNote = {
      id: crypto.randomUUID(),
      userId: sessionUserId,
      content,
      createdAt: now,
      updatedAt: now,
      upvotes: [],
      downvotes: [],
    };
    const updatedPrompts = allPrompts.map((prompt) => {
      if (prompt.id !== promptId) return prompt;
      return {
        ...prompt,
        notes: [...(prompt.notes || []), newNote],
      };
    });
    storePrompts(updatedPrompts);
  };

  const handleUpdateNote = (promptId, noteId, content) => {
    const updatedPrompts = allPrompts.map((prompt) => {
      if (prompt.id !== promptId || !prompt.notes) return prompt;
      return {
        ...prompt,
        notes: prompt.notes.map((note) => {
          if (note.id !== noteId) return note;
          if (noteAuthorId(note, prompt) !== sessionUserId) return note;
          return {
            ...note,
            content,
            updatedAt: new Date().toISOString(),
          };
        }),
      };
    });
    storePrompts(updatedPrompts);
  };

  const handleDeleteNote = (promptId, noteId) => {
    const updatedPrompts = allPrompts.map((prompt) => {
      if (prompt.id !== promptId || !prompt.notes) return prompt;
      return {
        ...prompt,
        notes: prompt.notes.filter((note) => {
          if (note.id !== noteId) return true;
          return noteAuthorId(note, prompt) !== sessionUserId;
        }),
      };
    });
    storePrompts(updatedPrompts);
  };

  const handleNoteVote = (promptId, noteId, kind) => {
    const uid = sessionUserId;
    const updatedPrompts = allPrompts.map((prompt) => {
      if (prompt.id !== promptId || !prompt.notes) {
        return prompt;
      }
      return {
        ...prompt,
        notes: prompt.notes.map((note) => {
          if (note.id !== noteId) return note;
          const up = [...(note.upvotes || [])];
          const down = [...(note.downvotes || [])];
          if (kind === "up") {
            if (up.includes(uid)) {
              return {
                ...note,
                upvotes: up.filter((id) => id !== uid),
                downvotes: down,
              };
            }
            return {
              ...note,
              upvotes: [...up.filter((id) => id !== uid), uid],
              downvotes: down.filter((id) => id !== uid),
            };
          }
          if (kind === "down") {
            if (down.includes(uid)) {
              return {
                ...note,
                upvotes: up,
                downvotes: down.filter((id) => id !== uid),
              };
            }
            return {
              ...note,
              upvotes: up.filter((id) => id !== uid),
              downvotes: [...down.filter((id) => id !== uid), uid],
            };
          }
          return note;
        }),
      };
    });
    storePrompts(updatedPrompts);
  };

  return (
    <div
      className={`min-h-screen ${theme.bgGradient} py-8 px-4 transition-colors duration-200`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className={`text-4xl font-bold ${theme.text} mb-2`}>
              Prompt Library
            </h1>
            <p className={theme.textMuted}>
              Save your prompts and browse public prompts from others
            </p>
          </div>
          <button
            onClick={theme.toggleTheme}
            className={`${theme.card} ${theme.shadow} p-3 rounded-lg transition-all hover:cursor-pointer ml-4`}
            title="Toggle theme"
          >
            {theme.theme === THEME.LIGHT ? "🌙" : "☀️"}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="md:col-span-1">
            <PromptForm onSave={handleSavePrompt} />
          </div>

          {/* Prompts List Section */}
          <div className="md:col-span-2">
            <PromptList
              prompts={visiblePrompts}
              onDelete={handleDeletePrompt}
              onRatingSubmit={handleSubmitRating}
              getUserRating={getUserRating}
              userId={sessionUserId}
              onAddNote={handleAddNote}
              onTogglePrivacy={handleTogglePrivacy}
              onUpdateNote={handleUpdateNote}
              onDeleteNote={handleDeleteNote}
              onVoteNote={handleNoteVote}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
