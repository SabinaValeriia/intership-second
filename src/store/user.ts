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
    const project = ref();
    const accessToken = ref("");

    const isAuthorized = computed(() => !!user.value.id && !!accessToken.value);

    const login = (data: UserInterface) => {
      user.value = data;
    };
    const projectsShow = (data: any) => {
      project.value = data;
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
      projectsShow,
      clear,
    };
  },
  {
    persist: true,
  }
);
