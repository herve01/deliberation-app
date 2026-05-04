import api from "@src/infrastructure/services/commonService";

const entity = "etudiants";

export default {
  // -------------------------
  // CRUD
  // -------------------------

  // GET /api/etudiants
  getAll: () => api.getAll(entity),

  // GET /api/etudiants/{id}
  getById: (id) => api.get(entity, id),

  // POST /api/etudiants
  add: (dto) => api.add(entity, dto),

  // PUT /api/etudiants/{id}
  update: (id, dto) => api.update(entity, id, dto),

  // DELETE /api/etudiants/{id}
  delete: (id) => api.remove(entity, id),
};