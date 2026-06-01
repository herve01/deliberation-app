import api from "@src/infrastructure/services/commonService";

const entity = "sessions";

export default {
  // -------------------------
  // CRUD
  // -------------------------

  // GET /api/sessions
  getAll: () => api.getAll(entity),

  // GET /api/sessions/{id}
  getById: (id) => api.get(entity, id),

  // POST /api/sessions
  add: (dto) => api.add(entity, dto),

  // PUT /api/sessions/{id}
  update: (id, dto) => api.update(entity, id, dto),

  // DELETE /api/sessions/{id}
  delete: (id) => api.remove(entity, id),

  // GET /etudiant/{etudiantId}/annee/{anneeId}
  getAllByMentionIncrementor: (incrementor) => api.getAll(entity, { path: `semestre-numero-incrementor/${incrementor}`,}),

  getAllByWithoutMentionIncrementor: (incrementor) => api.getAll(entity, { path: `semestre-without-numero-incrementor/${incrementor}`,}),
};