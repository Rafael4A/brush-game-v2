import { Route, Routes } from "react-router-dom";

import { ROUTES } from "shared-code";

import { GameTypeProvider, GameTypes } from "./context";
import { RoomScreen, HomeScreen, NotFoundScreen } from "./pages";

export default function Router() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomeScreen />} />
      <Route
        path={ROUTES.ROOM}
        element={
          <GameTypeProvider initialValue={GameTypes.Online}>
            <RoomScreen />
          </GameTypeProvider>
        }
      />
      <Route
        path={ROUTES.LOCAL_GAME}
        element={
          <GameTypeProvider initialValue={GameTypes.Local}>
            <RoomScreen />
          </GameTypeProvider>
        }
      />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  );
}
