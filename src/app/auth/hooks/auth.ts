import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../../services/ApiInterceptor"; // your Axios setup
import type { ApiError } from "@/services/artist-services";

// -------------------- LOGIN --------------------
export const useLogin = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: { email: string; password: string }) => {
      // Call your login endpoint
      const res = await axiosInstance.post("/auth/login", data);
      // Save token in localStorage
      localStorage.setItem("access_token", res.data.access_token);
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Login successful", data);
    },
    onError: (error: ApiError) => {
      console.error("Login failed", error);
    },
  });
};

// -------------------- REGISTER --------------------
export const useRegister = () => {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: async (data: {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
    }) => {
      const res = await axiosInstance.post("/auth/register", data);
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Registration successful", data);
    },
    onError: (error: ApiError) => {
      console.error("Registration failed", error);
    },
  });
};