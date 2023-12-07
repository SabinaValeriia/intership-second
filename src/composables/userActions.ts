import { showUsers } from "@/services/api/userApi";
import { ref } from "vue";
export const leadNames = ref([]);
export const showDataUser = () => {
  showUsers().then(({ data }) => {
    leadNames.value = data.map((item: userDataInterface) => ({
      name: item.username,
      logo: item.logo,
      id: item.id,
    }));
  });
};

export interface userDataInterface {
  [x: string]: any;
  name: string;
  logo: {
    name: string;
  };
  id: number;
}
