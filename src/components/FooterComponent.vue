<template lang="pug">
.footer
  .footer__block 
    i.icon.home 
    p Home
  router-link.footer__block(
    to="/dashboard/projects",
    :class="{ active: isRouteActive('projects') }"
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
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
const isRouteActive = (routeName: string) => {
  if (route.name === routeName) {
    return true;
  }
};
</script>

<style scoped lang="scss">
.footer {
  position: fixed;
  bottom: 0;
  width: calc(100% - 64px);
  background: var(--accent);
  box-shadow: var(--box-shadow-main);
  padding: 6px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
