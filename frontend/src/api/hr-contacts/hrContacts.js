// src/api/hrContacts.js
import apiClient from "../../utils/apiClient";

export const getAllHRContacts = async (params = {}) => {
  const { data } = await apiClient.get("/hr-contacts", { params });
  return data;
};

export const getHRContactById = async (id) => {
  const { data } = await apiClient.get(`/hr-contacts/${id}`);
  return data;
};

export const createHRContact = async (contact) => {
  const { data } = await apiClient.post("/hr-contacts", contact);
  return data;
};

export const updateHRContact = async (id, updates) => {
  const { data } = await apiClient.put(`/hr-contacts/${id}`, updates);
  return data;
};

export const deleteHRContact = async (id) => {
  const { data } = await apiClient.delete(`/hr-contacts/${id}`);
  return data;
};

export const assignCallerToHR = async (id, userId) => {
  const { data } = await apiClient.patch(`/hr-contacts/${id}/assign`, {
    assigned_to_user_id: userId,
  });
  return data;
};

export const exportHRContactsCSV = async () => {
  const { data } = await apiClient.get("/hr-contacts/export/csv");
  return data;
};
