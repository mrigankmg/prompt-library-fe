import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Please enter your email"),
  password: z.string().min(1, "Please enter your password"),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "Please enter your first name"),
    lastName: z.string().min(1, "Please enter your last name"),
    email: z.string().min(1, "Please enter your email"),
    password: z.string().min(1, "Please enter a password"),
    passwordConfirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

export const promptFormSchema = z
  .object({
    title: z.string().min(1, "Please enter a title"),
    content: z.string().min(1, "Please enter content"),
    selectedModel: z.string(),
    customModel: z.string(),
  })
  .superRefine((d, ctx) => {
    if (d.selectedModel === "Custom Model") {
      const v = d.customModel.trim();
      if (!v || v.length > 50) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a model name (max 50 characters)",
          path: ["customModel"],
        });
      }
    }
  });
