import api from "@src/infrastructure/services/commonService";

const entity = "filieres";

export default {
  // -------------------------
  // CRUD
  // -------------------------

  // GET /api/filieres
  getAll: () => api.getAll(entity),

  // GET /api/filieres/{id}
  getById: (id) => api.get(entity, id),

  // POST /api/filieres
  add: (dto) => api.add(entity, dto),

  // PUT /api/filieres/{id}
  update: (id, dto) => api.update(entity, id, dto),

  // DELETE /api/filieres/{id}
  delete: (id) => api.remove(entity, id),

  // GET /domaine/{domaineId}
  getAllByDomaine: (domaineId) => api.getAll(entity, { path: `domaine/${domaineId}`,}),

  getWithDomaineAll: (withDomaine) => api.getAll(entity, { path: `with-domaine/${withDomaine}`,}),

};