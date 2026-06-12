import api from "@src/infrastructure/services/commonService";

const entity = "semestres";

export default {
  // -------------------------
  // CRUD
  // -------------------------

  // GET /api/semestres
  getAll: () => api.getAll(entity),

  // GET /api/semestres/{id}
  getById: (id) => api.get(entity, id),

  // POST /api/semestres
  add: (dto) => api.add(entity, dto),

  // PUT /api/semestres/{id}
  update: (id, dto) => api.update(entity, id, dto),

  // DELETE /api/semestres/{id}
  delete: (id) => api.remove(entity, id),

    // GET /etudiant/{etudiantId}/annee/{anneeId}
    getAllByMentionIncrementor: (incrementor) => api.getAll(entity, { path: `semestre-numero-incrementor/${incrementor}`,}),

};