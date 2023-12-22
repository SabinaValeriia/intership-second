<template lang="pug">
.notification-block
  transition-group(name="block", tag="div")
    .notification(
      v-for="notification in notifications",
      :key="notification.key",
      :class="notification.type"
    )
      p {{ notification.text }}
      button.icon.close(@click="removeNotification(notification.key)")
</template>

<script setup lang="ts">
import { notifications, removeNotification } from "@/composables/notification";
</script>

<style lang="scss" scoped>
.block {
  &-enter {
    &-from {
      opacity: 0;
      transform: translateX(100px);
    }
    &-to {
      opacity: 1;
      transform: translateX(0);
    }
    &-active {
      transition: all 0.5s cubic-bezier(0.27, 1.85, 0.99, 0.65);
    }
  }
  &-leave {
    &-from {
      opacity: 1;
      transform: translateX(0);
    }
    &-to {
      opacity: 0;
      transform: translateX(100px);
    }
    &-active {
      transition: all 0.5s ease;
    }
  }
}
.notification {
  display: flex;
  justify-content: space-between;
  padding: 14px 12px;
  align-items: center;
  margin-bottom: 10px;
  height: 48px;
  min-width: 311px;
  border-radius: 12px;
  border-radius: 8px;
  border: 1px solid var(--notify_info);
  background: var(--notify_info_bg);
  pointer-events: auto;
  box-sizing: border-box;
  @include media_mobile {
    width: 100%;
  }
  &-block {
    position: fixed;
    top: 30px;
    right: 26px;
    z-index: 6;
    @include media_mobile {
      width: calc(100% - 32px);
      right: 16px;
      left: 16px;
      top: 12px;
    }
  }
  &.hide {
    display: none;
  }
  &.success {
    border: 1px solid var(--notify_success);
    background: var(--harp);
    p {
      color: var(--notify_success);
      &::before {
        background-image: url("@/assets/icons/success.svg");
      }
    }
    button.close {
      background-color: var(--notify_success);
      &::before {
        background-color: var(--notify_success);
      }
    }
  }
  &.failed {
    border: 1px solid var(--error);
    background: var(--provincial-pink);

    p {
      color: var(--error);
      &::before {
        background-image: url("@/assets/icons/error.svg");
      }
    }
    button {
      background-color: var(--error);
      &::before {
        background-color: var(--error);
      }
    }
  }
  &.warning {
    border: 1px solid var(--notify_warning);
    background: var(--bridesmaid);

    p {
      color: var(--notify_warning);
      &::before {
        background-image: url("@/assets/icons/warning.svg");
      }
    }
    button {
      background-color: var(--notify_warning);
      &::before {
        background-color: var(--notify_warning);
      }
    }
  }
  p {
    margin: 0 36px 0 0;
    @include font(14px, 500, 20px, var(--notify_info));
    display: flex;
    align-items: center;
    &::before {
      content: "";
      background-image: url("@/assets/icons/info.svg");
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
  }
  button {
    right: 13px;
    width: 12px;
    height: 12px;

    border: none;

    background-color: var(--notify_info);
    &::before {
      background-color: var(--notify_info);
    }
  }
}
</style>
