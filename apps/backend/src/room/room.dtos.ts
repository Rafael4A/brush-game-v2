import {
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsString,
  Length,
} from "class-validator";

import {
  CardCode,
  KickPlayerDto,
  NewRoomDto,
  PlayCardDto,
  StartGameDto,
} from "shared-code";

export class ValidNewRoomDto implements NewRoomDto {
  @IsNotEmpty({ message: "Player nickname is required" })
  @IsString({ message: "Player nickname must be a string" })
  @Length(2, 20, {
    message: "Player nickname must be between 2 and 20 characters",
  })
  nickname: string;
}

export class ValidStartGameDto implements StartGameDto {
  @IsNotEmpty({ message: "Player id is required" })
  @IsString({ message: "Player id must be a string" })
  playerId: string;
}

export class ValidPlayCardDto implements PlayCardDto {
  @IsNotEmpty({ message: "Player id is required" })
  @IsString({ message: "Player id must be a string" })
  playerId: string;

  @IsNotEmpty({ message: "Card code is required" })
  @IsString({ message: "Card code must be a string" })
  cardCode: CardCode;

  @IsArray({ message: "Table card codes must be an array" })
  @ArrayUnique({ message: "Table card codes must be unique" })
  @IsString({
    each: true,
    message: "Each table card code in the array must be a string",
  })
  tableCardCodes: CardCode[];
}

export class ValidKickPlayerDto implements KickPlayerDto {
  @IsNotEmpty({ message: "Player id is required" })
  @IsString({ message: "Player id must be a string" })
  playerId: string;

  @IsNotEmpty({ message: "Kicked player nickname is required" })
  @IsString({ message: "Kicked player nickname must be a string" })
  kickedPlayerNick: string;
}
