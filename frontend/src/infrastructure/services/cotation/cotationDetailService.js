import api from "@src/infrastructure/services/commonService";

const entity = "cotation_details";

export default {
  // -------------------------
  // CRUD
  // -------------------------

  // GET /api/cotation_mention_details
  getAll: () => api.getAll(entity),

  // GET /api/cotation_mention_details/{id}
  getById: (id) => api.get(entity, id),

  // POST /api/cotation_mention_details
  add: (dto) => api.add(entity, dto),

  // PUT /api/cotation_mention_details/{id}
  update: (id, dto) => api.update(entity, id, dto),

  // DELETE /api/cotation_mention_details/{id}
  delete: (id) => api.remove(entity, id),

  // GET /etudiant/{etudiantId}/annee/{anneeId}
  getAllByMentionSemestreAnneeSession: (mentionId, semestreId, anneeId, sessionId) => api.getAll(entity, { path: `mention/${mentionId}/semestre/${semestreId}/annee/${anneeId}/session/${sessionId}`,}),

  getAllByCotationEcue: (cotationId, ecueId) => api.getAll(entity, { path: `cotation/${cotationId}/ecue/${ecueId}`}),
};