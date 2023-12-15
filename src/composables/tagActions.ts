import { showTags } from "@/services/api/tagsApi";
import { ResTags } from "@/types/tagsApi";
import { ref } from "vue";
export const tagData = ref([]);
export const tagNames = ref([]);
export const deleteTag = (tag: number) => {
  tagNames.value.splice(tag, 1);
};

export const showTag = () => {
  showTags().then(({ data }) => {
    const newData = data.data.map(
      (item: { [x: string]: any; name: string; id: number }) => ({
        name: item.attributes.name,
        id: item.id,
      })
    );
    tagData.value = [...newData];
    tagNames.value = [...newData];
  });
};
