import { GetRoomResponseDto } from "shared-types";
import { useTheme } from "styled-components";

import { ShareIcon } from "../../../../assets/icons/share";
import {
  Button,
  Column,
  LineLoader,
  Row,
  UnstyledButton,
} from "../../../../components";
import { PlayerNicknameLabel } from "./components";
import { useStartRoom } from "./hooks";
import { shareRoom } from "./utils";

interface WaitingForPlayersProps {
  data: GetRoomResponseDto;
}

const OPPONENT_INDEX_OFFSET = 2;

export function WaitingForPlayers({ data }: Readonly<WaitingForPlayersProps>) {
  const handleShare = () => shareRoom(data.id);

  const { colors } = useTheme();

  const { startRoom } = useStartRoom();

  const handleStartRoom = () => startRoom(data.id);

  return (
    <Column gap="16px" style={{ paddingTop: "16px" }}>
      <UnstyledButton onClick={handleShare}>
        <Row gap="8px">
          <h1>Room {data.id}</h1>
          <ShareIcon />
        </Row>
      </UnstyledButton>

      <Column>
        <h2>Players:</h2>
        <PlayerNicknameLabel
          isOwner={data.player.isOwner}
          nickname={data.player.nickname}
          position={1}
          isClient
        />
        {data.opponents.map((opponent, index) => (
          <PlayerNicknameLabel
            key={opponent.nickname}
            isOwner={opponent.isOwner}
            nickname={opponent.nickname}
            position={index + OPPONENT_INDEX_OFFSET}
          />
        ))}
      </Column>

      <Column gap="16px">
        <h2>
          {data.opponents.length >= 3
            ? "Waiting for game to start..."
            : "Waiting for players to join..."}
        </h2>
        {data.player.isOwner ? (
          <Button
            color={colors.palette_blue}
            onClick={handleStartRoom}
            disabled={data.opponents?.length === 0}
          >
            Start game
          </Button>
        ) : (
          <Row width="min(90vw, 400px)">
            <LineLoader />
          </Row>
        )}
      </Column>
    </Column>
  );
}
