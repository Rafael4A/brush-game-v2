import styled, { StyledObject } from "styled-components";

export const LineLoader = styled.div({
  width: "100%",
  height: "4.8px",
  display: "inline-block",
  position: "relative",
  overflow: "hidden",

  "&::after": {
    content: "''",
    width: "96px",
    height: "4.8px",
    background: "#fff",
    position: "absolute",
    top: 0,
    left: 0,
    boxSizing: "border-box",
    animation: "hitZak 1s cubic-bezier(0.5, 1, 0.5, 0) infinite alternate",
  },

  "@keyframes hitZak": {
    from: {
      left: 0,
      transform: "translateX(-100%)",
    },
    to: {
      left: "100%",
      transform: "translateX(0%)",
    },
  } as StyledObject,
});
