import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import axios from "axios";

Vue.use(Router);

let router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("./views/Login.vue"),
      meta: {
        guest: true
      }
    },
    {
      path: "*",
      name: "NotFound",
      component: () => import("./views/NotFound.vue")
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: () => import("./views/Dashboard.vue"),
      meta: {
        requiresAuth: true
      }
    }
  ]
});

// router.beforeEach((to, from, next) => {
//   if (from.path !== "/login" && to.path === "/dashboard") {
//     axios
//       .post("/api/auth")
//       .then(() => {
//         next({ name: "Dashboard" });
//       })
//       .catch(() => {
//         next({
//           path: "/login",
//           query: { m: "You are not authorized!" },
//           params: { nextUrl: to.fullPath }
//         });
//       });
//   } else if (to.path === "/dashboard") {
//     axios
//       .post("/api/auth")
//       .then(() => {
//         next({ name: "Dashboard" });
//       })
//       .catch(() => {
//         next({
//           path: "/login",
//           query: { m: "You are not authorized!" },
//           params: { nextUrl: to.fullPath }
//         });
//       });
//   } else {
//     next();
//   }
// });

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    axios
      .post("/api/auth")
      .then(() => {
        next();
      })
      .catch(() => {
        next({
          path: "/login",
          query: { m: 401 },
          params: { nextUrl: to.fullPath }
        });
      });
  } else if (to.matched.some(record => record.meta.guest)) {
    next();
  } else {
    next();
  }
});

export default router;
