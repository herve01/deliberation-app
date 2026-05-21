import api from "@src/infrastructure/services/commonService";

const entity = "users";

export default {
  // -------------------------
  // CRUD
  // -------------------------

  // GET /api/users
  getAll: () => api.getAll(entity),

  // GET /api/users/{id}
  getById: (id) => api.get(entity, id),

  // POST /api/users
  add: (dto) => api.add(entity, dto),

  // PUT /api/users/{id}
  update: (id, dto) => api.update(entity, id, dto),

  // DELETE /api/users/{id}
  delete: (id) => api.remove(entity, id),
};