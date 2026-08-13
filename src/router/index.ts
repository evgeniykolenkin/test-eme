import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";
import TodoView from "../views/TodoView.vue";

export const routesOrder = ["todo", "tabs"];

const routes: Array<RouteRecordRaw> = [
  { path: "/", redirect: "/todo" },
  { path: "/todo", name: "todo", component: TodoView },
  {
    path: "/tabs",
    name: "tabs",
    component: () => import("../views/TabsView.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
