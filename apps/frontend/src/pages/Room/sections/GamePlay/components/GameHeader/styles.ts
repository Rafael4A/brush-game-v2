import styled from "styled-components";

import { Row, Column } from "../../../../../../components";

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
