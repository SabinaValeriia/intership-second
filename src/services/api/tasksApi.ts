import { AxiosResponse } from "axios";
import axiosInstance from ".";
import { ResTasks } from "@/types/tasksApiInterface";

export const showTasks = (): Promise<AxiosResponse<ResTasks>> => {
  return axiosInstance.get("task?populate=*");
};
