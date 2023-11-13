import { createApp } from "vue";
import App from "./App.vue";
import "@/scss/styles.scss";
import "broadcastchannel-polyfill";

const app = createApp(App);

app.mount("#app");
