import api from "@src/infrastructure/services/commonService";

const entity = "unite_enseignements";

export default {
  // -------------------------
  // CRUD
  // -------------------------

  // GET /api/unite_enseignements
  getAll: () => api.getAll(entity),

  // GET /api/unite_enseignements/{id}
  getById: (id) => api.get(entity, id),

  // POST /api/unite_enseignements
  add: (dto) => api.add(entity, dto),

  // PUT /api/unite_enseignements/{id}
  update: (id, dto) => api.update(entity, id, dto),

  // DELETE /api/unite_enseignements/{id}
  delete: (id) => api.remove(entity, id),
};