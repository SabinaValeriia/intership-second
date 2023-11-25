<template lang="pug">
.no-results(v-if="noData")
  img(:src="require(`@/assets/icons/no-search.svg`)")
  h2 Wait!
  p You have no projects created,
    br
    | please create new one.
  common-button.btn-secondary Create
.no-results(v-else-if="noResults")
  img(:src="require(`@/assets/icons/no-data.svg`)")
  p No results found, try to reset filters
  common-button.btn-secondary(@click="reset") Reset
</template>

<script setup lang="ts">
import CommonButton from "./common/CommonButton.vue";
import { defineEmits, defineProps } from "vue";
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
</script>
<style lang="scss" scoped>
.no-results {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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
