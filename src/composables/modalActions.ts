import { ref } from "vue";
import { ModalTypes } from "@/types/ModalTypes";

export const modalKeys = ref<ModalTypes>({});
export const currentKey = ref();

export const openModal = (key: string) => {
  currentKey.value = key;
  modalKeys.value[currentKey.value] = !modalKeys.value[currentKey.value];
};

export const isOpen = (key: string) => {
  return modalKeys.value[key];
};
