import api from "@src/infrastructure/services/commonService";

const entity = "mentions";

export default {
  // -------------------------
  // CRUD
  // -------------------------

  // GET /api/mentions
  getAll: () => api.getAll(entity),

  // GET /api/mentions/{id}
  getById: (id) => api.get(entity, id),

  // POST /api/mentions
  add: (dto) => api.add(entity, dto),

  // PUT /api/mentions/{id}
  update: (id, dto) => api.update(entity, id, dto),

  // DELETE /api/mentions/{id}
  delete: (id) => api.remove(entity, id),
};