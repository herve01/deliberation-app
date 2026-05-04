import api from "@src/infrastructure/services/commonService";

const entity = "domaines";

export default {
  // -------------------------
  // CRUD
  // -------------------------

  // GET /api/domaines
  getAll: () => api.getAll(entity),

  // GET /api/domaines/{id}
  getById: (id) => api.get(entity, id),

  // POST /api/domaines
  add: (dto) => api.add(entity, dto),

  // PUT /api/domaines/{id}
  update: (id, dto) => api.update(entity, id, dto),

  // DELETE /api/domaines/{id}
  delete: (id) => api.remove(entity, id),
};