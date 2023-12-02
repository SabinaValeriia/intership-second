import { AxiosResponse } from "axios";
import axiosInstance from ".";
import { ResTags } from "@/types/tagsApi";

export const showDepartments = (): Promise<AxiosResponse<ResTags>> => {
  return axiosInstance.get("departments?populate=*");
};
