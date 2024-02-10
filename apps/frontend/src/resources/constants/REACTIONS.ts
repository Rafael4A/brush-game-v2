import { Reaction } from "shared-code";

interface ReactionObject {
  name: Reaction;
  icon: string;
}

export const REACTIONS: ReactionObject[] = [
  {
    name: Reaction.Love,
    icon: "❤️",
  },
  {
    name: Reaction.Laugh,
    icon: "🤣",
  },
  {
    name: Reaction.Cry,
    icon: "😭",
  },
  {
    name: Reaction.Angry,
    icon: "😡",
  },
  {
    name: Reaction.Bored,
    icon: "🥱",
  },
];
