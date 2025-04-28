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
            - If both responses are exactly the same, declare player 1 as the winner. Give reason that both responses are the same.
            - If both responses are out of context, set winner to empty string "" and give reason that both responses are out of context.
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

    if (response.text) {
      return JSON.parse(response.text.replace(/```json\s*|\s*```/g, ""));
    }

    return null;
  }

  public async generateChallenge() {
    const prompt = `
      You are a problem setter in a 1v1 prompt battle game.
     Your task is to generate a short, creative topic (max 5-7 words) that can challenge two users to write the best possible prompt. 
     The topic should cover a wide range of ideas (e.g., fantasy, science, technology, emotions, survival) and be open-ended enough to allow for imaginative prompt-writing.

     Structure the response strictly in this exact JSON format:
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
