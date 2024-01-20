<template lang="pug">
header-component(@newProject="newProject", @newTask="newTask")
router-view(:new-project-show="newProjectShow", :new-task-show="newTaskShow")
footer-component.footer
</template>

<script lang="ts" setup>
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import { provide, ref } from "vue";

const newProjectShow = ref(false);
const newTaskShow = ref(false);
const newProject = () => {
  newProjectShow.value = true;
};

const newTask = () => {
  newTaskShow.value = true;
};

provide("newTaskShow", newTaskShow);
</script>

<style lang="scss" scoped>
.footer {
  display: none;
  @include media_mobile {
    display: flex;
    z-index: 3;
  }
}
</style>
