<template lang="pug">
app-modal.menu
  template(#content)
    .modal-header
      .project-name(v-for="item in project", :key="item")
        p {{ item.name }}
    .modal-body
      router-link(:to="{ name: 'projectsTasks' }")
        i.icon.tasks_board
        p Issues
        .block-black
          i.icon.arrow-long
        .hover-block
      router-link(:to="{ name: 'boardItem' }")
        i.icon.kanban
        p Kanban board
        .block-black
          i.icon.arrow-long
        .hover-block
      router-link(:to="{ name: 'archiveTasks' }")
        i.icon.archive
        p Archive
        .block-black
          i.icon.arrow-long
        .hover-block
      router-link(:to="{ name: 'projectDetails' }")
        i.icon.details
        p Project details
        .hover-block
      router-link.position(:to="{ name: 'projects' }")
        i.icon.projects
        p Projects
        .hover-block
    .modal-footer
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import AppModal from "./AppModal.vue";
import { showProjects } from "@/services/api/projectApi";
import { ProjectInterfaceItem } from "@/types/projectApiInterface";
import { useRoute } from "vue-router";

const emit = defineEmits(["close"]);
const route = useRoute();
const foundProject = ref();
const project = ref([]);
watch(route, (to, from) => {
  const newPath = to.path;
  if (newPath.includes("/archive")) {
    emit("close");
  } else if (newPath.includes("/issues")) {
    emit("close");
  }
});
watch(
  () => route.params.key,
  (newKey, oldKey) => {
    if (newKey !== oldKey) {
      emit("close");
    }
  }
);
onMounted(() => {
  showProjects("").then(({ data }) => {
    foundProject.value = data.data.find((project: ProjectInterfaceItem) => {
      return Number(project.id) === Number(route.params.projectId);
    });

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
.modal-header {
  .project-name {
    display: flex;
    justify-content: center;
    align-items: center;

    p {
      margin: 12px 0 14px;
      @include font(16px, 500, 26px, var(--text));
    }
  }
}

.modal-body {
  a {
    padding: 12px 16px;
    display: flex;
    align-items: center;
    position: relative;
    text-decoration: none;

    i.arrow-long {
      display: none;
    }

    &.position {
      margin: 19px 0 0 0;
    }

    i.icon {
      position: relative;
      width: 20px;
      height: 20px;
    }

    &.router-link-active {
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
</style>
