import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { estimateTokens } from "../utils/metadata";
import { promptFormSchema } from "../validation/schemas";
import { submitButtonClass } from "../utils/styles";
import FormField from "./FormField";

const MODEL_OPTIONS = [
  { value: "GPT-4", text: "GPT-4" },
  { value: "GPT-3.5", text: "GPT-3.5" },
  { value: "Claude-3", text: "Claude-3" },
  { value: "Claude-2", text: "Claude-2" },
  { value: "Gemini", text: "Gemini" },
  { value: "Custom Model", text: "Custom Model" },
];

export default function PromptForm({ onSave }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
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
        <FormField
          label="Title"
          registration={register("title")}
          error={errors.title}
          placeholder="Enter prompt title"
        />

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
          <FormField
            label="Custom Model Name"
            registration={register("customModel")}
            error={errors.customModel}
            placeholder="Enter custom model name"
          />
        )}

        <FormField
          label="Content"
          as="textarea"
          registration={register("content")}
          error={errors.content}
          placeholder="Enter prompt content"
          className="resize-none"
          rows={6}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className={submitButtonClass}
        >
          Save Prompt
        </button>
      </form>
    </div>
  );
}
