import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Room } from "../room/entities";

@Injectable()
export class CronService {
  constructor(
    @InjectRepository(Room) private roomRepository: Repository<Room>
  ) {}

  private logger: Logger = new Logger("CronService");

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async deleteOldGamesJob() {
    const now = new Date();
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const dateDiff = new Date(now.getTime() - thirtyDaysInMs);

    const { affected } = await this.roomRepository
      .createQueryBuilder()
      .delete()
      .from(Room)
      .where("creationDate < :date", { date: dateDiff })
      .execute();

    this.logger.log(`${affected} rooms deleted`);
  }
}
