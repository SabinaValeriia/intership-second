import { AuthUserInterface, ResUser } from "@/types/userApiInterface";
import { AxiosResponse } from "axios";
import axiosInstance from ".";

export const loginUser = (
  payload: AuthUserInterface
): Promise<AxiosResponse<ResUser>> => {
  return axiosInstance.post("auth/local", payload);
};

export const showUsers = (): Promise<AxiosResponse> => {
  return axiosInstance.get("users?populate=*");
};
