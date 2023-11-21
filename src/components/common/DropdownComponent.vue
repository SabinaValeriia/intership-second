<template lang="pug">
.drop-down(:class="{ disdefault: disableDefault }", ref="dropdown")
  .drop-down--section
    form(action="")
      .form-group
        input(v-model="searchText", placeholder="Placeholder")
        i.icon.search
    ul(v-if="iconHere")
      li(
        v-for="(item, index) in filteredItems",
        :key="index",
        @click="selectItem(item)"
      ) 
        img(
          v-if="item.logo !== null || item.logo",
          :src="JSON.parse(item.logo.name)",
          :alt="logo_name"
        )
        .grey-circle(v-else)
        p {{ item.leadName }}
    ul(v-else) 
      li(
        v-for="(item, index) in filteredItems",
        :key="index",
        @click="selectItem(item)"
      ) {{ item.tag }}
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, nextTick, computed } from "vue";

const props = defineProps({
  data: { type: Array },
  blockMenu: { type: Boolean, default: false },
  iconHere: { type: Boolean, default: false },
  disableDefault: { type: Boolean, default: false },
});

const emit = defineEmits(["selectedItem"]);

const dropdown = ref();
const searchText = ref("");
const selectedItems = ref<string[]>([]);

const filteredItems = computed(() => {
  if (!searchText.value.trim()) {
    return props.data;
  }

  const searchTerm = searchText.value.trim().toLowerCase();
  return props.data.filter((item) => {
    const searchItem = item.toLowerCase();
    return searchItem.includes(searchTerm);
  });
});

const selectItem = (item: string) => {
  if (!selectedItems.value.includes(item)) {
    selectedItems.value.push(item);
    emit("selectedItem", item);
  }
};
</script>

<style lang="scss" scoped>
.drop-down {
  width: 100%;
  border-radius: 8px;
  background: white;
  color: var(--black);
  border: 1px solid var(--grey-line);
  z-index: 1;
  &.error {
    border: 1px solid var(--red);
  }
  &.tag {
    z-index: 1;
    input {
      width: 220px;
    }
    ul {
      width: 218px;
    }
  }
  &.lead {
    input {
      width: 240px;
      @include media_mobile {
        width: 100%;
      }
    }
    ul {
      width: 238px;
      @include media_mobile {
        width: calc(100% - 2px);
      }
    }
  }
  &--section {
    position: relative;
    width: 100%;
    height: 100%;
    i.search {
      top: 21px;
      left: 16px;
    }
    input {
      padding: 14px 16px 14px 48px;
      height: 52px;
      position: absolute;
      top: 8px;
      border-radius: 4px 4px 0 0;
    }
    ul {
      border-style: solid;
      border-width: 0 1px 1px 1px;
      border-color: var(--primary);
      border-radius: 0 0 4px 4px;
      background: var(--white);
      position: absolute;
      top: 60px;
      padding: 0;
      margin: 0;
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
        img {
          width: 20px;
          height: 20px;
          border-radius: 10px;
          margin-right: 8px;
        }
        p {
          margin: 0;
          padding: 0;
        }
        .grey-circle {
          width: 20px;
          height: 20px;
          border-radius: 10px;
          margin-right: 8px;
          background: var(--placeholder);
        }
      }
    }
  }
}
</style>
