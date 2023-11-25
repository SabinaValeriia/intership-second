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
ul(v-else, :className="{ list: className }")
  .clear-block(v-if="clear")
    p Project tags
    .button-block
      button(@click.prevent="selectAll") Select All
      button(@click.prevent="clearAll") Clear
  li(
    v-for="(item, index) in filteredItems",
    :key="index",
    @click="selectItem(item)"
  )
    button.checkbox(
      @click.prevent="toggleSelect(item)",
      :class="{ active: isActive }"
    )
      i.check.icon
    p {{ item.tag }}
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineEmits, isReactive } from "vue";

const props = defineProps(["data", "tags", "clear", "className"]);
const emit = defineEmits(["selectedItem"]);

const searchText = ref("");
const selectedItems = ref<string[]>([]);
const isActive = ref(false);

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
  width: 238px;

  &.list {
    width: 238px;
  }

  .clear-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    border-bottom: 1px solid var(--primary);
    p {
      text-wrap: nowrap;
      @include font(14px, 400, 20px, var(--text));
    }
    .button-block {
      display: flex;
      gap: 8px;
      button {
        @include font(12px, 600, 16px, var(--blue));
        background: none;
        border: none;
        padding: 0;
      }
    }
  }
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
    &:hover {
      background: var(--background_hover);
      .checkbox {
        border-color: var(--accent);
      }
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
