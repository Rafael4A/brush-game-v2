import { Card as CardInterface } from "shared-types";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import { Player } from "./player.entity";
import { Room } from "./room.entity";

@Entity()
export class Card implements CardInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  image: string;

  @Column()
  suit: string;

  @Column()
  value: string;

  @ManyToOne(() => Room, (room) => room.cards, { onDelete: "CASCADE" })
  room: Room;

  @ManyToOne(() => Player, (player) => player.cards, { onDelete: "CASCADE" })
  player: Player;
}
