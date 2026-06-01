import api from "@src/infrastructure/services/commonService";

const entity = "cotation_semestre_ecues";

export default {
  // -------------------------
  // CRUD
  // -------------------------

  getAll: () => api.getAll(entity),

  getById: (id) => api.get(entity, id),

  add: (dto) => api.add(entity, dto),

  update: (id, dto) => api.update(entity, id, dto),

  delete: (id) => api.remove(entity, id),

  // -------------------------
  // CUSTOM ENDPOINTS
  // -------------------------

  // POST /api/note_mention_details/add_all
  addWithDetails: (dto) =>
    api.add(`${entity}/add_all`, dto),

  // GET complex endpoint
  getByMentionSemestreAnneeSession: (mentionId, semestreId, anneeId, sessionId) => api.get(entity, {
        path: `mention/${mentionId}/semestre/${semestreId}/annee/${anneeId}/session/${sessionId}/details`}),
  };

