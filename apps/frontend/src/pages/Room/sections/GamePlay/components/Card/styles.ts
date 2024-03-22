import styled from "styled-components";

import { Rotation } from "./types";

interface CardContainerProps {
  isSelected: boolean;
  isPersonalCard: boolean;
  rotation: Rotation;
}

export const CardContainer = styled.button<CardContainerProps>(
  ({ theme, isSelected, isPersonalCard, rotation }) => ({
    background: "none",
    position: "relative",
    maxWidth: "calc(50% - 4px) ",
    display: "flex",
    flexShrink: 1,
    transition: "transform 0.1s",
    transform: transformations(isPersonalCard, isSelected, false, rotation),
    border: "6px solid transparent",
    borderRadius: "7%",
    ...(isSelected && {
      borderColor: theme.colors.palette.orange,
      zIndex: 5,
    }),

    "&:hover": {
      transform: transformations(isPersonalCard, isSelected, true, rotation),
    },

    "& img": {
      margin: 0,
      height: "100%",
      width: "100%",
    },

    "&.card-exit": {
      opacity: 1,
      transition: "opacity 1500ms ease-out",
    },

    "&.card-exit-active": {
      opacity: 0,
      transition: "opacity 1500ms ease-out",
    },
  })
);

function transformations(
  isPersonalCard: boolean,
  isSelected: boolean,
  onHover: boolean,
  rotation: Rotation
) {
  let total = "";

  if (rotation === Rotation.Right) {
    total += "translate(-15%, 0) ";
    total += "rotateZ(10deg) ";
  } else if (rotation === Rotation.Left) {
    total += "translate(15%, 0) ";
    total += "rotateZ(-10deg) ";
  } else if (rotation === Rotation.Middle) {
    total += "translate(0, -5%) ";
  }

  if (isPersonalCard) {
    if (isSelected) {
      total += "translate(0, -5%) ";
    } else {
      total += "translate(0, 00%) ";
    }
  }

  if (isSelected) {
    total += "scale(1.04)";
  } else if (onHover) {
    total += "scale(1.055)";
  }

  return total;
}
