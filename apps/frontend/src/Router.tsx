import { Route, Routes } from "react-router-dom";

import { RoomScreen, HomeScreen } from "./pages";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/room/:id" element={<RoomScreen />} />
      {/* <Route path='*' element={<NotFoundScreen />} /> */}
    </Routes>
  );
}
