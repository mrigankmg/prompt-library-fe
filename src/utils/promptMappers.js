/** Map API (snake_case) prompt payloads to UI shape (camelCase). */

export function mapPromptRead(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    userId: raw.user_id,
    title: raw.title,
    content: raw.content,
    aiAgent: raw.ai_agent,
    isPrivate: raw.is_private,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    averageRating: raw.average_rating ?? 0,
    ratingCount: raw.rating_count,
    userRating: raw.user_rating ?? 0,
    metadata: {
      model: raw.ai_agent,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
      tokenEstimate: null,
    },
  };
}

export function mapNoteRead(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    promptId: raw.prompt_id,
    userId: raw.user_id,
    content: raw.content,
    upvoteCount: raw.upvote_count ?? 0,
    downvoteCount: raw.downvote_count ?? 0,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    userVote: raw.user_vote ?? null,
  };
}
