import { http } from "./http";
import utils from "@src/infrastructure/utils";

const baseUrl = `${utils.url}/api`;

// helper
const buildUrl = (entity, path = "") => {
  const cleanEntity = entity.startsWith("/") ? entity : `/${entity}`;
  const cleanPath = path ? `/${path}` : "";
  return `${cleanEntity}${cleanPath}`;
};

// GET ALL
const getAll = async (entity, options = {}) => {
  const { path = "", params = {} } = options;

  const url = buildUrl(entity, path);

  const { data } = await http.get(url, { params });

  console.log("GET:", `${baseUrl}${url}`);
  return data;
};

// GET (id OU path custom)
const get = async (entity, arg = null, options = {}) => {
  let url = buildUrl(entity);

  // cas ID
  if (typeof arg === "string" || typeof arg === "number") {
    url += `/${arg}`;
  }

  // cas options direct
  if (arg && typeof arg === "object" && !Array.isArray(arg)) {
    options = arg;
  }

  // path custom
  if (options.path) {
    url += `/${options.path}`;
  }

  const { data } = await http.get(url, {
    params: options.params || {}
  });

  console.log("GET:", `${baseUrl}${url}`);
  return data;
};

// SEARCH
const search = async (entity, q) => {
  const url = buildUrl(entity, "search");

  const { data } = await http.get(url, {
    params: { q }
  });

  console.log("SEARCH:", `${baseUrl}${url}`);
  return data;
};

// ADD (POST)
const add = async (entity, dto) => {
  const url = buildUrl(entity);

  const { data } = await http.post(url, dto);

  console.log("POST:", `${baseUrl}${url}`);
  return data;
};

// UPDATE
const update = async (entity, id, dto) => {
  const url = buildUrl(entity, id);

  const { data } = await http.put(url, dto);

  console.log("PUT:", `${baseUrl}${url}`);
  return data;
};

// DELETE
const remove = async (entity, id) => {
  const url = buildUrl(entity, id);

  await http.delete(url);

  console.log("DELETE:", `${baseUrl}${url}`);
};

// LOGIN
const login = async (entity, dto) => {
  const url = buildUrl(entity);

  const { data } = await http.post(url, dto);

  console.log("LOGIN:", `${baseUrl}${url}`);
  return data;
};

export default {
  getAll,
  get,
  search,
  add,
  update,
  remove,
  login,
};