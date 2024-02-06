import { useState } from "react";
import { useConfirmModal, useLocalRoom, usePlayerId } from "../../context";
import { useCreateRoom, useEditNickname, useJoinRoom } from "./hooks";
import { useQueryParams } from "../../hooks";
import { useNavigate } from "react-router-dom";
import {
  LOCAL_COMPUTER_ID,
  LOCAL_COMPUTER_NICK,
  LOCAL_PLAYER_ID,
  LOCAL_ROOM_ID,
  ROUTES,
} from "../../resources/constants";
import {
  CARDS_CODES,
  GameState,
  Room,
  randomInt,
  shuffleCards,
  startGame,
} from "shared-code";

export function useHomePage() {
  const { confirm } = useConfirmModal();

  const { roomId: routeRoomId } = useQueryParams();
  const [roomId, setRoomId] = useState(routeRoomId ?? "");
  const { joinRoom, isLoading: isLoadingJoin } = useJoinRoom();
  const { createRoom, isLoading: isLoadingCreate } = useCreateRoom();
  const [, setLocalRoom] = useLocalRoom();
  const [, setPlayerId] = usePlayerId();
  const navigate = useNavigate();
  const {
    editableNickname,
    isEditingNick,
    nickname,
    onNicknameChange,
    saveOrEditNickname,
    hasValidNickname,
  } = useEditNickname();

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
        nickname: LOCAL_COMPUTER_NICK,
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

    setPlayerId(LOCAL_PLAYER_ID);
    setLocalRoom(startedRoom);
    navigate(ROUTES.LOCAL_GAME);
  };

  const handleStartTutorial = () => {
    // TODO FAZER WIZARD DE TUTORIAL
    confirm({
      id: "Start Tutorial",
      actions: [
        {
          label: "Sim",
          type: "close-button",
          onClick: () => {
            navigate(ROUTES.TUTORIAL);
          },
        },
        { label: "Não", type: "close-button" },
      ],
      content: () => "Tem certeza que deseja apagar esse jogo?",
      title: "How to play",
    });
  };

  return {
    roomId,
    setRoomId,
    handleJoinRoom,
    isLoadingJoin,
    createRoom,
    isLoadingCreate,
    handlePlayOffline,
    editableNickname,
    isEditingNick,
    nickname,
    onNicknameChange,
    saveOrEditNickname,
    hasValidNickname,
    handleStartTutorial,
  };
}