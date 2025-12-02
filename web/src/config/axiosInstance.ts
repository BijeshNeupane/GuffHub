import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});

axiosInstance.interceptors.request.use((config: any) => {
  // Read from localStorage
  const userId = localStorage.getItem("userId")?.replace(/"/g, "");

  if (userId) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${userId}`,
    };
  }

  return config;
});

export default axiosInstance;
