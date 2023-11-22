<template lang="pug">
.drop-down(:class="{ disdefault: disableDefault }")
  .drop-down--section
    form
      .form-group
        input(v-model="searchText", placeholder="Placeholder")
        i.icon.search
    dropdown-list(:data="data", @selectedItem="onSelectedItem", :tags="tags")
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import DropdownList from "@/components/common/DropdownList.vue";
import { selectedItemInterface } from "@/types/selectedItemInterface";
const props = defineProps({
  data: { type: Array },
  disableDefault: { type: Boolean, default: false },
  tags: { type: Boolean, default: false },
});
const emit = defineEmits(["selectedItem"]);

const onSelectedItem = (selectedItem: selectedItemInterface) => {
  emit("selectedItem", selectedItem);
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
  position: relative;
  &.tag {
    input {
      width: 220px;
      top: 8px;
    }
    ul {
      width: 218px;
      top: 60px;
    }
    i.search {
      top: 23px;
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
        width: 100%;
      }
    }
  }
  &.error {
    border: 1px solid var(--red);
  }
  &--section {
    position: relative;
    width: 100%;
    height: 100%;
    i.search {
      top: 7px;
      left: 16px;
    }
    input {
      padding: 14px 16px 14px 48px;
      height: 52px;
      position: absolute;
      top: -8px;
      border-radius: 4px 4px 0 0;
    }
  }
}
</style>