import styled from "styled-components";

import { Row, Column } from "../FlexBoxes";

export const StyledModal = styled.dialog(({ theme }) => ({
  position: "fixed",
  zIndex: 1000,
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",

  padding: 0,
  borderRadius: 16,
  borderWidth: 0,

  width: "calc(100% - 16px)",
  maxWidth: 850,
  backgroundColor: theme.colors.backgroundDarkGreen,
  "&::backdrop": {
    background: "rgba(0, 0, 0, 0.7)",
  },
}));

export const ModalTopBar = styled(Row)({
  padding: "6px",
  fontSize: "1.25rem",
});

export const ModalContainer = styled(Column)({
  padding: 8,
  paddingTop: 0,
  gap: "8px",
});

export const ModalFooter = styled(Row)({
  paddingTop: 16,
  gap: 8,
});

export const OptionContainer = styled(Row)({
  gap: 8,
  width: "80%",

  "& > *": {
    width: "100%",
    flexGrow: 1,
    height: "100%",
  },

  "& > label": {
    width: "auto",
    flexShrink: 0,
  },
});
