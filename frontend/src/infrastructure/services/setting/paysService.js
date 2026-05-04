import api from "@src/infrastructure/services/commonService";

const entity = "pays";

export default {
  // -------------------------
  // CRUD
  // -------------------------

  // GET /api/pays
  getAll: () => api.getAll(entity),

  // GET /api/pays/{id}
  get: (id) => api.get(entity, id),

};