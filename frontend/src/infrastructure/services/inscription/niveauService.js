import api from "@src/infrastructure/services/commonService";

const entity = "niveaux";

export default {
  // -------------------------
  // CRUD
  // -------------------------

  // GET /api/niveaux
  getAll: () => api.getAll(entity),

  // GET /api/niveaux/{id}
  getById: (id) => api.get(entity, id),

  // POST /api/niveaux
  add: (dto) => api.add(entity, dto),

  // PUT /api/niveaux/{id}
  update: (id, dto) => api.update(entity, id, dto),

  // DELETE /api/annees/{id}
  delete: (id) => api.remove(entity, id),

  // GET /liste/{type}/{id}
  getAllLMD: (isOldSystem) => api.getAll(entity, { path: `all/${isOldSystem}`,}),
};