import { apiClient } from "../utils/api";
import { mapNoteRead, mapPromptRead } from "../utils/promptMappers";

export async function fetchPromptsPage({
  filterBy,
  sortBy,
  cursor,
  limit,
}) {
  const { data } = await apiClient.get("/api/v1/prompts", {
    params: {
      filter_by: filterBy,
      sort_by: sortBy,
      direction: "forward",
      cursor: cursor || undefined,
      limit,
    },
  });
  return {
    items: (data.items || []).map(mapPromptRead),
    next_cursor: data.next_cursor ?? null,
    has_more: !!data.has_more,
  };
}

export async function createPrompt(body) {
  const { data } = await apiClient.post("/api/v1/prompts", body);
  return mapPromptRead(data);
}

export async function deletePrompt(promptId) {
  await apiClient.delete(`/api/v1/prompts/${promptId}`);
}

export async function updatePrompt(promptId, patch) {
  const { data } = await apiClient.patch(`/api/v1/prompts/${promptId}`, patch);
  return mapPromptRead(data);
}

export async function ratePrompt(promptId, rating) {
  const { data } = await apiClient.post(`/api/v1/prompts/${promptId}/rate`, {
    rating,
  });
  return data;
}

export async function fetchNotesPage({ promptId, sortBy, cursor, limit }) {
  const { data } = await apiClient.get(`/api/v1/prompts/${promptId}/notes`, {
    params: {
      sort_by: sortBy,
      direction: "forward",
      cursor: cursor || undefined,
      limit,
    },
  });
  return {
    items: (data.items || []).map(mapNoteRead),
    next_cursor: data.next_cursor ?? null,
    has_more: !!data.has_more,
  };
}

export async function createNote(promptId, content) {
  const { data } = await apiClient.post(
    `/api/v1/prompts/${promptId}/notes`,
    { content },
  );
  return mapNoteRead(data);
}

export async function voteOnNote(promptId, noteId, voteType) {
  const { data } = await apiClient.post(
    `/api/v1/prompts/${promptId}/notes/${noteId}/vote`,
    { vote_type: voteType },
  );
  return mapNoteRead(data);
}
