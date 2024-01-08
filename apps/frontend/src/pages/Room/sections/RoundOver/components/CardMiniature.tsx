import { useState } from "react";
import { CardCode } from "shared-types";
import { generateAltForCardCode } from "../../../../../utils";

interface CardMiniatureProps {
  cardCode: CardCode;
}
export function CardMiniature({ cardCode }: Readonly<CardMiniatureProps>) {
  const [useDefault, setUseDefault] = useState(true);
  return (
    <img
      width={56}
      height={78}
      src={
        useDefault
          ? "/resources/cards/default_webp/card-back.webp"
          : `/resources/cards/default_webp/${cardCode}.webp`
      }
      onLoad={() => setUseDefault(false)}
      alt={generateAltForCardCode(cardCode)}
      draggable={false}
    />
  );
}
