import { useState } from "react";
import { estimateTokens } from "../utils/metadata";

const MODEL_OPTIONS = [
  { value: "GPT-4", text: "GPT-4" },
  { value: "GPT-3.5", text: "GPT-3.5" },
  { value: "Claude-3", text: "Claude-3" },
  { value: "Claude-2", text: "Claude-2" },
  { value: "Gemini", text: "Gemini" },
  { value: "Custom Model", text: "Custom Model" },
];

export default function PromptForm({ onSave }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedModel, setSelectedModel] = useState("Claude-3");
  const [customModel, setCustomModel] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [modelError, setModelError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const sanitizedTitle = title.trim();
    const sanitizedContent = content.trim();
    const sanitizedCustomModel = customModel.trim();
    const isCustomModel = selectedModel === "Custom Model";

    const hasError =
      !sanitizedTitle ||
      !sanitizedContent ||
      (isCustomModel && (!sanitizedCustomModel || sanitizedCustomModel.length > 50));

    if (!sanitizedTitle) setTitleError("Please enter a title");
    if (!sanitizedContent) setContentError("Please enter content");
    if (isCustomModel && (!sanitizedCustomModel || sanitizedCustomModel.length > 50))
      setModelError("Please enter a model name (max 50 characters)");

    if (hasError) return;

    const modelName = isCustomModel ? sanitizedCustomModel : selectedModel;
    const tokenEstimate = estimateTokens(content, false);
    const now = new Date().toISOString();

    onSave({
      title: sanitizedTitle,
      content: sanitizedContent,
      metadata: { model: modelName, createdAt: now, updatedAt: now, tokenEstimate },
    });

    setTitle("");
    setContent("");
    setSelectedModel("Claude-3");
    setCustomModel("");
    setTitleError("");
    setContentError("");
    setModelError("");
  };

  const fieldClass = (error) =>
    `w-full px-4 py-2 border ${
      error ? "border-red-500" : "border-gray-300 dark:border-gray-700"
    } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 ${
      error ? "focus:ring-red-500" : "focus:ring-orange-500"
    } focus:border-transparent outline-none transition`;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md p-6 sticky top-4 rounded-lg transition-colors duration-200">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Create New Prompt
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); if (titleError) setTitleError(""); }}
            placeholder="Enter prompt title"
            className={fieldClass(titleError)}
          />
          {titleError && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{titleError}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Model Used
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
          >
            {MODEL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>
        </div>
        {selectedModel === "Custom Model" && (
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Custom Model Name
            </label>
            <input
              type="text"
              value={customModel}
              onChange={(e) => { setCustomModel(e.target.value); if (modelError) setModelError(""); }}
              placeholder="Enter custom model name"
              className={fieldClass(modelError)}
            />
            {modelError && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{modelError}</p>
            )}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => { setContent(e.target.value); if (contentError) setContentError(""); }}
            placeholder="Enter prompt content"
            rows="6"
            className={`${fieldClass(contentError)} resize-none`}
          />
          {contentError && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{contentError}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95 hover:cursor-pointer"
        >
          Save Prompt
        </button>
      </form>
    </div>
  );
}
