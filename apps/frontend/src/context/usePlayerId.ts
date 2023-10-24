import { createGlobalStorageState } from "./base/createGlobalStorageState";

export const [usePlayerId, PlayerIdProvider] = createGlobalStorageState(
  "playerId",
  ""
);
