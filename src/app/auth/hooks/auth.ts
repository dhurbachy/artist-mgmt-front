import { useMutation,useQuery } from "@tanstack/react-query";
import type { ApiError } from "@/services/artist-services";
import { AuthService } from "@/services/artist-services/services/AuthService";
import { OpenAPI } from "@/services/artist-services/core/OpenAPI";

interface LoginPayload {
  email: string;
  password: string;
}
// -------------------- LOGIN --------------------
export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      AuthService.authControllerLogin(payload),
    onSuccess: (data) => {
      console.log(data);
      const token = data.access_token;
      console.log(token);
      if (token) {
        localStorage.setItem("access_token", token);
        OpenAPI.TOKEN = token; // ✅ Set immediately so subsequent calls work
      }
    },
  });
};

// -------------------- REGISTER --------------------
export const useRegister = () => {
  return useMutation({
    mutationFn: (payload: {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
    }) => AuthService.authControllerRegister(payload),
    onSuccess: (data) => {
      const token = data.access_token;
      if (token) {
        localStorage.setItem("access_token", token);
        OpenAPI.TOKEN = token;
      }
    },
    onError: (error: ApiError) => {
      console.error("Registration failed", error);
    },
  });
};

// -------------------- LOGOUT --------------------
export const useLogout = () => {
  return useMutation({
    mutationFn: () => AuthService.authControllerLogout(),
    onSuccess: () => {
      localStorage.removeItem("access_token");
      OpenAPI.TOKEN = undefined;
      window.location.href = "/login"; // hard redirect to clear all state
    },
    onError: (err:ApiError) => {
      // clear anyway even if API call fails
      localStorage.removeItem("access_token");
      OpenAPI.TOKEN = undefined;
      window.location.href = "/login";
    },
  });
};

// -------------------- REFRESH --------------------
export const useRefresh = () => {
  return useMutation({
    mutationFn: () => AuthService.authControllerRefresh(),
    onSuccess: (data) => {
      const token = data.access_token;
      if (token) {
        localStorage.setItem("access_token", token);
        OpenAPI.TOKEN = token;
      }
    },
    onError: () => {
      // refresh failed — token expired, force re-login
      localStorage.removeItem("access_token");
      OpenAPI.TOKEN = undefined;
      window.location.href = "/login";
    },
  });
};

// -------------------- GET ME --------------------
export const useGetMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => AuthService.authControllerGetMe(),
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem("access_token"), // only fetch if token exists
  });
};