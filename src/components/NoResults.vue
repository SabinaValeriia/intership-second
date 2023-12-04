<template lang="pug">
.no-results
  img.img(
    :src="require(`@/assets/icons/${noData ? 'no-search' : 'no-data'}.svg`)"
  )
  div
    h2 {{ title }}
    p {{ desc }}
  common-button.btn-secondary(
    v-if="isButton",
    @click="noData ? create() : reset()"
  ) {{ noData ? "Create" : "Reset" }}
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
  desc: {
    type: String,
  },
  title: {
    type: String,
  },
  isButton: {
    type: Boolean,
    default: true,
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
  &.no-results {
    flex-direction: row;
    justify-content: flex-start;
    margin-left: 65px;
    @include media_tablet {
      margin-left: 0;
    }
    @include media_mobile {
      flex-direction: column;
      padding: 16px 26px;
      border: 1px solid var(--primary);
      border-radius: 4px;
    }

    .img {
      width: 140px;
      height: 120px;
      margin: 0 36px 0 0;
      @include media_mobile {
        width: 98px;
        height: 84px;
        margin: 0;
      }
    }
    p {
      @include font(12px, 400, 16px, var(--text));
      width: 191px;
      text-align: left;
      @include media_mobile {
        width: 100%;
        font-size: 11px;
        line-height: 14px;
        text-align: center;
      }
    }
    h2 {
      @include font(16px, 500, 20px, var(--text));
      margin: 0 0 6px 0;
      @include media_mobile {
        font-size: 14px;
        margin: 10px 0 6px;
        text-align: center;
      }
    }
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
  }
}
</style>
