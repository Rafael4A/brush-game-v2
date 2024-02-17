import styled from "styled-components";

export const CardsGrid = styled.div({
  display: "grid",
  gridTemplateColumns: `repeat( auto-fill, minmax(100px, 1fr))`,
  justifyItems: "center",
  gap: "8px",
  width: "calc(100vw - 32px)",
  maxWidth: "550px",
});
