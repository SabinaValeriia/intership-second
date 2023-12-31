import { AxiosResponse } from "axios";
import axiosInstance from ".";
import { ResTasks } from "@/types/tasksApiInterface";

export const showTasks = (
  queryParam: string
): Promise<AxiosResponse<ResTasks>> => {
  const url = `task?populate=*&${queryParam}`;
  return axiosInstance.get(url);
};

export const updateTask = (
  taskId: string,
  data: any
): Promise<AxiosResponse<any>> => {
  const url = `/task/${taskId}?populate=*&`;
  return axiosInstance.put(url, data);
};
