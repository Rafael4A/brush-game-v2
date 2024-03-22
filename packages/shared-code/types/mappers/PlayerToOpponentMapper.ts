import { Opponent, Player } from "../player";

export class PlayerToOpponentMapper {
  static map(player: Player): Opponent {
    return {
      nickname: player.nickname,
      previousPoints: player.previousPoints,
      isOwner: player.isOwner,
    };
  }
}
