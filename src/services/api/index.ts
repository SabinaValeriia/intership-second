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

export const get = <T>(
  resource: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return axiosInstance.get<T>(resource, config);
};
export const post = <T>(
  resource: string,
  data?: T,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return axiosInstance.post<T>(resource, data, config);
};

export const put = <T>(
  resource: string,
  data: T,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return axiosInstance.put<T>(resource, data, config);
};

export const deleted = <T>(
  resource: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return axiosInstance.delete<T>(resource, config);
};

export default axiosInstance;
