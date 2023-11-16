import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
const getJwtToken = () => {
  const jwt = localStorage.getItem("isAuthenticated");
  if (jwt) {
    return jwt;
  } else {
    return "";
  }
};
const axiosInstance = axios.create({
  baseURL: "http://localhost:1337/api",
  timeout: 1000,
});

export default axiosInstance;
