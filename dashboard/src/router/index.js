import { componentSizes } from "element-plus";
import { createRouter, createWebHashHistory } from "vue-router";

import Index from "~/pages/index.vue";
import Login from "~/pages/login.vue";
import NotFound from "~/pages/404.vue";
import Register from "~/pages/register.vue";
import About from "~/pages/about.vue";

const routes = [
  {
    path: "/",
    component: Index,
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
    path: "/about",
    component: About,
  },
  { 
    path: "/:pathMatch(.*)*", 
    name: "NotFound", 
    component: NotFound 
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
