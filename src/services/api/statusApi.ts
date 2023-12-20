import { AxiosResponse } from "axios";
import axiosInstance from ".";
import { ResStatus } from "@/types/statusesInterface";

export const showStatus = (): Promise<AxiosResponse<ResStatus>> => {
  return axiosInstance.get("statuses?populate=*");
};
