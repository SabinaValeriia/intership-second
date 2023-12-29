import { AxiosResponse } from "axios";
import axiosInstance from ".";
import { ResType } from "@/types/typeInterface";

export const showTypes = (): Promise<AxiosResponse<ResType>> => {
  return axiosInstance.get("types?populate=*");
};
