import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigration1708117769868 implements MigrationInterface {
    name = 'FirstMigration1708117769868'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "player" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cards" text array NOT NULL DEFAULT '{}', "nickname" character varying NOT NULL, "collectedCards" text array NOT NULL DEFAULT '{}', "currentBrushCount" integer NOT NULL DEFAULT '0', "previousPoints" integer NOT NULL DEFAULT '0', "isOwner" boolean NOT NULL DEFAULT false, "roomId" character varying(6), CONSTRAINT "PK_65edadc946a7faf4b638d5e8885" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room" ("id" character varying(6) NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT '"2024-02-16T21:09:30.158Z"', "cards" text array NOT NULL DEFAULT '{AS,2S,3S,4S,5S,6S,7S,JS,QS,KS,AD,2D,3D,4D,5D,6D,7D,JD,QD,KD,AC,2C,3C,4C,5C,6C,7C,JC,QC,KC,AH,2H,3H,4H,5H,6H,7H,JH,QH,KH}', "table" text array NOT NULL DEFAULT '{}', "firstPlayerNick" character varying NOT NULL DEFAULT '', "currentTurn" character varying NOT NULL DEFAULT '', "gameState" character varying NOT NULL DEFAULT 'WaitingForPlayers', CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "player" ADD CONSTRAINT "FK_145fea442eb4b687dbc6ebbefe3" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_145fea442eb4b687dbc6ebbefe3"`);
        await queryRunner.query(`DROP TABLE "room"`);
        await queryRunner.query(`DROP TABLE "player"`);
    }

}
