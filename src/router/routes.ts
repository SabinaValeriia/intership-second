import { useUserStore } from "@/store/user";
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
  {
    path: "/dashboard",
    name: "Main",
    component: () => import("../layouts/MainLayout.vue"),
    redirect: "/dashboard/projects",
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "projects",
        name: "projects",
        component: () => import("../views/ProjectsView.vue"),
      },
      {
        path: "teams",
        name: "teams",
        component: () => import("../views/TeamsView.vue"),
      },
      {
        path: "teams/:id",
        name: "teamsUser",
        component: () => import("../views/UserView.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isAuthenticated = userStore.accessToken;

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (isAuthenticated) {
      if (to.path === "/login") {
        next("/dashboard");
      } else {
        next();
      }
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
