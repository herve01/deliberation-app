import api from "@src/infrastructure/services/commonService";

const entity = "cycles";

export default {
  // -------------------------
  // CRUD
  // -------------------------

  // GET /api/cycles
  getAll: () => api.getAll(entity),

  // GET /api/cycles/{id}
  getById: (id) => api.get(entity, id),

  // POST /api/cycles
  add: (dto) => api.add(entity, dto),

  // PUT /api/cycles/{id}
  update: (id, dto) => api.update(entity, id, dto),

  // DELETE /api/cycles/{id}
  delete: (id) => api.remove(entity, id),
};