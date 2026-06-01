import api from "@src/infrastructure/services/commonService";

const entity = "deliberations";

export default {
  // -------------------------
  // CRUD
  // -------------------------

  // GET /api/deliberations
  getAll: () => api.getAll(entity),

  // GET /api/deliberations/{id}
  getById: (id) => api.get(entity, id),

  // POST /api/deliberations
  add: (dto) => api.add(entity, dto),

  // PUT /api/deliberations/{id}
  update: (id, dto) => api.update(entity, id, dto),

  // DELETE /api/deliberations/{id}
  delete: (id) => api.remove(entity, id),
  
   // POST /api/deliberations/add_all
  addWithDetails: (dto) =>
      api.add(`${entity}/add_all`, dto),
};