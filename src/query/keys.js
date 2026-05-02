export const queryKeys = {
  auth: {
    me: ["auth", "me"],
  },
  prompts: {
    root: ["prompts"],
    list: (params) => ["prompts", "list", params],
  },
  notes: {
    list: (promptId, params) => ["prompts", promptId, "notes", params],
  },
};
