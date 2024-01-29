import { Route, Routes } from "react-router-dom";

import { RoomScreen, HomeScreen } from "./pages";
import { ROUTES } from "./resources/constants";

export default function Router() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomeScreen />} />
      <Route path={ROUTES.ROOM} element={<RoomScreen />} />
      <Route path={ROUTES.LOCAL_GAME} element={<RoomScreen isLocalGame />} />
      {/* <Route path='*' element={<NotFoundScreen />} /> */}
    </Routes>
  );
}
