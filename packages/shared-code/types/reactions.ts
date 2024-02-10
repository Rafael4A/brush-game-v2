export enum Reaction {
  Love = "Love",
  Laugh = "Laugh",
  Cry = "Cry",
  Angry = "Angry",
  Bored = "Bored",
}

export interface ServerReactionEvent {
  nickname: string;
  reaction: Reaction;
}
