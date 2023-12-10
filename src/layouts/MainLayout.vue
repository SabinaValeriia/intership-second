<template lang="pug">
header-component(@newProject="newProject")
router-view(:newProjectShow="newProjectShow")
footer-component.footer
</template>

<script lang="ts" setup>
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import { ref } from "vue";
const newProjectShow = ref(false);
const newProject = () => {
  newProjectShow.value = true;
};
</script>

<style lang="scss" scoped>
.footer {
  display: none;
  @include media_mobile {
    display: flex;
  }
}
</style>
