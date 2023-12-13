import { AxiosResponse } from "axios";
import axiosInstance from ".";
import { ResTags } from "@/types/tagsApi";

export const showTags = (): Promise<AxiosResponse<ResTags>> => {
  return axiosInstance.get("tag?populate=*");
};
