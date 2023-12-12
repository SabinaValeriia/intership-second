import { ref } from "vue";

export const page = ref(1);
export const itemsPerPage = ref(9);
export const startIndex = ref();
export const endIndex = ref();
startIndex.value = (page.value - 1) * itemsPerPage.value;
endIndex.value = startIndex.value + itemsPerPage.value - 1;
