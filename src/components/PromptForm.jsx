import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { estimateTokens } from "../utils/metadata";
import { promptFormSchema } from "../validation/schemas";

const MODEL_OPTIONS = [
  { value: "GPT-4", text: "GPT-4" },
  { value: "GPT-3.5", text: "GPT-3.5" },
  { value: "Claude-3", text: "Claude-3" },
  { value: "Claude-2", text: "Claude-2" },
  { value: "Gemini", text: "Gemini" },
  { value: "Custom Model", text: "Custom Model" },
];

const inputClass = (fieldError) =>
  `w-full px-4 py-2 border ${
    fieldError ? "border-red-500" : "border-gray-300 dark:border-gray-700"
  } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 ${
    fieldError ? "focus:ring-red-500" : "focus:ring-orange-500"
  } focus:border-transparent outline-none transition`;

export default function PromptForm({ onSave }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(promptFormSchema),
    defaultValues: {
      title: "",
      content: "",
      selectedModel: "Claude-3",
      customModel: "",
    },
  });

  const selectedModel = watch("selectedModel");

  const onSubmit = (data) => {
    const modelName =
      data.selectedModel === "Custom Model"
        ? data.customModel.trim()
        : data.selectedModel;
    const now = new Date().toISOString();

    onSave({
      title: data.title.trim(),
      content: data.content.trim(),
      metadata: {
        model: modelName,
        createdAt: now,
        updatedAt: now,
        tokenEstimate: estimateTokens(data.content, false),
      },
    });

    reset();
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md p-6 sticky top-4 rounded-lg transition-colors duration-200">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Create New Prompt
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Title
          </label>
          <input
            type="text"
            {...register("title")}
            placeholder="Enter prompt title"
            className={inputClass(errors.title)}
          />
          {errors.title && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Model Used
          </label>
          <select
            {...register("selectedModel")}
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
              {...register("customModel")}
              placeholder="Enter custom model name"
              className={inputClass(errors.customModel)}
            />
            {errors.customModel && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errors.customModel.message}
              </p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Content
          </label>
          <textarea
            {...register("content")}
            placeholder="Enter prompt content"
            rows="6"
            className={`${inputClass(errors.content)} resize-none`}
          />
          {errors.content && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">
              {errors.content.message}
            </p>
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
