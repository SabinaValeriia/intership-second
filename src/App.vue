<template lang="pug">
notification-component
router-view
</template>

<script setup lang="ts">
import NotificationComponent from "./components/common/NotificationComponent.vue";
import { onMounted, watch } from "vue";
import { useUserStore } from "./store/user";
import { useRoute } from "vue-router";
import router from "./router/routes";
const userStore = useUserStore();
const route = useRoute();
onMounted(() => {
  watch(
    () => route.path,
    (newPath) => {
      if (userStore.accessToken && newPath.includes("login")) {
        router.replace("/dashboard");
      }
    }
  );
});
</script>

<style lang="scss"></style>
