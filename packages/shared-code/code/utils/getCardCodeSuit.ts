import { CardCode } from "../../types";

export function getCardCodeSuit(cardCode: CardCode) {
  switch (cardCode[1]) {
    case "C":
      return "CLUBS";
    case "D":
      return "DIAMONDS";
    case "H":
      return "HEARTS";
    case "S":
      return "SPADES";
    default:
      throw new Error("Invalid card code");
  }
}
