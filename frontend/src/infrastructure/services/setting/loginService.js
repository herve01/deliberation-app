import api from "@src/infrastructure/services/commonService";

export default {
  login: (dto) => api.login("login", dto),
};