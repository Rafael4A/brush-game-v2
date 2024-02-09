import { useId } from "react";

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

import { NicknameLabel, RoomIdLabel, Title } from "./styles";
import Icon from "@mdi/react";
import { mdiCardsPlaying } from "@mdi/js";

import { disableAutoCompleteProps } from "../../utils";
import { useHomePage } from "./useHomePage";
import { Tutorial, TutorialProvider, useTutorial } from "./components";

function InnerHomeScreen() {
  const componentId = useId();
  const nicknameId = `${componentId}-nickname-input`;
  const { colors } = useTheme();
  const {
    createRoom,
    editableNickname,
    handleJoinRoom,
    handlePlayOffline,
    hasValidNickname,
    isEditingNick,
    isLoadingCreate,
    isLoadingJoin,
    nickname,
    onNicknameChange,
    roomId,
    saveOrEditNickname,
    setRoomId,
  } = useHomePage();
  const { open } = useTutorial();

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
                  {...disableAutoCompleteProps}
                  id={nicknameId}
                  placeholder="Your Nickname"
                  value={editableNickname}
                  onChange={onNicknameChange}
                />
              ) : (
                <NicknameLabel>{nickname}</NicknameLabel>
              )}
            </Row>
            <Button fullWidth color={colors.palette_violet} type="submit">
              {isEditingNick ? "Save nickname" : "Edit nickname"}
            </Button>
          </Column>

          <Column gap="8px" fullWidth as="form" onSubmit={handleJoinRoom}>
            <Row gap="8px" fullWidth>
              <RoomIdLabel htmlFor={nicknameId}>Room ID:</RoomIdLabel>
              <TextInput
                {...disableAutoCompleteProps}
                id={nicknameId}
                placeholder="Ask your friend or create a room"
                value={roomId}
                onChange={({ target }) => setRoomId(target.value)}
              />
            </Row>
            <LoadingButton
              isLoading={isLoadingJoin}
              fullWidth
              color={colors.palette_light_cyan}
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
              color={colors.palette_blue}
              disabled={!hasValidNickname}
              onClick={() => createRoom(nickname)}
            >
              Create new room
            </LoadingButton>

            <Button
              fullWidth
              color={colors.palette_dark_blue}
              onClick={handlePlayOffline}
            >
              Play Offline
            </Button>

            <Button fullWidth color={colors.palette_dark_blue} onClick={open}>
              Start Tutorial
            </Button>
          </Column>
        </Column>
      </MainContainer>
      <Tutorial />
    </>
  );
}

export function HomeScreen() {
  return (
    <TutorialProvider>
      <InnerHomeScreen />
    </TutorialProvider>
  );
}
