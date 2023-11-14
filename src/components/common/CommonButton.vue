<template lang="pug">
button(:class="{ disabled: isDisabled }")
  slot
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  isDisabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped lang="scss">
button {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
  text-transform: none;
  text-decoration: none;
  white-space: nowrap;

  -webkit-user-select: none !important; /* Safari */
  -ms-user-select: none !important; /* IE 10 and IE 11 */
  user-select: none !important; /* Standard syntax */

  transition: transform 0.4s ease;
  width: 100%;
  padding: 14px 24px;
  border-radius: 4px;
  @include font(16px, 500, 24px, var(--white));
  @include media_mobile {
    padding: 12px 16px;
    font-size: 14px;
    line-height: 20px;
  }

  &.btn_primary {
    background: var(--primary);
    border: none;
    &:hover {
      background: var(--primary_hover);
    }
    &.desabled {
      background: var(--primary_disable);
    }
  }
}
</style>
