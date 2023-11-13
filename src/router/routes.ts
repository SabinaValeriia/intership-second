import { RouteRecordRaw } from "vue-router";

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
        name: "Registration",
        component: () => import("../views/RegistrationView.vue"),
      },
    ],
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../layouts/MainLayout.vue"),
    redirect: "/dashboard/project",
    children: [
      {
        path: "projects",
        name: "projects",
        component: () => import("../views/ProjectsView.vue"),
      },
    ],
  },
];

export default routes;
