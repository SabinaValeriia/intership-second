<template lang="pug">
teleport(to="body")
  .modal(:class="{ create }")
    .modal--backdrop(@click="close", :class="{ backdrop: hide }")
    transition(name="block", appear)
      .modal--container.create(v-if="isOpen(currentKey)", :class="{ hide }")
        .modal--wrapper
          .modal--close(v-if="!create", @click="close") Close
          .modal--close(v-else, @click="close") 
            i.icon.close.mobile
          slot(name="content")
</template>

<script lang="ts" setup>
import { onBeforeUnmount, defineEmits, ref } from "vue";

import useDisableScroll from "@/features/useDisableScroll";
import { isOpen, currentKey, openModal } from "@/composables/modalActions";
const props = defineProps({
  create: {
    type: Boolean,
    required: false,
  },
});
const emit = defineEmits(["onClose", "closeDropdown"]);
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

const keyPress = (event: KeyboardEvent) => {
  if (event && event.code === "Escape") {
    close();
  }
};

const closeDropdown = () => {
  emit("closeDropdown");
};
useDisableScroll();
document.addEventListener("keydown", keyPress);

onBeforeUnmount(() => {
  document.removeEventListener("keydown", keyPress);
});
</script>

<style lang="scss">
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
  &.create {
    .modal--container {
      position: relative;
      height: auto;
      overflow: initial;
      padding: 24px;
      z-index: 11;

      width: 100%;
      max-width: 660px;
      box-sizing: border-box;
      border-radius: 16px;
      background-color: #ffffff;
      @include media_mobile {
        height: calc(100% - 40px);
        margin-top: 40px;
        border-radius: 25px 25px 0 0;
        padding: 12px;
        overflow: auto;
      }
    }
    .modal-footer {
      &.header {
        width: 100%;
        justify-content: flex-start;
      }
      &.create {
        display: flex;
        justify-content: flex-end;
        margin-top: 32px;
        button {
          width: 100px;
          z-index: 2;
          @include media_mobile {
            width: fit-content;
          }
          &.cancel {
            @include media_mobile {
              position: absolute;
              top: 14px;
              left: 22px;
              color: var(--notify_info);
              padding: 0;
              border: none;
            }
          }
          &.save {
            @include media_mobile {
              position: absolute;
              top: 14px;
              right: 22px;
              color: var(--text);
              padding: 0;
              background: none;
            }
          }
        }
      }
    }
  }

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

    .icon.close {
      width: 18px;
      height: 18px;
      top: -3px;
      right: -5px;
      @include media_mobile {
        &.mobile {
          display: none;
        }
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
  .backdrop {
    opacity: 0;
    transition: all 0.5s ease;
  }
}
.backdrop {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
