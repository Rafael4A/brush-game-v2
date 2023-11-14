import { GameState } from "shared-types";
import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";

import { CARDS_CODES } from "../../resources";
import { Room as RoomInterface } from "../room.interface";
import { DBPlayer, Player } from "./player.entity";

export type DBRoom = Omit<RoomInterface, "cards" | "table" | "players"> & {
  cards: string[];
  table: string[];
  players: DBPlayer[];
};

@Entity()
export class Room implements DBRoom {
  @PrimaryColumn({ length: 6 })
  id: string;

  @Column({ default: new Date() })
  creationDate: Date;

  @Column("text", { array: true, default: CARDS_CODES })
  cards: string[];

  @Column("text", { array: true, default: [] })
  table: string[];

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
