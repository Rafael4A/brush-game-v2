import { useState } from "react";

import { Card as CardInterface } from "shared-types";
import styled from "styled-components";

type Rotation = "left" | "right" | "middle";

interface CardProps {
  card: CardInterface;
  onSelect: (card: CardInterface) => void;
  isSelected?: boolean;
  isPersonalCard?: boolean;
  rotation?: Rotation;
  hidden?: boolean;
}

export function Card({
  card,
  onSelect,
  isSelected = false,
  isPersonalCard = false,
  rotation = "middle",
  hidden = false,
  ...props
}: Readonly<CardProps>) {
  const [useDefault, setUseDefault] = useState(true);
  return (
    <CardContainer
      onClick={() => onSelect(card)}
      isSelected={isSelected}
      isPersonalCard={isPersonalCard}
      rotation={rotation}
      {...props}
      aria-hidden={hidden}
    >
      <img
        width={226}
        height={314}
        src={
          useDefault
            ? "/resources/cards/default_webp/card-back.webp"
            : card.image
        }
        onLoad={() => setUseDefault(false)}
        alt={`${card.value} of ${card.suit}`}
        draggable={false}
        aria-hidden={hidden}
      />
    </CardContainer>
  );
}

interface CardContainerProps {
  isSelected: boolean;
  isPersonalCard: boolean;
  rotation: "left" | "right" | "middle";
}

const CardContainer = styled.button<CardContainerProps>(
  ({ theme, isSelected, isPersonalCard, rotation }) => ({
    background: "none",
    //border: 'none',
    position: "relative",
    maxWidth: "45vw",
    display: "flex",
    flexShrink: 1,
    transition: "transform 0.1s",
    transform: transformations(isPersonalCard, isSelected, false, rotation),
    border: "6px solid transparent",
    borderRadius: "7%",
    ...(isSelected && {
      borderColor: theme.colors.orange,
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

  if (rotation === "right") {
    total += "translate(-15%, 0) ";
    total += "rotateZ(10deg) ";
  } else if (rotation === "left") {
    total += "translate(15%, 0) ";
    total += "rotateZ(-10deg) ";
  } else if (rotation === "middle") {
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
