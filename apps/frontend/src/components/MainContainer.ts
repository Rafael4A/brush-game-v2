import styled from "styled-components";

import { Column } from "./FlexBoxes";

export const MainContainer = styled(Column)(({ theme }) => ({
  minHeight: "100dvh",
  width: "100%",
  maxWidth: "100%",
  justifyContent: "flex-start",
  backgroundColor: theme.colors.main.background,
  padding: "4px 16px 0",
  gap: "16px",
}));
