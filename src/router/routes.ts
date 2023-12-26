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
        path: "projects/:id",
        name: "projectsItem",
        component: () => import("../views/ProjectsView.vue"),
      },
      {
        path: "projects/:key/:projectId",
        name: "projectsIssues",
        component: () => import("../layouts/ProjectLayout.vue"),
        redirect: (to) => {
          return { name: "projectsTasks" };
        },
        children: [
          {
            path: "issues",
            name: "projectsTasks",
            component: () => import("../views/ProjectsIssues.vue"),
            children: [
              {
                path: ":id",
                name: "issuesItem",
                component: () => import("../views/ProjectsIssues.vue"),
              },
            ],
          },
          {
            path: "archive",
            name: "archiveTasks",
            component: () => import("../views/ArchiveView.vue"),
            children: [
              {
                path: ":id",
                name: "issuesItem",
                component: () => import("../views/ProjectsIssues.vue"),
              },
            ],
          },
          {
            path: "board",
            name: "boardItem",
            component: () => import("../views/BoardView.vue"),
          },
        ],
      },
      {
        path: "projects/:key/:id",
        name: "projectsTask",
        component: () => import("../views/ProjectsView.vue"),
      },
      {
        path: "projects/:key",
        name: "projectsProject",
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
      if (to.path.toLowerCase() === "/login") {
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
