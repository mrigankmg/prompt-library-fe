import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { getConfidenceColor, formatDate } from "../utils/metadata";

/**
 * PromptMetadata Component
 * Displays metadata information for prompts including model name,
 * timestamps, and token estimates with color-coded confidence levels
 */
export default function PromptMetadata({ metadata }) {
  const theme = useContext(ThemeContext);

  // Handle missing metadata
  if (!metadata) {
    return null;
  }

  const { model, createdAt, updatedAt, tokenEstimate } = metadata;

  if (!tokenEstimate) {
    return null;
  }

  const confidenceColorClass = getConfidenceColor(tokenEstimate.confidence);
  const hasBeenUpdated = createdAt !== updatedAt;

  return (
    <div
      className={`mt-4 pt-4 border-t ${theme.border} text-xs ${theme.textSecondary}`}
    >
      {/* Model Name */}
      {model && (
        <div className="mb-3">
          <span className="font-semibold">Model:</span>
          <span className={`ml-2 inline-block ${theme.text}`}>{model}</span>
        </div>
      )}

      {/* Timestamps */}
      <div className="mb-3">
        <div className="mb-1">
          <span className="font-semibold">Created:</span>
          <span className="ml-2">{formatDate(createdAt)}</span>
        </div>
        {hasBeenUpdated && (
          <div>
            <span className="font-semibold">Updated:</span>
            <span className="ml-2">{formatDate(updatedAt)}</span>
          </div>
        )}
      </div>

      {/* Token Estimate */}
      <div
        className="flex items-center justify-between rounded-md p-2 bg-opacity-10"
        style={{
          backgroundColor:
            tokenEstimate.confidence === "high"
              ? "rgba(34, 197, 94, 0.1)"
              : tokenEstimate.confidence === "medium"
                ? "rgba(202, 138, 4, 0.1)"
                : "rgba(220, 38, 38, 0.1)",
        }}
      >
        <div>
          <span className="font-semibold">Tokens:</span>
          <span className="ml-2">
            {tokenEstimate.min === tokenEstimate.max
              ? tokenEstimate.min
              : `${tokenEstimate.min}-${tokenEstimate.max}`}
          </span>
        </div>
        <div className={`font-semibold ${confidenceColorClass}`}>
          {tokenEstimate.confidence.charAt(0).toUpperCase() +
            tokenEstimate.confidence.slice(1)}{" "}
          confidence
        </div>
      </div>
    </div>
  );
}
