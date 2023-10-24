import { GetRoomResponseDto } from "shared-types";

interface WaitingForPlayersProps {
  data: GetRoomResponseDto;
}

export function WaitingForPlayers({ data }: WaitingForPlayersProps) {
  return (
    <div>
      <h1>Waiting for players</h1>
    </div>
  );
}
