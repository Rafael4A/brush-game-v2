import { createBrowserRouter } from "react-router-dom";

import { ROUTES } from "shared-code";

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    lazy: () => import("./pages/Home/Home"),
  },
  {
    path: ROUTES.ROOM,
    lazy: () => import("./pages/Room/OnlineRoom"),
  },
  {
    path: ROUTES.LOCAL_GAME,
    lazy: () => import("./pages/Room/LocalRoom"),
  },
  { path: "*", lazy: () => import("./pages/NotFound/NotFound") },
]);
