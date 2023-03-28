import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/answer/:calcScoreType",
    name: "answer",
    component: () => import("@/views/answer.vue"),
  },
  {
    path: "/",
    name: "index",
    component: () => import("@/views/index.vue"),
  },
  // 定义其他路由规则
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
