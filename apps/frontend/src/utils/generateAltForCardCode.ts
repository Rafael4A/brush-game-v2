import { CardCode } from "shared-types";

export function generateAltForCardCode(cardCode: CardCode) {
  const cardCodeSuit = getCardCodeSuitText(cardCode);
  const cardCodeValue = getCardCodeValueText(cardCode);
  return `${cardCodeValue} of ${cardCodeSuit}`;
}

function getCardCodeValueText(cardCode: CardCode) {
  switch (cardCode[0]) {
    case "A":
      return "Ace";
    case "2":
      return "Two";
    case "3":
      return "Three";
    case "4":
      return "Four";
    case "5":
      return "Five";
    case "6":
      return "Six";
    case "7":
      return "Seven";
    case "8":
      return "Eight";
    case "9":
      return "Nine";
    case "0":
      return "Ten";
    case "J":
      return "Jack";
    case "Q":
      return "Queen";
    case "K":
      return "King";
    default:
      throw new Error("Invalid card code");
  }
}

function getCardCodeSuitText(cardCode: CardCode) {
  switch (cardCode[1]) {
    case "C":
      return "clubs";
    case "D":
      return "diamonds";
    case "H":
      return "hearts";
    case "S":
      return "spades";
    default:
      throw new Error("Invalid card code");
  }
}
