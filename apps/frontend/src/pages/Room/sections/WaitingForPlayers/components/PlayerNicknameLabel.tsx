import { mdiAccountRemove, mdiCrown } from "@mdi/js";
import Icon from "@mdi/react";
import { useTheme } from "styled-components";

import { HoverTooltip, Row, UnstyledButton } from "../../../../../components";
import { useKickPlayer } from "../hooks";

interface PlayerNicknameLabelProps {
  nickname: string;
  position: number;
  isOwner: boolean;
  isClient?: boolean;
  isKickable?: boolean;
}

export function PlayerNicknameLabel({
  nickname,
  position,
  isOwner,
  isClient,
  isKickable,
}: Readonly<PlayerNicknameLabelProps>) {
  const { colors } = useTheme();
  const { kickPlayer } = useKickPlayer();

  const handleClick = () => kickPlayer(nickname);
  return (
    <Row gap="6px">
      {position}.
      <span
        style={{
          textDecoration: isClient
            ? `underline solid ${colors.palette.lightBlue} 3px`
            : undefined,
        }}
      >
        {nickname}
      </span>
      {isOwner && <Icon path={mdiCrown} size={1} />}
      {isKickable && (
        <HoverTooltip>
          <UnstyledButton onClick={handleClick}>
            <Icon
              path={mdiAccountRemove}
              size={1}
              aria-label="kick player icon"
            />
          </UnstyledButton>
          <span>Click to kick this player</span>
        </HoverTooltip>
      )}
    </Row>
  );
}
