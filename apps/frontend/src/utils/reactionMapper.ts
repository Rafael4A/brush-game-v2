import { Reaction } from "shared-code";

import { REACTIONS } from "../resources/constants";

export const reactionMapper = (reaction: Reaction) =>
  REACTIONS.find((r) => r.name === reaction)?.icon;
