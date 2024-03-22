import { createGlobalState } from "./base/createGlobalState";

export const [useGameType, GameTypeProvider] = createGlobalState<
  GameTypes | undefined
>(undefined);

export enum GameTypes {
  Online = "Online",
  Local = "Local",
}
