import { AxiosResponse } from "axios";
import axiosInstance from ".";
import { ProjectInterface, ResProject } from "@/types/projectApiInterface";

export const projectPost = (
  payload: ProjectInterface
): Promise<AxiosResponse<ResProject>> => {
  return axiosInstance.post("projects?populate=*", payload);
};

export const showProjects = (): Promise<AxiosResponse<ResProject>> => {
  return axiosInstance.get("projects?populate=*");
};
