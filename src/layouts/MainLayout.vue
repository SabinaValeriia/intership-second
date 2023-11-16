<template lang="pug">
header-component
transition(name="fade", mode="out-in")
  router-view
footer-component.footer
</template>

<script lang="ts" setup>
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.footer {
  display: none;
  @include media_mobile {
    display: flex;
  }
}
</style>
