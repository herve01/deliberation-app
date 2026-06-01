import api from "@src/infrastructure/services/commonService";

const entity = "etudiant_ecue_transferts";

export default {
  // -------------------------
  // CRUD
  // -------------------------

  // GET /api/personnels
  getAll: () => api.getAll(entity),

  // GET /api/personnels/{id}
  getById: (id) => api.get(entity, id),

  // POST /api/personnels
  add: (dto) => api.add(entity, dto),

  // PUT /api/personnels/{id}
  update: (id, dto) => api.update(entity, id, dto),

  // DELETE /api/personnels/{id}
  delete: (id) => api.remove(entity, id),
};