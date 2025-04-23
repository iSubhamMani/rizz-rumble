import { v4 as uuid } from "uuid";
import { MatchModel, MatchStatus } from "../models/Match";
import { connectDB } from "./Db";

class MatchService {
  public async createMatch(player1_id: string, player2_id: string) {
    await connectDB();
    try {
      const matchId = uuid();

      await MatchModel.create({
        matchId,
        users: [player1_id, player2_id],
        rounds: [],
        currentRound: 0,
        status: MatchStatus.WAITING,
        overallWinner: null,
      });

      return matchId;
    } catch {
      return null;
    }
  }
}

export default MatchService;
