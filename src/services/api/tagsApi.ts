import { AxiosResponse } from "axios";
import axiosInstance from ".";

export const showTags = (): Promise<AxiosResponse> => {
  return axiosInstance.get("tag?populate=*");
};
