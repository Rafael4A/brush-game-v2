import { useTheme } from "styled-components";

import { ShareIcon } from "../../../../assets/icons";
import {
  Button,
  Column,
  LineLoader,
  Row,
  UnstyledButton,
} from "../../../../components";
import { useRoom } from "../../../../context";
import { shareRoom } from "../../../../utils/shareRoom";
import { PlayerNicknameLabel } from "./components";
import { useStartRoom } from "./hooks";

const OPPONENT_INDEX_OFFSET = 2;

export function WaitingForPlayers() {
  const [roomData] = useRoom();
  const room = roomData!;
  const handleShare = () => shareRoom(room.id);

  const { colors } = useTheme();

  const { startRoom } = useStartRoom();

  return (
    <Column gap="16px" style={{ paddingTop: "16px" }}>
      <UnstyledButton onClick={handleShare}>
        <Row gap="8px">
          <h1>Room {room.id}</h1>
          <ShareIcon />
        </Row>
      </UnstyledButton>

      <Column>
        <h2>Players:</h2>
        <PlayerNicknameLabel
          isOwner={room.player.isOwner}
          nickname={room.player.nickname}
          position={1}
          isClient
        />
        {room.opponents.map((opponent, index) => (
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
          {room.opponents.length >= 3
            ? "Waiting for game to start..."
            : "Waiting for players to join..."}
        </h2>
        {room.player.isOwner ? (
          <Button
            color={colors.palette_blue}
            onClick={startRoom}
            disabled={room.opponents?.length === 0}
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
