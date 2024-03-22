import styled, { StyledObject } from "styled-components";

import { Row, Column, UnstyledButton } from "../../../../../../components";

export const HeaderContainer = styled(Row)({
  marginTop: "16px",
  width: "100%",
});

export const RoomTitleContainer = styled(Column)({
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
});

export const ReactionsMenuWrapper = styled(Column)({ position: "relative" });

export const ReactionsContainer = styled(Column)({
  position: "absolute",
  top: "27px",
  zIndex: 10,
  backgroundColor: "black",
  borderRadius: "8px",
  padding: "6px",
});

export const ReactionButton = styled(UnstyledButton)({
  fontSize: "2rem",
  "&:disabled": {
    "&::after": {
      fontSize: "2.2rem",
      content: "'X'",
      position: "absolute",
      color: "red",
      width: "100%",
      left: 0,
    },
  },
} as StyledObject);
