import { createRouter, createWebHistory } from "vue-router";
import Hero from "../views/Hero.vue";
import Login from "../views/Login.vue";
import Dashboard from "../views/Admin/Dashboard.vue";
import Users from "../views/Admin/Users.vue";
import AddEmployee from "../views/Admin/AddEmployee.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Hero,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
    },
    {
      path: "/users",
      name: "users",
      component: Users,
    },
    {
      path: "/add-employee",
      name: "add-employee",
      component: AddEmployee,
    },
    // {
    //   path: '/leave-requests',
    //   name: 'leave-requests',

    // },
    // {
    //   path: '/settings',
    //   name: 'settings',

    // }
  ],
});

export default router;
