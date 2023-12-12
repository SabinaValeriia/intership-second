<template lang="pug">
.no-results
  img(:src="require(`@/assets/icons/${noData ? 'no-search' : 'no-data'}.svg`)")
  h2(v-if="noData") Wait!
  p {{ noData ? "You have no projects created, please create new one." : "No results found, try to reset filters" }}
  common-button.btn-secondary(@click="noData ? create() : reset()") {{ noData ? "Create" : "Reset" }}
</template>

<script setup lang="ts">
import { openModal } from "@/composables/modalActions";
import CommonButton from "./common/CommonButton.vue";
import { defineEmits, defineProps } from "vue";
import { EnumModalKeys } from "@/constants/EnumModalKeys";
const props = defineProps({
  noResults: {
    type: Boolean,
    default: false,
  },
  noData: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["reset"]);

const reset = () => {
  emit("reset");
};
const create = () => {
  openModal(EnumModalKeys.ModalCreate);
};
</script>
<style lang="scss" scoped>
.no-results {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  button {
    z-index: 5;
  }
  &.menu-no {
    border-bottom: 1px solid var(--primary);
    margin-bottom: 16px;
    img {
      width: 140px;
      height: 120px;
      margin-top: 27px;
      margin-bottom: 12px;
    }
    h2 {
      font-size: 20px;
      line-height: 28px;
    }
    p {
      font-size: 14px;
      line-height: 20px;
      width: 200px;
    }
    button {
      font-size: 14px;
      line-height: 20px;
      padding: 12px 16px;
      width: 77px;
      height: 44px;
      box-sizing: border-box;
      margin: 12px 0 35px 0;
    }
  }
  img {
    margin-top: 74px;
    margin-bottom: 24px;
  }
  h2 {
    @include font(24px, 500, 28px, var(--text));
    margin: 0;
    @include media_mobile {
      font-size: 14px;
      line-height: 20px;
    }
  }
  p {
    @include font(18px, 500, 26px, var(--text));
    margin: 0;
    text-align: center;
    text-wrap: wrap;
    @include media_mobile {
      font-size: 14px;
      line-height: 20px;
    }
  }
  button {
    margin-top: 16px;
    width: 100px;
    height: 52px;
    @include media_mobile {
      height: 44px;
      width: 71px;
    }
  }
}
</style>
