export const queryKeys = {
  auth: {
    me: ["auth", "me"],
    providers: ["auth", "providers"],
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
