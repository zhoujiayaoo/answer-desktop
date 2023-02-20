import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "normalize.css";
import router from "./router/index.js";

// console.log(router);
const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.mount("#app");
