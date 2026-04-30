import api from "./commonService";

const entity = "contacts";

export default {
  getAll: () => api.getAll(entity),
  get: (id) => api.get(entity, id),
  add: (dto) => api.add(entity, dto),
  update: (id, dto) => api.update(entity, id, dto),
  delete: (id) => api.remove(entity, id),
};