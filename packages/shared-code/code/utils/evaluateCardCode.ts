import { CardCode } from "../../types";

export function evaluateCardCode(cardCode: CardCode): number {
  const firstChar = cardCode.charAt(0);
  const firstCharAsNumber = parseInt(firstChar);
  if (Number.isNaN(firstCharAsNumber)) {
    switch (firstChar) {
      case "A":
        return 1;
      case "Q":
        return 8;
      case "J":
        return 9;
      case "K":
        return 10;
      default:
        return 0;
    }
  } else {
    return firstCharAsNumber;
  }
}
