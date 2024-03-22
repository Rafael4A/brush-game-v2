import styled from "styled-components";

import { Column, Row } from "../../../../components";

export const MainGameContainer = styled(Column).attrs({ as: "main" })({
  justifyContent: "space-between",
  padding: "16px 0",
  gap: "12px",
  maxWidth: "100%",
  minWidth: "100%",
});

export const PlayerCardsContainer = styled(Row)({
  paddingTop: "32px",
  width: "100%",
  justifyContent: "center",
  paddingBottom: "16px",
  maxWidth: "100%",
});

export const TableCardsContainer = styled(Row)({
  gap: "8px",
  flexWrap: "wrap",
  position: "relative",
  minHeight: "10rem",
  width: "100%",
});

export const BrushBanner = styled(Column)({
  height: "10rem",
  position: "absolute",
  width: "100vw",

  "&.brush-banner-enter": {
    opacity: 0,
  },
  "&.brush-banner-enter-active": {
    opacity: 1,
  },
});
