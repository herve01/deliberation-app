import api from "@src/infrastructure/services/commonService";

const entity = "deliberation_mentions";

export default {
  // -------------------------
  // CRUD
  // -------------------------

  // GET /api/deliberation_mentions
  getAll: () => api.getAll(entity),

  // GET /api/deliberation_mentions/{id}
  getById: (id) => api.get(entity, id),

  // POST /api/deliberation_mentions
  add: (dto) => api.add(entity, dto),

  // PUT /api/deliberation_mentions/{id}
  update: (id, dto) => api.update(entity, id, dto),

  // DELETE /api/deliberation_mentions/{id}
  delete: (id) => api.remove(entity, id),
};