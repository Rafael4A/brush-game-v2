import { LOCAL_STORAGE_KEYS } from "../resources/constants";
import { createGlobalStorageState } from "./base/createGlobalStorageState";

export const [useNickname, NicknameProvider] = createGlobalStorageState(
  LOCAL_STORAGE_KEYS.NICKNAME,
  ""
);
