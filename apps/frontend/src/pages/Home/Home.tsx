import { useId, useState } from "react";

import { Helmet } from "react-helmet-async";
import { useTheme } from "styled-components";

import {
  Button,
  Column,
  LoadingButton,
  MainContainer,
  Row,
  TextInput,
  Tooltip,
} from "../../components";
import { useQueryParams } from "../../hooks";
import { useEditNickname, useJoinRoom, useCreateRoom } from "./hooks";
import { NicknameLabel, RoomIdLabel, Title } from "./styles";
import Icon from "@mdi/react";
import { mdiCardsPlaying } from "@mdi/js";
import { useLocalRoom, usePlayerId, useRoom } from "../../context";
import {
  CARDS_CODES,
  GameState,
  Room,
  randomInt,
  shuffleCards,
  startGame,
} from "shared-code";
import {
  LOCAL_COMPUTER_ID,
  LOCAL_PLAYER_ID,
  LOCAL_ROOM_ID,
  ROUTES,
} from "../../resources/constants";
import { useNavigate } from "react-router-dom";

export function HomeScreen() {
  const componentId = useId();
  const nicknameId = `${componentId}-nickname-input`;

  const theme = useTheme();

  const {
    editableNickname,
    isEditingNick,
    nickname,
    onNicknameChange,
    saveOrEditNickname,
    hasValidNickname,
  } = useEditNickname();

  const { roomId: routeRoomId } = useQueryParams();
  const [roomId, setRoomId] = useState(routeRoomId ?? "");
  const { joinRoom, isLoading: isLoadingJoin } = useJoinRoom();
  const { createRoom, isLoading: isLoadingCreate } = useCreateRoom();
  const [, setLocalRoom] = useLocalRoom();
  const [, setPlayerId] = usePlayerId();
  const navigate = useNavigate();

  const handleJoinRoom = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    joinRoom(nickname, roomId);
  };

  const handlePlayOffline = () => {
    const players = [
      {
        cards: [],
        nickname: nickname,
        collectedCards: [],
        currentBrushCount: 0,
        id: LOCAL_PLAYER_ID,
        isOwner: true,
        previousPoints: 0,
      },
      {
        cards: [],
        nickname: "Computer 1",
        collectedCards: [],
        currentBrushCount: 0,
        id: LOCAL_COMPUTER_ID,
        isOwner: false,
        previousPoints: 0,
      },
    ];

    const startingPlayerNick = players[randomInt(0, players.length)].nickname;

    const newRoom: Room = {
      cards: shuffleCards(CARDS_CODES),
      players: players,
      table: [],
      creationDate: new Date(),
      gameState: GameState.WaitingForPlayers,
      id: LOCAL_ROOM_ID,
      currentTurn: startingPlayerNick,
      firstPlayerNick: startingPlayerNick,
    };

    const startedRoom = startGame(newRoom, LOCAL_PLAYER_ID);

    console.log(startedRoom);

    setPlayerId(LOCAL_PLAYER_ID);
    setLocalRoom(startedRoom);
    navigate(ROUTES.LOCAL_GAME);
  };

  return (
    <>
      <Helmet>
        <title>Home - Brush Game</title>
        <meta name="description" content="Brush card game" />
      </Helmet>
      <MainContainer>
        <Title>
          Brush
          <Icon path={mdiCardsPlaying} size={2} />
        </Title>

        <Column gap="8px" alignItems="flex-start" width="min(550px, 90vw)">
          <Row fullWidth>
            <Tooltip
              width="200px"
              visible={!nickname && !!roomId}
              direction="top"
              text="You need a nickname to join a room"
            />
          </Row>

          <Column gap="8px" fullWidth as="form" onSubmit={saveOrEditNickname}>
            <Row gap="8px" fullWidth justifyContent="flex-start">
              <label htmlFor={nicknameId}>Nickname:</label>
              {isEditingNick ? (
                <TextInput
                  autoComplete="false"
                  data-lpignore="true"
                  data-form-type="other"
                  id={nicknameId}
                  placeholder="Your Nickname"
                  value={editableNickname}
                  onChange={onNicknameChange}
                />
              ) : (
                <NicknameLabel>{nickname}</NicknameLabel>
              )}
            </Row>
            <Button fullWidth color={theme.colors.palette_violet} type="submit">
              {isEditingNick ? "Save nickname" : "Edit nickname"}
            </Button>
          </Column>

          <Column gap="8px" fullWidth as="form" onSubmit={handleJoinRoom}>
            <Row gap="8px" fullWidth>
              <RoomIdLabel htmlFor={nicknameId}>Room ID:</RoomIdLabel>
              <TextInput
                autoComplete="false"
                data-lpignore="true"
                data-form-type="other"
                id={nicknameId}
                placeholder="Ask your friend or create a room"
                value={roomId}
                onChange={({ target }) => setRoomId(target.value)}
              />
            </Row>
            <LoadingButton
              isLoading={isLoadingJoin}
              fullWidth
              color={theme.colors.palette_light_cyan}
              disabled={!hasValidNickname || !roomId}
              type="submit"
            >
              Join room
            </LoadingButton>
          </Column>

          <Column fullWidth gap="12px" style={{ marginTop: "12px" }}>
            <LoadingButton
              isLoading={isLoadingCreate}
              fullWidth
              color={theme.colors.palette_blue}
              disabled={!hasValidNickname}
              onClick={() => createRoom(nickname)}
            >
              Create new room
            </LoadingButton>

            <Button
              fullWidth
              color={theme.colors.palette_dark_blue}
              onClick={handlePlayOffline}
            >
              Play Offline
            </Button>

            <Button fullWidth color={theme.colors.palette_dark_blue}>
              Tutorial
            </Button>
          </Column>
        </Column>
      </MainContainer>
    </>
  );
}
