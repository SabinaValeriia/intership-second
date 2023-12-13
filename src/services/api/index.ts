import { useUserStore } from "@/store/user";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
export const getJwtToken = () => {
  const userStore = useUserStore();
  const jwt = userStore.accessToken;
  return jwt || "";
};

const axiosInstance = axios.create({
  baseURL: "http://localhost:1337/api",
  timeout: 1000,
  headers: {
    Authorization: `Bearer ${getJwtToken()}`,
  },
});

export default axiosInstance;
