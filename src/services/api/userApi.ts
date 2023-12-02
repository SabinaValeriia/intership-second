import { AuthUserInterface, ResUser } from "@/types/userApiInterface";
import { AxiosResponse } from "axios";
import axiosInstance from ".";

export const loginUser = (
  payload: AuthUserInterface
): Promise<AxiosResponse<ResUser>> => {
  return axiosInstance.post("auth/local", payload);
};

export const showUsers = (
  queryParam: string
): Promise<AxiosResponse<ResUser>> => {
  const url = `users?populate=*&${queryParam}`;
  return axiosInstance.get(url);
};

export const showMe = (): Promise<AxiosResponse<ResUser>> => {
  return axiosInstance.get("users/me");
};
