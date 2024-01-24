import { AxiosResponse } from "axios";
import axiosInstance from ".";
import {
  ProjectInterface,
  ProjectInterfaceItem,
  ResProject,
} from "@/types/projectApiInterface";

export const projectPost = (
  payload: ProjectInterface
): Promise<AxiosResponse<ResProject>> => {
  return axiosInstance.post("projects?populate=*", payload);
};

export const showProjects = (
  queryParam: string
): Promise<AxiosResponse<ResProject>> => {
  const url = `projects?populate=*&${queryParam}`;
  return axiosInstance.get(url);
};

export const showProjectById = (
  id: number
): Promise<AxiosResponse<ResProject>> => {
  const url = `projects/${id}`;
  return axiosInstance.get(url);
};

export const updateProject = (
  projectId: string,
  data: ProjectInterfaceItem
): Promise<AxiosResponse<any>> => {
  const url = `/projects/${projectId}?populate=*&`;
  return axiosInstance.put(url, data);
};

export const deleteProject = (
  projectId: string
): Promise<AxiosResponse<any>> => {
  const url = `/projects/${projectId}?populate=*&`;
  return axiosInstance.delete(url);
};
