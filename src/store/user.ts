import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { UserInterface } from "@/types/UserInterface";
export const defaultUser = {
  id: 0,
  username: "",
  email: "",
};
export const useUserStore = defineStore(
  "user",
  () => {
    const data = ref({});
    const user = ref({ ...defaultUser } as UserInterface);
    const projectData = ref({});
    const accessToken = ref("");

    const isAuthorized = computed(() => !!user.value.id && !!accessToken.value);

    const login = (data: UserInterface) => {
      user.value = data;
    };

    const showProjectsData = (data: any) => {
      projectData.value = data;
      console.log(projectData);
    };

    const setTokens = (payload: { accessToken: string }) => {
      accessToken.value = payload.accessToken;
    };

    const clear = () => {
      data.value = {};
      user.value = { ...defaultUser };
      accessToken.value = "";
    };

    return {
      data,
      user,
      isAuthorized,
      accessToken,
      setTokens,
      login,
      clear,
      projectData,
      showProjectsData,
    };
  },
  {
    persist: true,
  }
);
