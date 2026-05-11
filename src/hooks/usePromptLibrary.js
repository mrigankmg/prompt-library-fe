import { useCallback, useEffect, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { LIST_PAGE_SIZE } from "../constants/constants";
import { queryKeys } from "../query/keys";
import * as promptsApi from "../api/promptsApi";
import { SCOPE, SORT } from "../components/PromptList";

function nextRatingState(prompt, rating) {
  const prevUserRating = prompt.userRating ?? 0;
  const ratingCount = prevUserRating
    ? prompt.ratingCount
    : prompt.ratingCount + 1;
  const averageRating = prompt.averageRating
    ? (prompt.averageRating * prompt.ratingCount - prevUserRating + rating) /
      ratingCount
    : rating;

  return { ...prompt, averageRating, ratingCount, userRating: rating };
}

export function usePromptLibrary() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const userId = user?.id ?? null;

  const [scope, setScope] = useState(SCOPE.MINE);
  const [sortOrder, setSortOrder] = useState(SORT.NEWEST);
  const [pageIndex, setPageIndex] = useState(0);

  const filterBy = scope === SCOPE.MINE ? "own" : "public";
  const listEnabled =
    !authLoading && (filterBy === "public" || isAuthenticated);

  const listQuery = useInfiniteQuery({
    queryKey: queryKeys.prompts.list({
      filterBy,
      sortBy: sortOrder,
      limit: LIST_PAGE_SIZE,
    }),
    queryFn: ({ pageParam }) =>
      promptsApi.fetchPromptsPage({
        filterBy,
        sortBy: sortOrder,
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
    enabled: listEnabled,
  });

  useEffect(() => {
    setPageIndex(0);
  }, [filterBy, sortOrder]);

  const pages = listQuery.data?.pages ?? [];
  const lastIndex = Math.max(0, pages.length - 1);
  const safeIndex = Math.min(pageIndex, lastIndex);
  const currentItems = pages[safeIndex]?.items ?? [];

  useEffect(() => {
    if (pageIndex > lastIndex && lastIndex >= 0) {
      setPageIndex(lastIndex);
    }
  }, [pageIndex, lastIndex]);

  const canGoPrev = safeIndex > 0 || Boolean(listQuery.hasPreviousPage);
  const canGoNext =
    safeIndex < lastIndex ||
    (safeIndex === lastIndex && Boolean(listQuery.hasNextPage));

  const handleNextPage = useCallback(async () => {
    if (safeIndex < lastIndex) {
      setPageIndex((i) => i + 1);
      return;
    }
    if (listQuery.hasNextPage) {
      await listQuery.fetchNextPage();
      setPageIndex((i) => i + 1);
    }
  }, [safeIndex, lastIndex, listQuery]);

  const handlePrevPage = useCallback(async () => {
    if (safeIndex > 0) {
      setPageIndex((i) => i - 1);
      return;
    }
    if (listQuery.hasPreviousPage) {
      await listQuery.fetchPreviousPage();
    }
  }, [safeIndex, listQuery]);

  const createMutation = useMutation({
    mutationFn: ({ title, content, ai_agent, is_private }) =>
      promptsApi.createPrompt({ title, content, ai_agent, is_private }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => promptsApi.deletePrompt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, is_private }) =>
      promptsApi.updatePrompt(id, { is_private }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
  });

  const rateMutation = useMutation({
    mutationFn: ({ promptId, rating }) =>
      promptsApi.ratePrompt(promptId, rating),
    onMutate: async ({ promptId, rating }) => {
      await queryClient.cancelQueries({
        queryKey: ["prompts", "list"],
        exact: false,
      });
      const previous = queryClient.getQueriesData({
        queryKey: ["prompts", "list"],
        exact: false,
      });
      queryClient.setQueriesData(
        { queryKey: ["prompts", "list"], exact: false },
        (old) => {
          if (!old?.pages) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: (page.items ?? []).map((p) =>
                p.id === promptId ? nextRatingState(p, rating) : p,
              ),
            })),
          };
        },
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      context?.previous?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSuccess: (data, { promptId }) => {
      if (!data || typeof data !== "object") return;
      queryClient.setQueriesData(
        { queryKey: ["prompts", "list"], exact: false },
        (old) => {
          if (!old?.pages) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: (page.items ?? []).map((p) => {
                if (p.id !== promptId) return p;
                const next = { ...p };
                if (data.average_rating !== undefined)
                  next.averageRating = data.average_rating;
                if (data.user_rating !== undefined)
                  next.userRating = data.user_rating;
                if (data.rating_count !== undefined)
                  next.ratingCount = data.rating_count;
                return next;
              }),
            })),
          };
        },
      );
    },
  });

  const handleSavePrompt = (promptData) => {
    createMutation.mutate({
      title: promptData.title,
      content: promptData.content,
      ai_agent: promptData.metadata?.model,
      is_private: true,
    });
  };

  const handleDeletePrompt = (id) => deleteMutation.mutate(id);

  const handleTogglePrivacy = (id, currentIsPrivate) =>
    updateMutation.mutate({ id, is_private: !currentIsPrivate });

  const handleSubmitRating = (promptId, score) =>
    rateMutation.mutate({ promptId, rating: score });

  const authGateMessage =
    !authLoading && scope === SCOPE.MINE && !isAuthenticated
      ? "Log in to load your prompts."
      : null;

  const isInitialLoading =
    listEnabled && listQuery.isPending && !listQuery.data;

  const showPagination =
    !authGateMessage &&
    currentItems.length > 0 &&
    (canGoPrev || canGoNext || pages.length > 1);

  return {
    userId,
    isAuthenticated,
    scope,
    setScope,
    sortOrder,
    setSortOrder,
    currentItems,
    isInitialLoading,
    isFetching: listQuery.isFetching,
    listError: listQuery.error,
    pageIndex: safeIndex,
    canGoPrev,
    canGoNext,
    showPagination,
    handleNextPage,
    handlePrevPage,
    handleSavePrompt,
    handleDeletePrompt,
    handleTogglePrivacy,
    handleSubmitRating,
    authGateMessage,
  };
}
