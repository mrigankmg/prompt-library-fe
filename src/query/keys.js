export const queryKeys = {
  auth: {
    me: ["auth", "me"],
  },
  prompts: {
    root: ["prompts"],
    lists: ["prompts", "list"],
    list: (params) => ["prompts", "list", params],
  },
  notes: {
    root: (promptId) => ["prompts", promptId, "notes"],
    list: (promptId, params) => ["prompts", promptId, "notes", params],
  },
};
