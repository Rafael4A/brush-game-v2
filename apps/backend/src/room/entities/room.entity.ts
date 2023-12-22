import { CardCode, GameState } from "shared-types";
import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";

import { CARDS_CODES } from "../../resources";
import { Room as RoomInterface } from "../room.interface";
import { Player } from "./player.entity";

@Entity()
export class Room implements RoomInterface {
  @PrimaryColumn({ length: 6 })
  id: string;

  @Column({ default: new Date() })
  creationDate: Date;

  @Column("text", { array: true, default: CARDS_CODES })
  cards: CardCode[];

  @Column("text", { array: true, default: [] })
  table: CardCode[];

  @OneToMany(() => Player, (player) => player.room, {
    cascade: true,
    onDelete: "CASCADE",
  })
  players: Player[];

  @Column({ default: "" })
  firstPlayerIndex: string;

  @Column({ default: "" })
  currentTurn: string;

  @Column({ default: GameState.WaitingForPlayers })
  gameState: GameState;
}
