import api from "@src/infrastructure/services/commonService";

const entity = "mention_jury_membre_details";

export default {
  // -------------------------
  // CRUD
  // -------------------------

  // GET /api/mention_jury_membre_details
  getAll: () => api.getAll(entity),

  // GET /api/mention_jury_membre_details/{id}
  getById: (id) => api.get(entity, id),

  // POST /api/mention_jury_membre_details
  add: (dto) => api.add(entity, dto),

  // PUT /api/mention_jury_membre_details/{id}
  update: (id, dto) => api.update(entity, id, dto),

  // DELETE /api/mention_jury_membre_details/{id}
  delete: (id) => api.remove(entity, id),
};