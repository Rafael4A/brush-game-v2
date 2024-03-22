import styled from "styled-components";

import { Column, Row } from "../../../../components";

export const ButtonsContainer = styled(Row)({
  marginTop: "16px",
  gap: "16px",
});

export const Divider = styled.span({
  margin: "4px 0",
  height: "2px",
  width: "100%",
  backgroundColor: "#fff",
});

export const FullReportContainer = styled(Column)({
  gap: "16px",

  marginBottom: " 40px",
});

export const LoaderContainer = styled(Column)({
  width: "350px",
  maxWidth: "90vw",
});
