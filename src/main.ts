import router from "../src/router/routes";
import { createApp } from "vue";
import App from "./App.vue";
import "@/scss/styles.scss";
import "broadcastchannel-polyfill";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { PiniaSharedState } from "pinia-shared-state";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
pinia.use(PiniaSharedState({ enable: true, initialize: true, type: "native" }));

const app = createApp(App);

app.use(pinia).use(router).mount("#app");
