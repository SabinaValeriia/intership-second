import { showTags } from "@/services/api/tagsApi";
import { ResTags } from "@/types/tagsApi";
import { ref } from "vue";

export const tagNames = ref([]);
export const deleteTag = (tag: number) => {
  tagNames.value.splice(tag, 1);
};

export const showTag = () => {
  showTags().then(({ data }) => {
    tagNames.value = data.data.map(
      (item: { [x: string]: any; tag: string; id: number }) => ({
        tag: item.attributes.name,
        id: item.id,
      })
    );
  });
};
