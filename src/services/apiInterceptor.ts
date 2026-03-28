// services/ApiInterceptor.ts
import axios, { AxiosError } from "axios";
import { OpenAPI } from "./artist-services/core/OpenAPI";
import { AuthService } from "./artist-services/services/AuthService";

export const BASE_URL = "http://localhost:3000";

OpenAPI.BASE = BASE_URL;
OpenAPI.WITH_CREDENTIALS = true;
axios.defaults.withCredentials = true;

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = async (): Promise<string> => {
    if (isRefreshing && refreshPromise) return refreshPromise;

    isRefreshing = true;
    refreshPromise = AuthService.authControllerRefresh()
        .then((data) => {
            const newToken = data.access_token;
            // localStorage.setItem("access_token", newToken);
            OpenAPI.TOKEN = newToken;
            return newToken;
        })
        .catch((err) => {
            // localStorage.removeItem("access_token");
            OpenAPI.TOKEN = undefined;
            window.location.href = "/login";
            throw err;
        })
        .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
        });

    return refreshPromise;
};

// ✅ TOKEN as resolver — always reads latest token
OpenAPI.TOKEN = async () => {
    return localStorage.getItem("access_token") ?? "";
};

axios.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const original = error.config as any;

        if (
            error.response?.status === 401 &&
            !original._retry &&
            !original.url?.includes("/auth/refresh")
        ) {
            original._retry = true;
            try {
                const newToken = await refreshAccessToken();
                // ✅ Update default headers for all future requests
                axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
                original.headers["Authorization"] = `Bearer ${newToken}`;
                return axios(original);
            } catch {
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

// ✅ Restore token on page load
const savedToken = localStorage.getItem("access_token");
if (savedToken) {
    OpenAPI.TOKEN = savedToken;
    axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
}