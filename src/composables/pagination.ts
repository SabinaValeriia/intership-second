import { ref } from "vue";

export const page = ref(1);
export const limit = ref(8);
export const startIndex = (page.value - 1) * limit.value;
export const endIndex = startIndex + limit.value;
