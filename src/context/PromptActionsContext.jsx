import { createContext, useContext } from "react";

const PromptActionsContext = createContext(null);

export function PromptActionsProvider({
  userId,
  onDelete,
  onTogglePrivacy,
  onRatingSubmit,
  children,
}) {
  return (
    <PromptActionsContext.Provider
      value={{ userId, onDelete, onTogglePrivacy, onRatingSubmit }}
    >
      {children}
    </PromptActionsContext.Provider>
  );
}

export function usePromptActions() {
  const context = useContext(PromptActionsContext);
  if (!context)
    throw new Error(
      "usePromptActions must be used within a PromptActionsProvider",
    );
  return context;
}
