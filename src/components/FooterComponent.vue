<template lang="pug">
.footer
  a.footer__block(:class="{ active: $route.path.includes('work') }")
    i.icon.home
    p Home
  a.footer__block(
    v-if="$route.path.includes('issues') || $route.path.includes('archive') || $route.path.includes('boardItem')",
    :class="{ active: $route.path.includes('projects') }",
    @click="openModal(EnumModalKeys.ModalMenu)"
  )
    i.icon.projects
    p Projects
  router-link.footer__block(
    v-else,
    :class="{ active: $route.path.includes('projects') }",
    to="/dashboard/projects"
  )
    i.icon.projects
    p Projects
  a.footer__block
    i.icon.tasks
    p Issues
  router-link.footer__block(
    to="/dashboard/teams",
    :class="{ active: isRouteActive('teams') || $route.path.includes('teams') }"
  )
    i.icon.user
    p Members
modal-menu(
  v-if="isOpen(EnumModalKeys.ModalMenu)",
  :menu="true",
  @close="close"
)
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { EnumModalKeys } from "@/constants/EnumModalKeys";
import { isOpen, openModal } from "@/composables/modalActions";
import ModalMenu from "@/modals/ModalMenu.vue";

const route = useRoute();
const isRouteActive = (routeName: string) => {
  if (route.name === routeName) {
    return true;
  }
};
const close = () => {
  openModal(EnumModalKeys.ModalMenu);
};
</script>

<style lang="scss" scoped>
.footer {
  position: fixed;
  bottom: 0;
  width: calc(100% - 64px);
  background: var(--accent);
  box-shadow: var(--box-shadow-main);
  padding: 6px 32px;
  display: none;
  align-items: center;
  justify-content: space-between;
  z-index: 1100;
  @include media_mobile {
    display: flex;
  }

  &__block {
    display: flex;
    align-items: center;
    flex-direction: column;
    text-decoration: none;

    &:hover {
      color: var(--background);

      i::before {
        background-color: var(--background);
      }

      p {
        color: var(--background);
      }
    }

    &.active {
      color: var(--background);

      i::before {
        background-color: var(--background);
      }

      p {
        color: var(--background);
      }
    }

    i {
      width: 26px;
      height: 26px;
      margin-bottom: 4px;

      &::before {
        background-color: var(--primary);
      }
    }

    p {
      margin: 30px 0 0 0;
      @include font(12px, 500, 14px, var(--primary));
      cursor: pointer;
    }
  }
}
</style>
