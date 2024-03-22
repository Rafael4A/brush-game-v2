import { GameTypeProvider, GameTypes } from "../../context";
import { RoomScreen } from "./Room";

export function Component() {
  return (
    <GameTypeProvider initialValue={GameTypes.Online}>
      <RoomScreen />
    </GameTypeProvider>
  );
}
Component.displayName = "OnlineRoomScreen";
