import { createRouter, createWebHistory } from "vue-router";
import Home from "@/components/Home";
import Login from "@/components/Login";
import Register from "@/components/Register";
import SubredditForm from "@/components/SubredditForm.vue";
import PostForm from "@/components/PostForm.vue";
import Subreddit from "./components/Subreddit";
import SinglePost from "./components/SinglePost";
import Comment from "./components/Comment";
import UserEditForm from "./components/UserEditForm";
import axios from "axios";
import AdminBar from "./components/AdminBar";
import RemindPanel from "./components/RemindPanel";
import VerifyPanel from "./components/VerifyPanel";
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/subredditForm",
    name: "SubredditForm",
    component: SubredditForm,
  },
  {
    path: "/subredditFormEdit/:name",
    name: "SubredditFormEdit",
    component: SubredditForm,
  },
  {
    path: "/subreddit/:name",
    name: "Subreddit",
    component: Subreddit,
  },
  {
    path: "/subreddit/:name/create",
    name: "PostForm",
    component: PostForm,
  },
  {
    path: "/post/:id",
    name: "SinglePost",
    component: SinglePost,
  },
  {
    path: "/test",
    name: "Comment",
    component: Comment,
  },
  {
    path: "/userEdit",
    name: "UserEditForm",
    component: UserEditForm,
  },
  {
    path: "/admin",
    name: "AdminBar",
    component: AdminBar,
  },
  {
    path: "/remind",
    name: "RemindPanel",
    component: RemindPanel,
  },
  {
    path: "/verify/:id",
    name: "VerifyPanel",
    component: VerifyPanel,
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("user-token");
  if (
    token ||
    to.name === "Login" ||
    to.name === "Register" ||
    to.name === "RemindPanel" ||
    to.name === "VerifyPanel"
  ) {
    next();
  } else {
    next({ name: "Login" });
  }
});
router.beforeEach(async (to, from, next) => {
  if (to.name === "SubredditFormEdit") {
    console.log(to.name);
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + localStorage.getItem("user-token");
    await axios
      .get(`http://localhost:3000/subreddit/${to.params.name}/checkMod`)
      .then(() => {
        next();
      })
      .catch(() => {
        {
          next({ name: "Home" });
        }
      });
  } else {
    next();
  }
});
router.beforeEach(async (to, from, next) => {
  if (to.name === "AdminBar") {
    if (localStorage.getItem("isAdmin")) next();
    else next({ name: "Home" });
  } else {
    next();
  }
});
export default router;
