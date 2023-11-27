<template lang="pug">
ul(v-if="data.length")
  li(v-for="(item, index) in data", :key="index", @click="selectItem(item)")
    .image-item(v-if="type === 'lead'")
      img.logo(
        v-if="item.logo !== null || item.logo",
        :src="JSON.parse(item.logo.name)",
        alt="name"
      )
      .grey-block(v-else)
    button.checkbox(
      v-else-if="type === 'checkbox'",
      @click.prevent="toggleSelect(item)",
      :class="{ active: isActive }"
    )
      i.check.icon
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
const isActive = ref(true);

const selectItem = (item: { name: string; id: number }) => {
  selectedItems.value.push(item);
  emit("selectedItem", item);
};

const selectAll = () => {
  isActive.value = true;
};

const clearAll = () => {
  isActive.value = false;
};

const toggleSelect = (item) => {
  if (selectedItems.value.includes(item)) {
    selectedItems.value = selectedItems.value.filter(
      (selectedItem) => selectedItem !== item
    );
  } else {
    selectedItems.value = [...selectedItems.value, item];
  }
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

  @include media_mobile {
    top: 32px;
  }

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
    .image-item {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
    .checkbox {
      width: 16px;
      height: 16px;
      border: 2px solid var(--primary);
      border-radius: 6px;
      margin-right: 12px;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      &.active {
        background: var(--accent);
        border: none;
        i.icon.check {
          display: block;
          &::before {
            background: var(--white);
          }
        }
      }
      i.icon.check {
        display: none;
        width: 8px;
        height: 8px;
        &::before {
          background: var(--white);
        }
      }
    }
    &:hover {
      background: var(--background_hover);
      .checkbox {
        border-color: var(--accent);
      }
    }
    @include media_mobile {
      font-size: 12px;
      line-height: 16px;
      padding: 12px;
      height: 40px;
      box-sizing: border-box;
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
