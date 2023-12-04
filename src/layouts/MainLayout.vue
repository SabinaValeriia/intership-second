<template lang="pug">
header-component
.content
  router-view
footer-component.footer
</template>

<script lang="ts" setup>
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
</script>

<style lang="scss" scoped>
.content {
  @include media_mobile {
    overflow: auto;
  }
}

.footer {
  display: none;
  @include media_mobile {
    display: flex;
  }
}
</style>
