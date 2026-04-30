import api from "./commonService";

export default {
  login: (dto) => api.login("login", dto),
};