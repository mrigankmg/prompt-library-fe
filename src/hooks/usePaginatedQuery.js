import { useCallback, useEffect, useState } from "react";

export function usePaginatedQuery(query, resetKey) {
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    setPageIndex(0);
  }, [resetKey]);

  const pages = query.data?.pages ?? [];
  const lastIndex = Math.max(0, pages.length - 1);
  const safeIndex = Math.min(pageIndex, lastIndex);
  const currentItems = pages[safeIndex]?.items ?? [];

  useEffect(() => {
    if (pageIndex > lastIndex && lastIndex >= 0) {
      setPageIndex(lastIndex);
    }
  }, [pageIndex, lastIndex]);

  const canGoPrev = safeIndex > 0 || Boolean(query.hasPreviousPage);
  const canGoNext =
    safeIndex < lastIndex ||
    (safeIndex === lastIndex && Boolean(query.hasNextPage));

  const handleNextPage = useCallback(async () => {
    if (safeIndex < lastIndex) {
      setPageIndex((i) => i + 1);
      return;
    }
    if (query.hasNextPage) {
      await query.fetchNextPage();
      setPageIndex((i) => i + 1);
    }
  }, [safeIndex, lastIndex, query]);

  const handlePrevPage = useCallback(async () => {
    if (safeIndex > 0) {
      setPageIndex((i) => i - 1);
      return;
    }
    if (query.hasPreviousPage) await query.fetchPreviousPage();
  }, [safeIndex, query]);

  const resetPage = useCallback(() => setPageIndex(0), []);

  return {
    currentItems,
    pageCount: pages.length,
    safeIndex,
    canGoPrev,
    canGoNext,
    handleNextPage,
    handlePrevPage,
    resetPage,
  };
}
