import { AuthUserInterface, ResUser } from "@/types/userApiInterface";
import axiosInstance from "../api";
import { AxiosInstance, AxiosResponse } from "axios";

export const loginUser = (
  payload: AuthUserInterface
): Promise<AxiosResponse<ResUser>> => {
  return axiosInstance.post("auth/local", payload);
};
