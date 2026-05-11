import { apiClient } from "../utils/api";
import { mapNoteRead, mapPromptRead } from "../utils/promptMappers";

export async function fetchPromptsPage({
  filterBy,
  sortBy,
  cursor,
  limit,
  direction = "forward",
}) {
  const { data } = await apiClient.get("/api/v1/prompts", {
    params: {
      filter_by: filterBy,
      sort_by: sortBy,
      direction,
      cursor: cursor || undefined,
      limit,
    },
  });
  return {
    items: (data.items || []).map(mapPromptRead),
    next_cursor: data.page_info?.end_cursor ?? null,
    prev_cursor: data.page_info?.start_cursor ?? null,
    has_more: !!data.page_info?.has_next_page,
    has_previous: !!data.page_info?.has_previous_page,
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
  const { data } = await apiClient.put(`/api/v1/prompts/${promptId}/rate`, {
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
  const { data } = await apiClient.post(`/api/v1/prompts/${promptId}/notes`, {
    content,
  });
  return mapNoteRead(data);
}

export async function deleteNote(promptId, noteId) {
  await apiClient.delete(`/api/v1/prompts/${promptId}/notes/${noteId}`);
}

export async function voteOnNote(promptId, noteId, voteType) {
  const { data } = await apiClient.post(
    `/api/v1/prompts/${promptId}/notes/${noteId}/vote`,
    { vote_type: voteType },
  );
  return mapNoteRead(data);
}
