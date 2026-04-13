/**
 * Estimate tokens from text content
 * @param {string} text - The text to estimate tokens for
 * @param {boolean} isCode - Whether the text is code
 * @returns {Object} Token estimate object with min, max, and confidence
 * @throws {Error} If text is not a string
 */
export function estimateTokens(text, isCode = false) {
  try {
    if (typeof text !== "string") {
      throw new Error("Text must be a valid string");
    }

    // Count words and characters
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const chars = text.length;

    // Base calculation: min = 0.75 * word_count, max = 0.25 * character_count
    let min = 0.75 * words;
    let max = 0.25 * chars;

    // If code, multiply both by 1.3
    if (isCode) {
      min = min * 1.3;
      max = max * 1.3;
    }

    // Round to integers
    min = Math.max(0, Math.ceil(min));
    max = Math.max(min, Math.ceil(max));

    // Determine confidence level
    let confidence = "high";
    if (max >= 5000) {
      confidence = "low";
    } else if (max >= 1000) {
      confidence = "medium";
    }

    return {
      min,
      max,
      confidence,
    };
  } catch (error) {
    throw new Error(`Token estimation failed: ${error.message}`);
  }
}

/**
 * Get confidence color for token estimate
 * Used for visual display purposes
 * @param {string} confidence - The confidence level ('high', 'medium', 'low')
 * @returns {string} Tailwind color class
 */
export function getConfidenceColor(confidence) {
  const colorMap = {
    high: "text-green-600",
    medium: "text-yellow-600",
    low: "text-red-600",
  };
  return colorMap[confidence] || "text-gray-600";
}

/**
 * Format ISO date to human-readable string
 * @param {string} isoDate - ISO 8601 date string
 * @returns {string} Human-readable formatted date
 */
export function formatDate(isoDate) {
  try {
    if (!isValidISO8601(isoDate)) {
      throw new Error("Invalid ISO 8601 date format");
    }
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  } catch (error) {
    return "Invalid date";
  }
}

/**
 * Validate ISO 8601 date string
 * @param {string} dateString - The date string to validate
 * @returns {boolean} True if valid ISO 8601 date
 */
function isValidISO8601(dateString) {
  if (typeof dateString !== "string") return false;
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  if (!iso8601Regex.test(dateString)) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}
