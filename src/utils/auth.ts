// services/apiInterceptor.ts
import axios from "axios";
import { useEffect } from "react";
import { useAuth } from "../context/authContext"; // Import your hook
import { OpenAPI } from "@/services/artist-services/core/OpenAPI";
import { AuthService } from "@/services/artist-services/services/AuthService";

export const useAxiosInterceptor = () => {
  const { login, logout } = useAuth(); // Access context methods

  // We use an effect so this only runs once when the app starts
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const original = error.config;
        if (
          error.response?.status === 401 &&
          original.url?.includes("/auth/refresh")
        ) {
          logout();
          return Promise.reject(error);
        }
        if (error.response?.status === 401 && !original._retry) {
          original._retry = true;
          try {
            const data = await AuthService.authControllerRefresh();
            const newToken = data.access_token;
            OpenAPI.TOKEN = newToken;

            // ✅ UPDATE CONTEXT (This updates your React State)
            login(newToken);

            // Sync with OpenAPI
            original.headers["Authorization"] = `Bearer ${newToken}`;
            return axios(original);
          } catch (err) {
            logout(); // ✅ CLEAR CONTEXT & REDIRECT
            return Promise.reject(err);
          }
        }
        return Promise.reject(error);
      },
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [login, logout]);
};
