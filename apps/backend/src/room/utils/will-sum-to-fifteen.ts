import { evaluateCardCode } from "./evaluate-card-code";

export function willSumToFifteen(cardsCodes: string[]) {
  const cardValues = cardsCodes.map((cardCode) => evaluateCardCode(cardCode));
  const sum = cardValues.reduce((partialSum, value) => partialSum + value, 0);
  return sum === 15;
}
