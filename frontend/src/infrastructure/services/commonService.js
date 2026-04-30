// src/services/api.js
import { http } from "./http";
import utils from "@src/infrastructure/utils";

const baseUrl = `${utils.url}/api`;

// 🔥 fonctions génériques
const getAll = async (entity) => {
  const { data } = await http.get(`/${entity}`);
  console.log("GET:", `${baseUrl}/${entity}`);
  return data;
};

const get = async (entity, id) => {
  const { data } = await http.get(`/${entity}/${id}`);
  console.log("GET:", `${baseUrl}/${entity}/${id}`);
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
  console.log("POST:", `${baseUrl}/${entity}`, dto);
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

// ✅ export unique
const api = {
  getAll,
  search,
  add,
  update,
  remove,
  login,
};

export default api;