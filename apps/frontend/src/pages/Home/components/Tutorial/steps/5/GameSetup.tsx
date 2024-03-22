import { CardCode, evaluateCardCode } from "shared-code";

import { Column } from "../../../../../../components";
import { CardsGrid } from "./styles";

const cardExamplesLines: CardCode[] = [
  "AC",
  "2D",
  "3H",
  "4S",
  "5C",
  "6D",
  "7H",
  "QS",
  "JC",
  "KD",
];

export function GameSetupStep() {
  return (
    <Column gap="8px">
      <p>
        Brush can be played with 2, 3, or 4 players using standard playing
        cards. Each card in the game holds a specific value: Aces are valued at
        1, number cards carry their face value, while Queens, Jacks, and Kings
        are respectively valued at 8, 9, and 10 when calculating combinations to
        reach 15. The game is played over several rounds, and the player with
        the most points at the end of the game wins.
      </p>

      <CardsGrid>
        {cardExamplesLines.map((cardCode) => {
          const cardValue = evaluateCardCode(cardCode);
          return (
            <Column key={cardCode} gap="6px">
              <img
                width={100}
                src={`/resources/cards/default_webp/${cardCode}.webp`}
                alt={cardCode}
              />
              <span>Value: {cardValue}</span>
            </Column>
          );
        })}
      </CardsGrid>
    </Column>
  );
}
