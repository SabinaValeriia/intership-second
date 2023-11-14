import axios, { AxiosRequestConfig } from "axios";
function getJwtToken(): any {
  const jwt = localStorage.getItem("isAuthenticated");
  if (jwt) {
    return jwt;
  } else {
    return "";
  }
}
const axiosInstance = axios.create({
  baseURL: "http://localhost:1337/api",
  timeout: 1000,
});

export const get = (resource: any, config?: AxiosRequestConfig) => {
  return axiosInstance.get(resource, config);
};
export const post = (
  resource: any,
  data?: any,
  config?: AxiosRequestConfig
) => {
  return axiosInstance.post(resource, data, config);
};

export const put = (resource: any, data: any, config?: AxiosRequestConfig) => {
  return axiosInstance.put(resource, data, config);
};

export const deleted = (resource: any, config?: AxiosRequestConfig) => {
  return axiosInstance.delete(resource, config);
};

export default axiosInstance;
