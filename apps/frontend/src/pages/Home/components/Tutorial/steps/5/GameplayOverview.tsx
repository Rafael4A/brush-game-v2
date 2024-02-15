import { Column } from "../../../../../../components";
import BrushCombiantionExample from "./BrushCombinationExample.png";

export function GameplayOverviewStep() {
  return (
    <Column gap="8px">
      <p>
        During each turn, players follow a sequential order. On their turn,
        players can either combine <b>one</b> of their card with table cards to
        reach a total of 15 points or add their card to the table if no
        combination is possible. If players are able to make a combination, the
        cards used are moved to the player&apos;s collected cards pile.
      </p>
      <img
        src={BrushCombiantionExample}
        alt="Example of a combination using three cards, one of them from the player's hand, and the rest from the table."
        style={{
          maxHeight: "60vh",
          maxWidth: "100%",
          borderRadius: "10px",
        }}
      />
    </Column>
  );
}
