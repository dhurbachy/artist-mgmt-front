import { useMutation,useQuery } from "@tanstack/react-query";
import type { ApiError } from "@/services/artist-services";
import { AuthService } from "@/services/artist-services/services/AuthService";
import { OpenAPI } from "@/services/artist-services/core/OpenAPI";
import { useNavigate } from "react-router";
import {ROUTES} from "@/routes/routeConstant";
import { useAuth } from "@/context/authContext";
interface LoginPayload {
  email: string;
  password: string;
}
// -------------------- LOGIN --------------------
export const useLogin = () => {
  const {login}=useAuth();

  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      AuthService.authControllerLogin(payload),
    onSuccess: (data) => {
      console.log(data);
      const token = data.access_token;
      console.log(token);
      if (token) {
        // localStorage.setItem("access_token", token);
        login(token);

        OpenAPI.TOKEN = token;
      }
    },
  });
};

// -------------------- REGISTER --------------------
export const useRegister = () => {
  const navigate=useNavigate();
  return useMutation({
    mutationFn: (payload: {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
    }) => AuthService.authControllerRegister(payload),
    onSuccess: () => {
      navigate(ROUTES.LOGIN);
    },
    onError: (error: ApiError) => {
      console.error("Registration failed", error);
    },
  });
};

// -------------------- LOGOUT --------------------
export const useLogout = () => {
    const {logout}=useAuth();
     const navigate = useNavigate();

  return useMutation({
    mutationFn: () => AuthService.authControllerLogout(),
    onSuccess: () => {
      // localStorage.removeItem("access_token");
      OpenAPI.TOKEN = undefined;
      logout();
      navigate(ROUTES.LOGIN);
    },
    onError: (err:ApiError) => {
      // clear anyway even if API call fails
      // localStorage.removeItem("access_token");
      logout();
      OpenAPI.TOKEN = undefined;
      navigate(ROUTES.LOGIN);
    },
  });
};

// -------------------- REFRESH --------------------
export const useRefresh = () => {
  const {login,logout}=useAuth();
  const navigate=useNavigate();
  return useMutation({
    mutationFn: () => AuthService.authControllerRefresh(),
    onSuccess: (data) => {
      const token = data.access_token;
      if (token) {
        // localStorage.setItem("access_token", token);
        login(token);
        OpenAPI.TOKEN = token;
      }
    },
    onError: () => {
      // refresh failed — token expired, force re-login
      // localStorage.removeItem("access_token");
      logout();
      OpenAPI.TOKEN = undefined;
      // window.location.href = "/login";
      navigate(ROUTES.LOGIN);
    },
  });
};

// -------------------- GET ME --------------------
export const useGetMe = () => {
  const {accessToken}=useAuth();
  return useQuery({
    queryKey: ["me"],
    queryFn: () => AuthService.authControllerGetMe(),
    staleTime: 5 * 60 * 1000,
    enabled: !!accessToken, // only fetch if token exists
  });
};