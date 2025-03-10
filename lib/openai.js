import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

export const client = new OpenAI({
  apiKey: process.env.TOGETHER_API_KEY,
  baseURL: "https://api.together.xyz/v1",
});