import axios, { AxiosError } from "axios";
import { OpenAPI } from "./artist-services/core/OpenAPI";

// Plain base URL (no runtime config)
const BASE_URL = "http://localhost:3000/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Attach JWT token automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token"); // simple storage
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
    OpenAPI.TOKEN = token; // For generated OpenAPI client
    OpenAPI.BASE = BASE_URL; // Set base URL
  }
  return config;
});

// Handle 401 globally (optional)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error?.response?.status === 401) {
      console.error("Unauthorized: clearing token");
      localStorage.removeItem("access_token");
      // optional: redirect to login page
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
