import { forwardRef, useState } from "react";

import { CardCode } from "shared-code";

import { generateAltForCardCode } from "../../../../../../utils";
import { CardContainer } from "./styles";
import { Rotation } from "./types";

interface CardProps {
  cardCode: CardCode;
  onSelect: (cardCode: CardCode) => void;
  isSelected?: boolean;
  isPersonalCard?: boolean;
  rotation?: Rotation;
  hidden?: boolean;
}

export const Card = forwardRef<HTMLButtonElement, CardProps>(function Card(
  {
    cardCode,
    onSelect,
    isSelected = false,
    isPersonalCard = false,
    rotation = Rotation.Middle,
    hidden = false,
    ...props
  },
  ref
) {
  const [useDefault, setUseDefault] = useState(true);
  return (
    <CardContainer
      ref={ref}
      onClick={() => onSelect(cardCode)}
      isSelected={isSelected}
      isPersonalCard={isPersonalCard}
      rotation={rotation}
      aria-hidden={hidden}
      {...props}
    >
      <img
        width={226}
        height={314}
        src={
          useDefault
            ? "/resources/cards/default_webp/card-back.webp"
            : `/resources/cards/default_webp/${cardCode}.webp`
        }
        onLoad={() => setUseDefault(false)}
        alt={generateAltForCardCode(cardCode)}
        draggable={false}
        aria-hidden={hidden}
      />
    </CardContainer>
  );
});
