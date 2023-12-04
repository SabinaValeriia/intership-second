<template lang="pug">
notification-component
router-view
</template>

<script setup lang="ts">
import NotificationComponent from "./components/common/NotificationComponent.vue";
</script>

<style lang="scss">
#app {
  @include media_mobile {
    overflow: hidden;
  }
}
</style>
