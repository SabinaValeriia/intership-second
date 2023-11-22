<template lang="pug">
ul(v-if="!tags")
  li(
    v-for="(item, index) in filteredItems",
    :key="index",
    @click="selectItem(item)"
  ) 
    img.logo(
      v-if="item.logo !== null || item.logo",
      :src="JSON.parse(item.logo.name)",
      alt="name"
    )
    .grey-block(v-else)
    p {{ item.leadName }}
ul(v-else)
  li(
    v-for="(item, index) in filteredItems",
    :key="index",
    @click="selectItem(item)"
  )
    p {{ item.tag }}
</template>

<script setup lang="ts">
import { computed, defineProps, ref, onMounted } from "vue";

const props = defineProps({
  data: { type: Array },
  tags: { type: Boolean, default: false },
});

const emit = defineEmits(["selectedItem"]);

const searchText = ref("");
const selectedItems = ref<string[]>([]);
const filteredItems = computed(() => {
  if (!searchText.value.trim()) {
    return props.data.filter(
      (item) =>
        !selectedItems.value.some((selectedItem) => selectedItem.id === item.id)
    );
  }

  const searchTerm = searchText.value.trim().toLowerCase();
  return props.data.filter((item) => {
    const searchItem = item.leadName.toLowerCase();
    return (
      searchItem.includes(searchTerm) &&
      !selectedItems.value.some((selectedItem) => selectedItem.id === item.id)
    );
  });
});

const selectItem = (item) => {
  selectedItems.value.push(item);
  emit("selectedItem", item);
};
</script>

<style lang="scss" scoped>
ul {
  border-style: solid;
  border-width: 0 1px 1px 1px;
  border-color: var(--primary);
  border-radius: 0 0 4px 4px;
  background: var(--white);
  position: absolute;
  top: 44px;
  padding: 0;
  margin: 0;
  width: calc(100% - 2px);
  &.tag {
    z-index: 1;
    input {
      width: 220px;
    }
  }
  &.lead {
    input {
      width: 240px;
      @include media_mobile {
        width: 100%;
      }
    }
  }
  li {
    cursor: pointer;
    list-style: none;
    padding: 12px 16px;
    border-bottom: 1px solid var(--gallery);
    @include font(16px, 400, 24px, var(--text));
    display: flex;
    align-items: center;
    &:last-of-type {
      border: none;
    }
    img.logo {
      width: 20px;
      height: 20px;
      border-radius: 10px;
      margin-right: 8px;
      position: relative;
      top: 0;
      left: 0;
    }
    p {
      margin: 0;
      padding: 0;
    }
    .grey-block {
      width: 20px;
      height: 20px;
      border-radius: 10px;
      margin-right: 8px;
      background: var(--placeholder);
    }
  }
}
</style>
