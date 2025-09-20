import { type RouteConfig, layout, route } from "@react-router/dev/routes";

export default [
    layout("routes/admin/adminLayout.tsx", [
        route(/*Path:*/'dashboard', /*File:*/ 'routes/admin/dashboard.tsx'), //this is how you route using rotue in next.js
        route(/*Path:*/'all-users', /*File:*/ 'routes/admin/allUsers.tsx'),
        
    ]),

] satisfies RouteConfig;
