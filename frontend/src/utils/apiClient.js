// src/utils/apiClient.js
import axios from "axios";


const apiClient = axios.create({
  baseURL: "http://localhost:3000/api", // your backend base URL
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ccps-token"); // or context
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
