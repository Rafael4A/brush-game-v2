import { GameTypeProvider, GameTypes } from "../../context";
import { RoomScreen } from "./Room";

export function Component() {
  return (
    <GameTypeProvider initialValue={GameTypes.Local}>
      <RoomScreen />
    </GameTypeProvider>
  );
}
Component.displayName = "LocalRoomScreen";
