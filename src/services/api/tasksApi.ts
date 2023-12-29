import { AxiosResponse } from "axios";
import axiosInstance from ".";
import { ResTasks } from "@/types/tasksApiInterface";

export const showTasks = (
  queryParam: string
): Promise<AxiosResponse<ResTasks>> => {
  const url = `task?populate=*&${queryParam}`;
  return axiosInstance.get(url);
};
