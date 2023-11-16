<template lang="pug">
teleport(to="body")
  .modal
    .modal--backdrop(@click="close", :class="{ hide: hide }")
    transition(name="block", appear)
      .modal--container(v-if="isOpen(currentKey)", :class="{ hide: hide }")
        .modal--wrapper
          .modal--close(@click="close") Close
          slot(name="content")
</template>

<script lang="ts" setup>
import { onBeforeUnmount, defineEmits, ref } from "vue";

import useDisableScroll from "@/features/useDisableScroll";
import { isOpen, currentKey, openModal } from "@/composables/modalActions";
const hide = ref(false);
const close = () => {
  hide.value = true;
  if (isOpen(currentKey.value)) {
    setTimeout(() => {
      openModal(currentKey.value);
      emit("onClose");
    }, 200);
  }
};
const emit = defineEmits(["onClose"]);

const keyPress = (event: KeyboardEvent) => {
  if (event && event.code === "Escape") {
    close();
  }
};
useDisableScroll();
document.addEventListener("keydown", keyPress);

onBeforeUnmount(() => {
  document.removeEventListener("keydown", keyPress);
});
</script>

<style lang="scss" scoped>
.modal {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;

  &--backdrop {
    width: 100%;
    height: 100%;
    position: absolute;
    background: rgba(15, 14, 30, 0.8);
    top: 0;
    left: 0;
  }

  &--container {
    position: fixed;
    bottom: 0;
    height: calc(100% - 40px);
    overflow: initial;
    z-index: 11;

    width: 100%;

    border-radius: 25px 25px 0 0;
    background-color: var(--accent_hover);
  }

  &--wrapper {
    display: flex;
    flex-direction: column;

    background-color: inherit;
    border-radius: 25px;

    .modal {
      &-body {
        flex: 1;
      }

      &-footer {
        display: flex;
        justify-content: flex-end;

        gap: 12px;
        min-height: 52px;
      }
    }
  }

  &--close {
    position: absolute;
    top: 20px;
    right: 22px;
    z-index: 9;
    cursor: pointer;
    display: block;
    @include font(14px, 500, 20px, var(--background));

    .icon {
      &-close {
        mask-size: contain;
        mask-image: url("@/assets/icons/close.svg");
        -webkit-mask-size: contain;
      }
    }
  }
  .block {
    &-enter {
      &-from {
        opacity: 0;
        transform: translateY(100px);
      }
      &-to {
        opacity: 1;
        transform: translateY(0);
      }
      &-active {
        transition: all 0.5s cubic-bezier(0.27, 1.85, 0.99, 0.65);
      }
    }
    &-leave {
      &-from {
        opacity: 1;
        transform: translateY(0);
      }
      &-to {
        opacity: 0;
        transform: translateY(100px);
      }
      &-active {
        transition: all 0.5s ease;
      }
    }
  }
  .hide {
    transform: translateY(100%);
    transition: all 0.5s ease;
  }
}
</style>
