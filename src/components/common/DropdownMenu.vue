<template lang="pug">
.menu(v-if="isOpen")
  h2 {{ title }}
  div(v-if="project")
    .menu-project(
      v-for="(project, index) in projects.slice(0, 2)",
      :key="index"
    ) 
      img.logo(
        v-if="project.logo !== null || project.logo",
        :src="JSON.parse(project.logo.name)",
        alt="name"
      )
      div
        h3 {{ project.title }} ({{ project.key }})
        p(v-for="(item, index) in tagNames", :key="index") {{ index === 0 ? item.tag : "" }}
    h2 {{ subtitle }}
    .menu-project(
      v-for="(project, index) in projects.slice(0, 2)",
      :key="index"
    ) 
      img.logo(
        v-if="project.logo !== null || project.logo",
        :src="JSON.parse(project.logo.name)",
        alt="name"
      )
      div
        h3 {{ project.title }} ({{ project.key }})
        p(v-for="(item, index) in tagNames", :key="index") {{ index === 0 ? item.tag : "" }}
    router-link(to="/projects") View all projects
</template>

<script setup lang="ts">
import { showTag, tagNames } from "@/composables/tagActions";
import { showProjects } from "@/services/api/projectApi";
import { onMounted, ref } from "vue";

const props = defineProps({
  type: { type: String },
  withIcon: { type: Boolean, default: false },
  isOpen: Boolean,
  title: String,
  subtitle: String,
  project: Boolean,
});
const projects = ref([]);
onMounted(() => {
  showProjects().then(({ data }) => {
    projects.value = data.data.map((project: any) => project.attributes);
  });
  showTag();
});
</script>

<style lang="scss" scoped>
.menu {
  position: absolute;
  top: 55px;
  padding: 16px 0;
  background: var(--white);
  border-radius: 6px;
  box-sizing: border-box;
  min-width: 351px;
  z-index: 1;
  //   display: none;

  a {
    @include font(16px, 500, 24px, var(--text));
    text-decoration: none;
    margin: 16px;
  }

  &-project {
    display: flex;
    padding: 10px 16px;
    cursor: pointer;
    position: relative;
    &:last-of-type {
      border-bottom: 1px solid var(--primary);
      margin-bottom: 16px;
    }
    &:hover {
      background: var(--white-shadow);
      &::after {
        content: "";
        display: block;
        background: url("@/assets/icons/unchecked_star.svg");
        background-size: contain;
        height: 20px;
        width: 20px;
        position: absolute;
        right: 26px;
        top: 20px;
      }
    }
    :active {
      &::after {
        content: "";
        display: block;
        background: url("@/assets/icons/star-notify.svg");
        background-size: contain;
        height: 20px;
        width: 20px;
        position: absolute;
        right: 26px;
        top: 20px;
      }
    }
    img {
      border-radius: 6px;
      width: 36px;
      height: 36px;
      margin-right: 16px;
    }
    div {
      h3 {
        @include font(14px, 500, 20px, var(--text));
        margin: 0 0 2px;
      }
      p {
        @include font(12px, 400, 18px, var(--text));
        margin: 0;
      }
    }
  }

  h2 {
    @include font(20px, 600, 28px, var(--text));
    margin: 0 0 6px;
    margin-left: 16px;
  }
}
</style>
