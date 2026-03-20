import {
  type RouteConfig,
  route,
  index,
  layout,
  prefix,
} from "@react-router/dev/routes";

export default [
  index("./pages/home.tsx"),

  //layout("./auth/layout.tsx", [
    route("login", "./pages/login.tsx"),
    route("signup", "./pages/signup.tsx"),
  //]),
] satisfies RouteConfig;
