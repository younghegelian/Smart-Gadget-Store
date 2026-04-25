import axios from "axios";
import { BASE_API } from "./api";

const axiosInstance = axios.create({
  baseURL: BASE_API,
  headers: {
    "Content-Type": "application/json",
  },
});

// OPTIONAL — request/response interceptors
axiosInstance.interceptors.request.use(
  (config) => {
    // 🔹 future token auth yahi add hoga 
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data || error.message;
    const reqBody = error.config?.data;
    console.error("API Error:", status, data, reqBody ? `request:${reqBody}` : "");
    return Promise.reject(error);
  }
);

export default axiosInstance;
