import { mdiCrown } from "@mdi/js";
import Icon from "@mdi/react";
import { useTheme } from "styled-components";

import { Row } from "../../../../../components";

interface PlayerNicknameLabelProps {
  nickname: string;
  position: number;
  isOwner: boolean;
  isClient?: boolean;
}

export function PlayerNicknameLabel({
  nickname,
  position,
  isOwner,
  isClient,
}: Readonly<PlayerNicknameLabelProps>) {
  const { colors } = useTheme();

  return (
    <Row gap="6px">
      {position}.
      <span
        style={{
          textDecoration: isClient
            ? `underline solid ${colors.light_blue} 3px`
            : undefined,
        }}
      >
        {nickname}
      </span>
      {isOwner && <Icon path={mdiCrown} size={1} />}
    </Row>
  );
}
