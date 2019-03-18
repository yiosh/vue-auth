import Vue from "vue";
import Router from "vue-router";
// import Home from "./views/Home.vue";
import Login from "./views/Login";
// import Dashboard from "@/components/Dashboard";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login
    },
    {
      path: "*",
      name: "NotFound",
      component: () => import("./views/NotFound.vue")
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: () => import("./views/Dashboard.vue")
    }
  ]
});
