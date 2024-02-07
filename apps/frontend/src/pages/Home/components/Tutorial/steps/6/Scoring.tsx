import { Column } from "../../../../../../components";

export function ScoringStep() {
  return (
    <Column>
      <p>
        When all cards have been played, the round ends and the score is
        calculated. It considers the following rules:
      </p>
      <ul
        style={{
          paddingTop: 8,
          gap: 8,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <li>
          <b>Most collected cards:</b> Whoever has collected the most cards gets
          a point.
        </li>
        <li>
          <b>Most diamond suit cards:</b> The player who has collected the most
          diamond suit cards receives 1 point.
        </li>
        <li>
          <b>7 of Diamonds:</b> If a player has collected the 7 of diamonds
          during the round, they receive 1 point.
        </li>
        <li>
          <b>Brush:</b> Whenever a player leaves the table empty after
          collecting cards, they receive 1 point.
        </li>
        <li>
          <b>Highest sum of distinct suits</b>: The player with the highest sum
          made of one number card from each suit out of their collected cards
          receives 1 point.
        </li>
      </ul>
    </Column>
  );
}
