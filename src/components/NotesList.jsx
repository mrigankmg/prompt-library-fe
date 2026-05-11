import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { LIST_PAGE_SIZE } from "../constants/constants";
import { queryKeys } from "../query/keys";
import * as promptsApi from "../api/promptsApi";
import { usePromptActions } from "../context/PromptActionsContext";
import NoteEditor from "./NoteEditor";
import NoteCard from "./NoteCard";
import { ChevronDown, ChevronRight, NotebookPen } from "lucide-react";
import PaginationFooter from "./PaginationFooter";

const NOTES_SORT = "newest";

function nextVoteState(note, voteType) {
  const prev = note.userVote;
  let up = note.upvoteCount ?? 0;
  let down = note.downvoteCount ?? 0;
  let userVote = voteType;

  if (prev === voteType) {
    userVote = null;
    if (voteType === "upvote") up = Math.max(0, up - 1);
    else down = Math.max(0, down - 1);
  } else if (prev === "upvote") {
    up = Math.max(0, up - 1);
    if (voteType === "downvote") down += 1;
  } else if (prev === "downvote") {
    down = Math.max(0, down - 1);
    if (voteType === "upvote") up += 1;
  } else {
    if (voteType === "upvote") up += 1;
    else down += 1;
  }

  return { ...note, userVote, upvoteCount: up, downvoteCount: down };
}

export default function NotesList({ promptId, promptOwnerId }) {
  const { userId: currentUserId } = usePromptActions();
  const queryClient = useQueryClient();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);

  const listParams = useMemo(
    () => ({ sortBy: NOTES_SORT, limit: LIST_PAGE_SIZE }),
    [],
  );

  const notesQueryKey = queryKeys.notes.list(promptId, listParams);

  const notesQuery = useInfiniteQuery({
    queryKey: notesQueryKey,
    queryFn: ({ pageParam }) =>
      promptsApi.fetchNotesPage({
        promptId,
        sortBy: NOTES_SORT,
        cursor: pageParam?.cursor,
        direction: pageParam?.direction,
        limit: LIST_PAGE_SIZE,
      }),
    initialPageParam: undefined,
    getNextPageParam: (last) =>
      last.has_more && last.next_cursor
        ? { cursor: last.next_cursor, direction: "forward" }
        : undefined,
    getPreviousPageParam: (first) =>
      first.has_previous && first.prev_cursor
        ? { cursor: first.prev_cursor, direction: "backward" }
        : undefined,
    enabled: isExpanded && Boolean(promptId),
  });

  useEffect(() => {
    setPageIndex(0);
  }, [promptId]);

  const pages = notesQuery.data?.pages ?? [];
  const lastIndex = Math.max(0, pages.length - 1);
  const safeIndex = Math.min(pageIndex, lastIndex);
  const paginatedNotes = pages[safeIndex]?.items ?? [];

  useEffect(() => {
    if (pageIndex > lastIndex && lastIndex >= 0) {
      setPageIndex(lastIndex);
    }
  }, [pageIndex, lastIndex]);

  const canGoPrev = safeIndex > 0 || Boolean(notesQuery.hasPreviousPage);
  const canGoNext =
    safeIndex < lastIndex ||
    (safeIndex === lastIndex && Boolean(notesQuery.hasNextPage));

  const loadedCount = useMemo(
    () => pages.reduce((sum, p) => sum + (p.items?.length ?? 0), 0),
    [pages],
  );

  const addMutation = useMutation({
    mutationFn: (content) => promptsApi.createNote(promptId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["prompts", promptId, "notes"],
      });
      setIsAddingNote(false);
      setPageIndex(0);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (noteId) => promptsApi.deleteNote(promptId, noteId),
    onSuccess: (_data, noteId) => {
      queryClient.setQueryData(notesQueryKey, (old) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: (page.items ?? []).filter((n) => n.id !== noteId),
          })),
        };
      });
    },
  });

  const voteMutation = useMutation({
    mutationFn: ({ noteId, voteType }) =>
      promptsApi.voteOnNote(promptId, noteId, voteType),
    onMutate: async ({ noteId, voteType }) => {
      await queryClient.cancelQueries({
        queryKey: ["prompts", promptId, "notes"],
      });
      const previous = queryClient.getQueryData(notesQueryKey);
      queryClient.setQueryData(notesQueryKey, (old) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: (page.items ?? []).map((n) =>
              n.id === noteId ? nextVoteState(n, voteType) : n,
            ),
          })),
        };
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(notesQueryKey, context.previous);
      }
    },
    onSuccess: (updatedNote, { noteId }) => {
      queryClient.setQueryData(notesQueryKey, (old) => {
        if (!old?.pages || !updatedNote) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: (page.items ?? []).map((n) =>
              n.id === noteId ? updatedNote : n,
            ),
          })),
        };
      });
    },
  });

  const handleNextPage = useCallback(async () => {
    if (safeIndex < lastIndex) {
      setPageIndex((i) => i + 1);
      return;
    }
    if (notesQuery.hasNextPage) {
      await notesQuery.fetchNextPage();
      setPageIndex((i) => i + 1);
    }
  }, [safeIndex, lastIndex, notesQuery]);

  const handlePrevPage = useCallback(async () => {
    if (safeIndex > 0) {
      setPageIndex((i) => i - 1);
      return;
    }
    if (notesQuery.hasPreviousPage) {
      await notesQuery.fetchPreviousPage();
    }
  }, [safeIndex, notesQuery]);

  const handleSaveNote = (pId, nId, content) => {
    if (!nId) addMutation.mutate(content);
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
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium text-sm transition flex items-center gap-1 mb-3"
      >
        <NotebookPen size={14} /> Notes
        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>

      {isExpanded && (
        <div className="space-y-3">
          {notesQuery.isPending ? (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Loading notes…
            </p>
          ) : notesQuery.isError ? (
            <p className="text-sm text-red-600 dark:text-red-400">
              Could not load notes.
            </p>
          ) : (
            <>
              {paginatedNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  promptOwnerId={promptOwnerId}
                  currentUserId={currentUserId}
                  onVoteNote={(voteType) =>
                    voteMutation.mutate({ noteId: note.id, voteType })
                  }
                  onDeleteNote={() => deleteMutation.mutate(note.id)}
                  formatDate={formatDate}
                />
              ))}

              {(canGoPrev || canGoNext || pages.length > 1) && (
                <PaginationFooter
                  variant="compact"
                  page={safeIndex + 1}
                  totalPages={null}
                  onPrev={handlePrevPage}
                  onNext={handleNextPage}
                  disablePrev={!canGoPrev}
                  disableNext={!canGoNext}
                  prevAriaLabel="Previous notes page"
                  nextAriaLabel="Next notes page"
                />
              )}
            </>
          )}

          {isAddingNote ? (
            <NoteEditor
              noteId={null}
              promptId={promptId}
              content=""
              onSave={handleSaveNote}
              onCancel={() => setIsAddingNote(false)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingNote(true)}
              disabled={addMutation.isPending}
              className="w-full bg-orange-50 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/50 text-orange-600 dark:text-orange-400 py-2 rounded-lg text-sm font-medium transition hover:cursor-pointer disabled:opacity-50"
            >
              + Add Note
            </button>
          )}
        </div>
      )}
    </div>
  );
}
