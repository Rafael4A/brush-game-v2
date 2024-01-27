import { CardCode, Player as PlayerInterface } from "shared-code";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import { Room } from "./room.entity";

@Entity()
export class Player implements PlayerInterface {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text", { array: true, default: [] })
  cards: CardCode[];
  @Column()
  nickname: string;

  @Column("text", { array: true, default: [] })
  collectedCards: CardCode[];

  @Column({ default: 0 })
  currentBrushCount: number;

  @Column({ default: 0 })
  previousPoints: number;

  @Column({ default: false })
  isOwner: boolean;

  @ManyToOne(() => Room, (room) => room.players, { onDelete: "CASCADE" })
  room: Room;
}
