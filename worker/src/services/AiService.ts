import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import RedisService from "./Redis";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });

interface IResponse {
  player_id: string;
  response: string;
}

export interface IRoundDetails {
  challenge: string;
  responses: Record<string, IResponse>;
  winner: string | null;
}

class AiService {
  constructor(private redis: RedisService) {}

  public async judgeRound(roundDetails: IRoundDetails) {
    const { challenge, responses } = roundDetails;
    const player1Response = Object.values(responses)[0].response;
    const player1Id = Object.values(responses)[0].player_id;
    const player2Response = Object.values(responses)[1].response;
    const player2Id = Object.values(responses)[1].player_id;

    const prompt = `
            You are a judge in a 1v1 prompt battle game.
            Two players have written their responses to a given challenge topic.
            Each response has the player_id and their response to the challenge.
            Your task is to carefully read both responses and objectively select the better one based on the following criteria:
            - Relevance to the challenge topic
            - Creativity and originality
            - Clarity and coherence
            - Overall quality of writing

            Rules:
            - Be strictly objective.
            - After analyzing, output the winning player's ID and a short reason for your decision (2-3 sentences).
            - If both responses are exactly the same or out of context, set winner to "none". Give reason for the same.
            - Do not include any additional text or explanations outside of the JSON format.

            Here is the information:

            Challenge Topic:
            ${challenge}

            Player 1 ID: ${player1Id}
            Player 1 Response:
            ${player1Response}

            Player 2 ID: ${player2Id}
            Player 2 Response:
            ${player2Response}

            Now determine the winner. Use the player ids given above for the winner field.
            For the reason field don't include any statement like "Player 2's response is more relevant" or even their ids. Just provide a brief reason for your decision.
            Respond in this exact JSON format:
            {
            "winner": "player_id here",
            "reason": "brief reason here without referring to player numbers or IDs"
            }

            Example:
            {
              "winner": "123645",
              "reason": Response was more creative and relevant to the challenge topic."
            }
        `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    if (response.text) {
      return JSON.parse(response.text.replace(/```json\s*|\s*```/g, ""));
    }

    return null;
  }

  public async generateChallenge(matchId: string) {
    // fetch previous challenges
    const match = await this.redis.Store.get(matchId);

    if (!match) {
      console.log("Match not found in store");
      return null;
    }

    const parsedMatch = JSON.parse(match);
    const { roundDetails } = parsedMatch;
    const previousChallenges: string[] = [];

    for (const round of Object.keys(roundDetails)) {
      const roundDetail = roundDetails[round];
      if (roundDetail.challenge) {
        previousChallenges.push(roundDetail.challenge);
      }
    }

    const prompt = `
      You are a challenge designer for a 1v1 prompt battle game.

      Your task is to generate a short, creative topic (5-7 words max) that will challenge users to write the best **prompt** — not a story — based on that topic.

      The topic should:
      - Encourage users to write creative, useful, or thought-provoking prompts.
      - Be grounded in real-life or practical scenarios (e.g., productivity, creativity, learning, tools, social situations).
      - Avoid fantasy tropes or storytelling themes.
      - Be simple, clear, and non-technical.
      - NOT be a story starter or contain characters, plots, or magical events.

      Avoid generating topics similar to:
      ${previousChallenges.join(", ")}

      Return only in this JSON format:
      {
        "newChallenge": "the generated topic"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    if (response.text) {
      const result = response.text.replace(/```json\s*|\s*```/g, "");
      console.log("Generated challenge: ", result);
      const parsed = JSON.parse(result);
      console.log("Parsed challenge: ", parsed);
      return parsed;
    }

    return null;
  }
}

export default AiService;
