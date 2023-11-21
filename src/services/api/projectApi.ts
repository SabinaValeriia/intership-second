import { AuthUserInterface, ResUser } from "@/types/userApiInterface";
import { AxiosResponse } from "axios";
import axiosInstance from ".";

export const projectPost = (
  payload: any,
  headers?: any
): Promise<AxiosResponse<any>> => {
  return axiosInstance.post("projects?populate=*", payload, headers);
};

export const showProjects = (): Promise<AxiosResponse> => {
  return axiosInstance.get("projects?populate=*");
};
