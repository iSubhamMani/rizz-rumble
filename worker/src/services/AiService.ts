import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
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
            - Only one player can win. No ties allowed.
            - Be strictly objective.
            - After analyzing, output the winning player's ID and a short reason for your decision (2-3 sentences).

            Here is the information:

            Challenge Topic:
            ${challenge}

            Player 1 ID: ${player1Id}
            Player 1 Response:
            ${player1Response}

            Player 2 ID: ${player2Id}
            Player 2 Response:
            ${player2Response}

            Now determine the winner. Respond in this exact JSON format:
            {
            "winner": "player_id here",
            "reason": "your brief reason here"
            }
        `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    return response.text;
  }
}

export default AiService;
