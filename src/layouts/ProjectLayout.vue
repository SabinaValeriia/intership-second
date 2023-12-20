<template lang="pug">
.project-layout
  .project-layout__sidebar(:class="{ toggle }")
    .project-name(v-for="item in project", :key="item")
      img(v-if="item.logo", :src="JSON.parse(item.logo.name)", alt="name")
      p(v-if="!toggle") {{ item.name }}
    h2(v-if="!toggle") PLANNING
    router-link(
      :class="{ active: $route.path.includes('issues') }",
      :to="{ name: 'projectsTasks' }"
    )
      i.icon.tasks_board
      p(v-if="!toggle") Issues
      .block-black 
        i.icon.arrow-long
      .hover-block
    a
      i.icon.kanban
      p(v-if="!toggle") Kanban board
      .block-black 
        i.icon.arrow-long
      .hover-block
    router-link(
      :class="{ active: $route.path.includes('archive') }",
      :to="{ name: 'archiveTasks' }"
    )
      i.icon.archive
      p(v-if="!toggle") Archive
      .block-black 
        i.icon.arrow-long
      .hover-block
    h2(v-if="!toggle") OPERATIONS
    a.position
      i.icon.details
      p(v-if="!toggle") Project details
      .block-black 
        i.icon.arrow-long
      .hover-block
    button.hide(@click="toggleBlock", :class="{ toggle: toggle }")
      i.icon.arrow
  .mobile
    .project-name(v-for="item in project", :key="item")
      img(v-if="item.logo", :src="JSON.parse(item.logo.name)", alt="name")
      p(v-if="!toggle") {{ item.name }}
  router-view(:class="{ toggle }")
</template>

<script setup lang="ts">
import { endIndex, startIndex } from "@/composables/pagination";
import { showProjects } from "@/services/api/projectApi";
import { ProjectInterfaceItem } from "@/types/projectApiInterface";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const foundProject = ref();
const project = ref([]);
const toggle = ref(false);
const toggleBlock = () => {
  toggle.value = !toggle.value;
};

onMounted(() => {
  showProjects("").then(({ data }) => {
    foundProject.value = data.data.find(
      (project: ProjectInterfaceItem) =>
        project.attributes.key === route.params.key
    );

    if (foundProject.value) {
      project.value = [
        {
          name: foundProject.value.attributes.title,
          logo: foundProject.value.attributes.logo,
        },
      ];
    }
  });
});
</script>

<style lang="scss" scoped>
.project-layout {
  display: flex;
  background: var(--background);
  height: 100vh;
  .mobile {
    display: none;
  }
  @include media_mobile {
    flex-direction: column;
    position: absolute;
    top: 56px;
    width: 100%;
    overflow: hidden;
    .mobile {
      display: block;
      .project-name {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        img {
          width: 28px;
          height: 28px;
          margin-right: 6px;
          border-radius: 6px;
        }
        p {
          margin: 0;
          @include font(16, 500, 24px, var(--text));
        }
      }
    }
  }
  button.hide {
    position: absolute;
    top: 34px;
    right: -9px;
    background: var(--accent);
    width: 20px;
    height: 20px;
    border-radius: 10px;
    border: none;
    display: none;
    cursor: pointer;
    &.toggle {
      i.arrow {
        transform: rotate(270deg);
        top: -1px;
      }
    }
    i.arrow {
      width: 10px;
      height: 5px;
      position: relative;
      transform: rotate(88deg);
      left: -1px;
      &::before {
        background: var(--white);
      }
    }
  }
  &__sidebar {
    padding: 28px 12px;
    border-right: 1px solid var(--primary);
    min-width: 240px;
    box-sizing: border-box;
    position: relative;
    cursor: pointer;
    @include media_mobile {
      display: none;
    }
    &:hover {
      border-right: 1px solid var(--accent);
      button.hide {
        display: block;
      }
    }
    &.toggle {
      min-width: 64px;
      max-width: 64px;
      padding: 28px 6px;
      .active:hover {
        height: 44px;
      }
      .project-name {
        justify-content: center;
      }
      a {
        justify-content: center;
        text-decoration: none;
        &:first-of-type {
          margin: 60px 0 0 0;
        }
        &:hover {
          height: 44px;
          box-sizing: border-box;
          i {
            display: none;
          }
        }
      }
      .position {
        margin: 60px 0 0 0;
      }
    }
    .project-name {
      display: flex;
      align-items: center;
      padding: 0 16px;
      img {
        width: 32px;
        height: 32px;
        border-radius: 6px;
      }
    }
    h2 {
      @include font(16px, 500, 24px, var(--text));
      margin: 26px 16px 0;
    }
    a {
      padding: 12px 16px;
      display: flex;
      align-items: center;
      margin: 4px 0 0 0;
      position: relative;
      text-decoration: none;
      &:first-of-type {
        margin: 10px 0 0 0;
      }
      i.arrow-long {
        display: none;
      }
      &.position {
        margin: 10px 0 0 0;
      }
      i.icon {
        position: relative;
      }
      &.active {
        background: var(--primary);
        border-radius: 6px;
        &:hover {
          height: 48px;
          box-sizing: border-box;
          .hover-block {
            display: none;
          }
        }
        p {
          color: var(--white);
        }
        i.icon {
          &::before {
            background: var(--white);
          }
        }
        .hover-block {
          display: block;
        }
      }
      &:hover {
        background: var(--secondary);
        border-radius: 6px;
        .block-black {
          background: var(--text);
          width: 20px;
          height: 20px;
          border-radius: 10px;
          position: absolute;
          right: 16px;
          i.arrow-long {
            width: 10px;
            height: 10px;
            position: absolute;
            top: 4px;
            left: 5px;
            display: block;
            &::before {
              background: var(--white);
            }
          }
        }
      }
      .hover-block {
        width: 5px;
        height: 22px;
        background: var(--white);
        position: absolute;
        top: 13px;
        left: 0;
        border-radius: 0 4px 4px 0;
        display: none;
      }
    }
    p {
      margin: 0 0 0 12px;
      @include font(16px, 500, 24px, var(--text));
    }
  }
}
</style>
