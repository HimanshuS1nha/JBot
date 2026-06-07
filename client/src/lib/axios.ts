import axiosLib from "axios";

import { useAuthToken } from "@/hooks/use-auth-token";

export const axios = axiosLib.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axios.interceptors.request.use((config) => {
  if (!config.url?.includes("/auth/login")) {
    const token = useAuthToken.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});