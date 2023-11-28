import styled from "styled-components";

import { Column } from "../../../../../components";

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
