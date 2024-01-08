import { CardCode } from "shared-types";

import { evaluateCardCode } from "./evaluateCardCode";

export function willSumToFifteen(cardsCodes: CardCode[]) {
  const cardValues = cardsCodes.map((cardCode) => evaluateCardCode(cardCode));
  const sum = cardValues.reduce((partialSum, value) => partialSum + value, 0);
  return sum === 15;
}
