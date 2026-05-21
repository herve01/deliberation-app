import api from "@src/infrastructure/services/commonService";

const entity = "mention_ecue_details";

export default {
  // -------------------------
  // CRUD
  // -------------------------

  // GET /api/mention_ecue_details
  getAll: () => api.getAll(entity),

  // GET /api/mention_ecue_details/{id}
  getById: (id) => api.get(entity, id),

  // POST /api/mention_ecue_details
  add: (dto) => api.add(entity, dto),

  // PUT /api/mention_ecue_details/{id}
  update: (id, dto) => api.update(entity, id, dto),

  // DELETE /api/mention_ecue_details/{id}
  delete: (id) => api.remove(entity, id),

  // GET /etudiant/{etudiantId}/annee/{anneeId}
  getAllByMentionSemestreAnnee: (mentionId, semestreId, anneeId) => api.getAll(entity, { path: `mention/${mentionId}/semestre/${semestreId}/annee/${anneeId}`,}),
};