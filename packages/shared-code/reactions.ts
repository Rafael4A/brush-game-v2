export enum Reaction {
  Like = "Like",
  Dislike = "Dislike",
  Love = "Love",
  Laugh = "Laugh",
  Cry = "Cry",
  Angry = "Angry",
}

export interface ServerReactionEvent {
  nickname: string;
  reaction: Reaction;
}
