import api from "@src/infrastructure/services/commonService";

const entity = "ecues";

export default {
  // -------------------------
  // CRUD
  // -------------------------

  // GET /api/ecues
  getAll: () => api.getAll(entity),

  // GET /api/ecues/{id}
  getById: (id) => api.get(entity, id),

  // POST /api/ecues
  add: (dto) => api.add(entity, dto),

  // PUT /api/ecues/{id}
  update: (id, dto) => api.update(entity, id, dto),

  // DELETE /api/ecues/{id}
  delete: (id) => api.remove(entity, id),
};