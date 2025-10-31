import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    route('sign-in', 'routes/root/signIn.tsx'),
    route('api/create-trip', 'routes/api/createTrip.ts'),
    layout("routes/admin/adminLayout.tsx", [
        route(/*Path:*/'dashboard', /*File:*/ 'routes/admin/dashboard.tsx'), //this is how you route using rotue in next.js
        route(/*Path:*/'all-users', /*File:*/ 'routes/admin/allUsers.tsx'),
        route(/*Path:*/'trips', /*File:*/ 'routes/admin/trips.tsx'),
        route(/*Path:*/'trips/create', /*File:*/ 'routes/admin/createTrips.tsx'),
        route(/*Path:*/'trips/:tripId', /*File:*/ 'routes/admin/tripDetails.tsx'),
    ]),
    layout('routes/root/pageLayout.tsx', [
        index('routes/root/travelPage.tsx')
    ]),
    route("*", "routes/NotFound.tsx"),

] satisfies RouteConfig;
