import axios, { AxiosError } from "axios";
import { OpenAPI } from "./artist-services/core/OpenAPI";

export const BASE_URL = "http://localhost:3000";

OpenAPI.BASE = BASE_URL; // ✅ Set once at module load time, not per-request

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
    OpenAPI.TOKEN = token;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/login"; // ✅ Uncomment to auto-redirect
    }
    return Promise.reject(error);
  }
);