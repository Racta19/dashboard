import { type RouteConfig, layout, route } from "@react-router/dev/routes";

export default [
    layout('/routes/admin/admin-layout', [
        route(/*Path:*/'dashboard', /*File:*/ 'routes/admin/dashboard.tsx') //this is how you route using rotue in next.js
    ]),

] satisfies RouteConfig;
