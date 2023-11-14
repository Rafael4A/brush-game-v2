import { Player as PlayerInterface } from "shared-types";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import { Room } from "./room.entity";

export type DBPlayer = Omit<PlayerInterface, "cards" | "collectedCards"> & {
  cards: string[];
  collectedCards: string[];
};

@Entity()
export class Player implements DBPlayer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text", { array: true, default: [] })
  cards: string[];
  @Column()
  nickname: string;

  @Column("text", { array: true, default: [] })
  collectedCards: string[];

  @Column({ default: 0 })
  currentBrushCount: number;

  @Column({ default: 0 })
  previousPoints: number;

  @Column({ default: false })
  isOwner: boolean;

  @ManyToOne(() => Room, (room) => room.players, { onDelete: "CASCADE" })
  room: Room;
}
