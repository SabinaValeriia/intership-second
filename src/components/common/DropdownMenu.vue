<template lang="pug">
.menu(v-if="isOpen")
  div(v-if="project && totalProjects")
    h2 {{ title }}
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
        p {{ project.tags.data[0].attributes.name }}
      i.icon.unchecked
      i.icon.star
    h2 {{ subtitle }}
  div(v-if="project && !totalProjects")
    no-results.menu-no(:noData="true")
  router-link(to="/dashboard/projects") View all projects
</template>

<script setup lang="ts">
import { showProjects } from "@/services/api/projectApi";
import { onMounted, ref } from "vue";
import NoResults from "../NoResults.vue";

const props = defineProps({
  type: { type: String },
  withIcon: { type: Boolean, default: false },
  isOpen: Boolean,
  title: String,
  subtitle: String,
  project: Boolean,
});
const projects = ref([]);
const totalProjects = ref();
onMounted(() => {
  showProjects("").then(({ data }) => {
    projects.value = data.data.map((project: any) => project.attributes);
    totalProjects.value = projects.value.length;
  });
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

  a {
    @include font(16px, 500, 24px, var(--text));
    text-decoration: none;
    margin: 16px;
  }

  &-project {
    display: flex;
    align-items: center;
    padding: 10px 16px;
    cursor: pointer;
    position: relative;
    &:last-of-type {
      border-bottom: 1px solid var(--primary);
      margin-bottom: 16px;
    }
    i.icon {
      right: 26px;
      &.unchecked {
        display: none;
      }
      &.star {
        display: none;
        &::before {
          background: var(--notify_warning);
        }
      }
    }
    &:hover {
      background: var(--white-shadow);
      i.icon.unchecked {
        display: block;
      }
    }
    &.active {
      i.icon.star {
        display: block;
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
