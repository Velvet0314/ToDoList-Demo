import { componentSizes } from "element-plus";
import { createRouter, createWebHashHistory } from "vue-router";

import Index from "~/pages/index.vue";
import Login from "~/pages/login.vue";
import NotFound from "~/pages/404.vue";
import Register from "~/pages/register.vue";
import Dashboard from "~/components/dashboard.vue";
import Plan from "~/components/plan.vue";
import Data from "~/components/data.vue";
import Settings from "~/components/settings.vue";

const routes = [
  {
    path: "/",
    component: Index,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: Dashboard,
      },
      {
        path: "plan",
        component: Plan,
      },
      {
        path: "data",
        component: Data,
      },
      {
        path: "settings",
        component: Settings,
      },
    ],
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/plan",
    name: "Plan",
    component: Plan,
  },
  {
    path: "/data",
    name: "Data",
    component: Data,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
