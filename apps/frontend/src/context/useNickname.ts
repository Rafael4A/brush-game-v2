import { createGlobalStorageState } from "./base/createGlobalStorageState";

export const [useNickname, NicknameProvider] = createGlobalStorageState(
  "nickname",
  ""
);
