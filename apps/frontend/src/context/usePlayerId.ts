import { LOCAL_STORAGE_KEYS } from "../resources/constants";
import { createGlobalStorageState } from "./base/createGlobalStorageState";

export const [usePlayerId, PlayerIdProvider] = createGlobalStorageState(
  LOCAL_STORAGE_KEYS.PLAYER_ID,
  ""
);
