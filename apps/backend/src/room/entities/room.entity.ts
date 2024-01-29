import {
  CARDS_CODES,
  CardCode,
  GameState,
  Room as RoomInterface,
} from "shared-code";
import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";

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
  firstPlayerNick: string;

  @Column({ default: "" })
  currentTurn: string;

  @Column({ default: GameState.WaitingForPlayers })
  gameState: GameState;
}
