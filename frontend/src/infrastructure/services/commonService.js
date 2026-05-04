import { http } from "./http";
import utils from "@src/infrastructure/utils";

const baseUrl = `${utils.url}/api`;

// helper
const buildUrl = (entity, path = "") => {
  let url = `/${entity}`;
  if (path) url += `/${path}`;
  return url;
};

// GET ALL ou avec path + params
const getAll = async (entity, options = {}) => {
  const { path = "", params = {} } = options;

  const url = buildUrl(entity, path);

  const { data } = await http.get(url, { params });
  console.log("GET:", `${baseUrl}${url}`);

  return data;
};

// GET (id OU path custom)
const get = async (entity, arg = null, options = {}) => {
  let url = `/${entity}`;

  // cas 1 : ID
  if (typeof arg === "string" || typeof arg === "number") {
    url += `/${arg}`;
  }

  // cas 2 : path custom
  if (typeof arg === "object" && arg !== null) {
    options = arg;
  }

  if (options.path) {
    url += `/${options.path}`;
  }

  const { data } = await http.get(url, { params: options.params || {} });

  console.log("GET:", `${baseUrl}${url}`);
  return data;
};

const search = async (entity, q) => {
  const { data } = await http.get(`/${entity}/search`, {
    params: { q },
  });
  return data;
};

const add = async (entity, dto) => {
  const { data } = await http.post(`/${entity}`, dto);
  console.log("POST:", `${baseUrl}/${entity}`);
  return data;
};

const update = async (entity, id, dto) => {
  const { data } = await http.put(`/${entity}/${id}`, dto);
  console.log("PUT:", `${baseUrl}/${entity}/${id}`);
  return data;
};

const remove = async (entity, id) => {
  await http.delete(`/${entity}/${id}`);
  console.log("DELETE:", `${baseUrl}/${entity}/${id}`);
};

const login = async (entity, dto) => {
  const { data } = await http.post(`/${entity}`, dto);
  console.log("LOGIN:", `${baseUrl}/${entity}`);
  return data;
};

// export unique
export default {
  getAll,
  get,
  search,
  add,
  update,
  remove,
  login,
};