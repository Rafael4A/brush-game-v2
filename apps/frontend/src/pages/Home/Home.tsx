import { useId } from "react";

import { mdiCardsPlaying } from "@mdi/js";
import Icon from "@mdi/react";
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
import { TITLE_SUFFIX } from "../../resources/constants";
import { disableAutoCompleteProps } from "../../utils";
import { Tutorial, TutorialProvider, useTutorial } from "./components";
import { NicknameLabel, RoomIdLabel, Title } from "./styles";
import { useHomePage } from "./useHomePage";

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
    handleRoomIdChange,
  } = useHomePage();
  const { open } = useTutorial();

  return (
    <>
      <Helmet>
        <title>Home - {TITLE_SUFFIX}</title>
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
            <Button fullWidth color={colors.palette.violet} type="submit">
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
                onChange={handleRoomIdChange}
              />
            </Row>
            <LoadingButton
              isLoading={isLoadingJoin}
              fullWidth
              color={colors.palette.lightCyan}
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
              color={colors.palette.cyanCobalt}
              disabled={!hasValidNickname}
              onClick={() => createRoom(nickname)}
            >
              Create new room
            </LoadingButton>

            <Button
              fullWidth
              color={colors.palette.coolBlack}
              onClick={handlePlayOffline}
            >
              Play Offline
            </Button>

            <Button fullWidth color={colors.palette.outerSpace} onClick={open}>
              Start Tutorial
            </Button>
          </Column>
        </Column>
      </MainContainer>
      <Tutorial />
    </>
  );
}

export function Component() {
  return (
    <TutorialProvider>
      <InnerHomeScreen />
    </TutorialProvider>
  );
}
Component.displayName = "HomeScreen";
