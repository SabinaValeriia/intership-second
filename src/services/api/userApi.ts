import { AuthUserInterface, ResUser } from "@/types/userApiInterface";
import axiosInstance from "../api";

export const loginUser = (userData: AuthUserInterface) => {
  return axiosInstance.post<ResUser>("auth/local", userData);
};
