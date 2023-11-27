<template lang="pug">
ul(v-if="data.length")
  li(v-for="(item, index) in data", :key="index", @click="selectItem(item)")
    div(v-if="type === 'lead'")
      img.logo(
        v-if="item.logo !== null || item.logo",
        :src="JSON.parse(item.logo.name)",
        alt="name"
      )
      .grey-block(v-else)
    p {{ item.name }}
ul.not-founds(v-else)
  li 
    i.icon.user
    p Not results
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";

const props = defineProps({
  data: { type: Array },
  type: { type: String },
});
const emit = defineEmits(["selectedItem"]);
const selectedItems = ref<string[]>([]);

const selectItem = (item: { name: string; id: number }) => {
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
  max-height: 200px;
  overflow-x: scroll;

  &.not-founds {
    height: fit-content;
    p {
      margin-left: 30px;
    }
  }
  &.tag {
    z-index: 1;
    input {
      width: 220px;
      @include media_mobile {
        width: 100%;
      }
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
    @include media_mobile {
      font-size: 12px;
      line-height: 16px;
      padding: 12px 12px;
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
