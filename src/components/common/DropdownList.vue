<template lang="pug">
.checkbox-block(v-if="type === 'checkbox'")
  p {{ title }}
  div
    button(@click.prevent="selectAll") Select All
    button(@click.prevent="clearAll") Clear
ul(v-if="data.length", :class="({ checkbox: type === 'checkbox' }, type)")
  li(v-for="(item, index) in data", :key="index", @click="selectItem(item)")
    .image-item(v-if="type === 'lead'")
      img.logo(v-if="item.logo", :src="JSON.parse(item.logo.name)", alt="name")
      .grey-block(v-else)
    button.checkbox(
      v-if="type === 'checkbox'",
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
  title: { type: String },
});
const emit = defineEmits(["selectedItem"]);
const selectedItems = ref<string[]>([]);
const isActive = ref(false);

const selectItem = (item: { name: string; id: number }) => {
  selectedItems.value.push(item);
  emit("selectedItem", item);
};

const selectAll = () => {
  isActive.value = true;
  selectedItems.value.push(props.data);
  emit("selectedItem", props.data);
};

const clearAll = () => {
  isActive.value = false;
};
</script>

<style lang="scss" scoped>
.checkbox-block {
  height: 44px;
  width: 100%;
  position: absolute;
  top: 44px;
  background: var(--white);
  border-style: solid;
  border-width: 0 1px 1px 1px;
  border-color: var(--primary);
  padding: 0 16px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @include media_mobile {
    top: 32px;
    width: 343px;
  }
  p {
    @include font(14px, 400, 20px, var(--text));
    text-wrap: nowrap;
  }
  button {
    background: transparent;
    border: none;
    @include font(12px, 16px, 600, var(--blue));
    text-decoration: underline;
  }
}
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
  max-height: 200px;
  overflow-x: scroll;

  @include media_mobile {
    top: 32px;
  }

  &.not-founds {
    width: calc(100% - 2px);
    i.user {
      left: 16px;
    }
  }

  &.tags {
    width: 218px;
    top: 60px;
    @include media_mobile {
      width: calc(100% - 2px);
      top: 48px;
    }
  }

  &.members {
    width: 238px;
    top: 44px;
    @include media_mobile {
      width: calc(100% - 2px);
      top: 32px;
    }
  }

  &.checkbox {
    top: 88px;
    width: calc(100% - 2px);
    @include media_mobile {
      top: 76px;
      width: 341px;
    }
  }
  &.lead-block {
    width: 238px;
    @include media_mobile {
      width: 343px;
    }
  }

  &.lead {
    width: 238px;
    @include media_mobile {
      width: calc(100% - 2px);
    }
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
      &:active {
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
        left: 20px;
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
