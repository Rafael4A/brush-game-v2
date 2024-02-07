import { Column } from "../../../../../../components";

export function GameplayOverviewStep() {
  return (
    <Column>
      <p>
        During each turn, players follow a sequential order. On their turn,
        players can either combine <b>one</b> of their card with table cards to
        reach a total of 15 points or add their card to the table if no
        combination is possible. If players are able to make a combination, the
        cards used are moved to the player's collected cards pile.
      </p>
    </Column>
  );
}
