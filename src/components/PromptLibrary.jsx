import { usePromptLibrary } from "../hooks/usePromptLibrary";
import { PromptActionsProvider } from "../context/PromptActionsContext";
import PromptForm from "./PromptForm";
import PromptList from "./PromptList";
import "../App.css";

export default function PromptLibrary() {
  const {
    userId,
    isAuthenticated,
    scope,
    setScope,
    sortOrder,
    setSortOrder,
    currentItems,
    isInitialLoading,
    isFetching,
    listError,
    pageIndex,
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
  } = usePromptLibrary();

  const promptActions = {
    userId,
    onDelete: handleDeletePrompt,
    onTogglePrivacy: handleTogglePrivacy,
    onRatingSubmit: handleSubmitRating,
  };

  return (
    <div className="w-full px-4 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Prompt Library
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Save your prompts and browse public prompts from others
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            {isAuthenticated ? (
              <PromptForm onSave={handleSavePrompt} />
            ) : (
              <div className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg text-gray-500 dark:text-gray-400 text-sm">
                <p className="text-gray-900 dark:text-gray-100 font-medium mb-2">
                  Create prompts
                </p>
                <p>
                  Log in to save prompts to your library. You can still browse
                  community prompts without an account.
                </p>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <PromptActionsProvider {...promptActions}>
              <PromptList
                scope={scope}
                onScopeChange={setScope}
                sortOrder={sortOrder}
                onSortChange={setSortOrder}
                prompts={authGateMessage ? [] : currentItems}
                isInitialLoading={authGateMessage ? false : isInitialLoading}
                isFetching={isFetching}
                listError={listError}
                pageIndex={pageIndex}
                onPrevPage={handlePrevPage}
                onNextPage={handleNextPage}
                canGoPrev={canGoPrev}
                canGoNext={canGoNext}
                showPagination={showPagination}
                authGateMessage={authGateMessage}
              />
            </PromptActionsProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
