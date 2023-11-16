import router from "../src/router/routes";
import { createApp } from "vue";
import App from "./App.vue";
import "@/scss/styles.scss";
import "broadcastchannel-polyfill";
import { createPinia } from "pinia";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia).use(router).mount("#app");
