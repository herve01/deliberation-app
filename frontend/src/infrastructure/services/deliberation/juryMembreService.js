import api from "@src/infrastructure/services/commonService";

const entity = "jury_membres";

export default {
  // -------------------------
  // CRUD
  // -------------------------

  // GET /api/jury_membres
  getAll: () => api.getAll(entity),

  // GET /api/jury_membres/{id}
  getById: (id) => api.get(entity, id),

  // POST /api/jury_membres
  add: (dto) => api.add(entity, dto),

  // PUT /api/jury_membres/{id}
  update: (id, dto) => api.update(entity, id, dto),

  // DELETE /api/jury_membres/{id}
  delete: (id) => api.remove(entity, id),
};