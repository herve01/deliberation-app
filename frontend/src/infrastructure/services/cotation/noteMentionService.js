import api from "@src/infrastructure/services/commonService";

const entity = "note_mention_details";

export default {
  // -------------------------
  // CRUD
  // -------------------------

  // GET /api/note_mention_details
  getAll: () => api.getAll(entity),

  // GET /api/note_mention_details/{id}
  getById: (id) => api.get(entity, id),

  // POST /api/note_mention_details
  add: (dto) => api.add(entity, dto),

  // PUT /api/note_mention_details/{id}
  update: (id, dto) => api.update(entity, id, dto),

  // DELETE /api/note_mention_details/{id}
  delete: (id) => api.remove(entity, id),
};