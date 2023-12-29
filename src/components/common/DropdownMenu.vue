<template lang="pug">
.menu(v-if="isOpen")
  div
    h2 {{ title }}
    div(v-if="project")
      router-link.menu-project(
        v-for="(project, index) in projects.slice(0, 5)",
        :key="index",
        :to="{ name: 'projectsIssues', params: { key: project.attributes.key, projectId: project.id } }"
      )
        img.logo(
          v-if="project.attributes.logo !== null || project.attributes.logo",
          :src="JSON.parse(project.attributes.logo.name)",
          alt="name"
        )
        div
          h3 {{ project.attributes.title }} ({{ project.attributes.key }})
          p {{ project.attributes.tags.data[0].attributes.name }}
        i.icon.unchecked
        i.icon.star
    div(v-else)
      router-link.menu-project(
        v-for="(project, index) in leadNames.slice(0, 5)",
        :key="index",
        :to="{ name: 'teamsUser', params: { id: project.id } }"
      )
        img.logo(
          v-if="project.logo !== null || project.logo",
          :src="JSON.parse(project.logo.name)",
          alt="name"
        )
        img(v-else, :src="require(`@/assets/icons/default_user.svg`)")
        div
          h3 {{ project.name }}
    h2(v-if="subtitle") {{ subtitle }}
  div(v-if="project && !projects.length")
    no-results.menu-no(:no-data="true")
  .link
    router-link(:to="`/dashboard/${type}`") View all {{ type }}
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import NoResults from "../NoResults.vue";
import { leadNames } from "../../composables/userActions";
import { showProjects } from "@/services/api/projectApi";

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
    projects.value = data.data.map((project: any) => project);
    totalProjects.value = projects.value.length;
  });
});
</script>

<style lang="scss" scoped>
.menu {
  left: 0;
  position: absolute;
  top: 55px;
  padding: 16px 0;
  background: var(--white);
  border-radius: 6px;
  box-sizing: border-box;
  min-width: 351px;
  z-index: 10;
  box-shadow: 0px 4px 8px rgba(61, 55, 52, 0.08);

  .link {
    margin-top: 16px;
  }

  a {
    @include font(16px, 500, 24px, var(--text));
    text-decoration: none;
    margin: 16px;

    &.menu-project {
      margin: 0;
    }
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
