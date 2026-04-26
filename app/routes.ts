import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("visualizer/:id", "./routes/visualizer.$id.tsx"),
  route("how-it-works", "./routes/how-it-works.tsx"),
] satisfies RouteConfig;
