import api from "@src/infrastructure/services/commonService";

const entity = "annees";

export default {
  // -------------------------
  // CRUD
  // -------------------------

  // GET /api/annees
  getAll: () => api.getAll(entity),

  // GET /api/annees/{id}
  getById: (id) => api.get(entity, id),

  // POST /api/annees
  add: (dto) => api.add(entity, dto),

  // PUT /api/annees/{id}
  update: (id, dto) => api.update(entity, id, dto),

  // DELETE /api/annees/{id}
  delete: (id) => api.remove(entity, id),

  // -------------------------
  // MÉTIER (spécifique backend)
  // -------------------------

  // GET /api/annees/search?annee=2023-2024
  searchByAnnee: (annee) => api.get(entity, { path: "search", params: { annee },}),

  // GET /api/annees/current
  getCurrent: () => api.get(entity, { path: "current",}),

  // GET /api/annees/previous
  getPrevious: () => api.get(entity, { path: "previous",}),

  // GET /api/annees/next
  getNext: () => api.get(entity, { path: "next",}),
};