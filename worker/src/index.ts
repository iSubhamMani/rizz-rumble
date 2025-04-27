import dotenv from "dotenv";
import RedisService from "./services/Redis";
import AiService from "./services/AiService";
dotenv.config();

const redis = new RedisService();
const ai = new AiService();

async function listenToJudgeQueue() {
  while (true) {
    const message = await redis.Queue.blpop("game:judgeQueue", 0);
    if (message) {
      const matchId = message[1];
      const matchDetails = await redis.Store.get(matchId);

      if (!matchDetails) {
        console.log("Match not found in store");
        continue;
      }

      const parsedMatchDetails = JSON.parse(matchDetails);
      const { currentRound, roundDetails, players } = parsedMatchDetails;

      const res = await ai.judgeRound(roundDetails[currentRound]);
      console.log("Round winner:", res);
    }
  }
}

listenToJudgeQueue();
