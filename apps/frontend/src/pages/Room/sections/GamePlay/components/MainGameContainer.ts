import styled from "styled-components";

import { Column } from "../../../../../components";

export const MainGameContainer = styled(Column).attrs({ as: "main" })({
  justifyContent: "space-between",
  padding: "16px 0",
  gap: "12px",
  maxWidth: "100%",
  minWidth: "100%",
});
