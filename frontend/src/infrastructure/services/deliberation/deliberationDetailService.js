import api from "@src/infrastructure/services/commonService";

const entity = "deliberation_details";

export default {
  // -------------------------
  // CRUD
  // -------------------------

  // GET /api/deliberation_mention_details
  getAll: () => api.getAll(entity),

  // GET /api/deliberation_mention_details/{id}
  getById: (id) => api.get(entity, id),

  // POST /api/deliberation_mention_details
  add: (dto) => api.add(entity, dto),

  // PUT /api/deliberation_mention_details/{id}
  update: (id, dto) => api.update(entity, id, dto),

  // DELETE /api/deliberation_mention_details/{id}
  delete: (id) => api.remove(entity, id),

  getAllByAnneeMentionSesmestreSession: (anneeId, mentionId, semestreId, sessionId) => api.getAll(entity, { path: `annee/${anneeId}/mention/${mentionId}/semestre/${semestreId}/session/${sessionId}/deliberation`}),

  getAllByAnneeMentionSesmestreSessionWith: (anneeId, mentionId, semestreId, sessionId) => api.getAll(entity, { path: `annee/${anneeId}/mention/${mentionId}/semestre/${semestreId}/session/${sessionId}/traitement`}),
};