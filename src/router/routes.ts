import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Auth",
    component: () => import("../layouts/AuthLayout.vue"),
    redirect: "/login",
    children: [
      {
        path: "login",
        name: "login",
        component: () => import("../views/LoginView.vue"),
      },
      {
        path: "registration",
        name: "registration",
        component: () => import("../views/RegistrationView.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
