import { mdiShareVariant } from "@mdi/js";
import Icon from "@mdi/react";
import { useTheme } from "styled-components";

import {
  Column,
  LineLoader,
  LoadingButton,
  Row,
  UnstyledButton,
} from "../../../../components";
import { useRoom } from "../../../../context";
import { shareRoom } from "../../../../utils";
import { PlayerNicknameLabel } from "./components";
import { useStartRoom } from "./hooks";
import { WaitingForPlayersContainer } from "./styles";

const OPPONENT_INDEX_OFFSET = 2;

export function WaitingForPlayers() {
  const [roomData] = useRoom();
  const room = roomData!;
  const handleShare = () => shareRoom(room.id);

  const { colors } = useTheme();

  const { startRoom, isLoading } = useStartRoom();

  return (
    <WaitingForPlayersContainer>
      <UnstyledButton onClick={handleShare}>
        <Row gap="8px">
          <h1>Room {room.id}</h1>
          <Icon path={mdiShareVariant} size={1} />
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
            isKickable={room.player.isOwner}
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
          <LoadingButton
            isLoading={isLoading}
            color={colors.palette_blue}
            onClick={startRoom}
            disabled={room.opponents?.length === 0}
          >
            Start game
          </LoadingButton>
        ) : (
          <Row width="min(90vw, 400px)">
            <LineLoader />
          </Row>
        )}
      </Column>
    </WaitingForPlayersContainer>
  );
}
