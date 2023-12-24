import { useId, useState } from "react";

import { Helmet } from "react-helmet-async";
import { useTheme } from "styled-components";

import { CardsPlayingIcon } from "../../assets/icons";
import {
  Button,
  Column,
  MainContainer,
  Row,
  TextInput,
  Tooltip,
} from "../../components";
import { useQueryParams } from "../../hooks";
import { useEditNickname, useJoinRoom, useCreateRoom } from "./hooks";
import { Title } from "./styles";

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
  const { joinRoom } = useJoinRoom();
  const { createRoom } = useCreateRoom();

  const handleJoinRoom = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    joinRoom(nickname, roomId);
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
          <CardsPlayingIcon width="48px" height="48px" />
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
                  id={nicknameId}
                  placeholder="Your Nickname"
                  value={editableNickname}
                  onChange={onNicknameChange}
                />
              ) : (
                <span style={{ padding: "4px 0" }}>{nickname}</span>
              )}
            </Row>
            <Button fullWidth color={theme.colors.palette_violet} type="submit">
              {isEditingNick ? "Save nickname" : "Edit nickname"}
            </Button>
          </Column>

          <Column gap="8px" fullWidth as="form" onSubmit={handleJoinRoom}>
            <Row gap="8px" fullWidth>
              <label style={{ whiteSpace: "nowrap" }} htmlFor={nicknameId}>
                Room ID:
              </label>
              <TextInput
                id={nicknameId}
                placeholder="Ask your friend or create a room"
                value={roomId}
                onChange={({ target }) => setRoomId(target.value)}
              />
            </Row>
            <Button
              fullWidth
              color={theme.colors.palette_light_cyan}
              disabled={!hasValidNickname || !roomId}
              type="submit"
            >
              Join room
            </Button>
          </Column>

          <Button
            fullWidth
            color={theme.colors.palette_blue}
            style={{ marginTop: "12px" }}
            disabled={!hasValidNickname}
            onClick={() => createRoom(nickname)}
          >
            Create new room
          </Button>
        </Column>
      </MainContainer>
    </>
  );
}
