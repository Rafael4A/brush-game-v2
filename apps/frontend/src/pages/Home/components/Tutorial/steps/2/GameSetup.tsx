import { CardCode, evaluateCardCode } from "shared-code";
import { Column, Row } from "../../../../../../components";

const cardExamplesLines: { key: number; examples: CardCode[] }[] = [
  { key: 0, examples: ["AC", "2D", "3H", "4S", "5C"] },
  { key: 1, examples: ["6D", "7H", "QS", "JC", "KD"] },
];

export function GameSetupStep() {
  return (
    <Column gap="8px">
      <p>
        Brush can be played with 2, 3, or 4 players using standard playing
        cards. Each card holds a specific point value: Aces are worth 1 point,
        number cards are worth their face value, Queens are worth 8 points,
        Jacks are worth 9 points, and Kings are worth 10 points. The game is
        played over several rounds, and the player with the most points at the
        end of the game wins.
      </p>

      {cardExamplesLines.map(({ key, examples }) => (
        <Row flexWrap key={key}>
          {examples.map((cardCode) => {
            const cardValue = evaluateCardCode(cardCode);
            return (
              <Column key={cardCode}>
                <img
                  width={100}
                  src={`/resources/cards/default_webp/${cardCode}.webp`}
                  alt={cardCode}
                />
                <span>
                  {cardValue} {cardValue === 1 ? "point" : "points"}
                </span>
              </Column>
            );
          })}
        </Row>
      ))}
    </Column>
  );
}
