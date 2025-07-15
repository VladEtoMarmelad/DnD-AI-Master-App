import axios from "axios";
import { configDotenv } from "dotenv";

configDotenv()

export const textToSpeech = async (text: string) => {
    const data = {
        "voice": "elowen",
        "text": text,
        "model": "blizzard",
        "language": "auto",
        "format": "mp3",
        "sample_rate": 24000,
        "seed": 123,
        "top_p": 0.8,
        "temperature": 1
    }

    const response = await axios.post("https://api.lmnt.com/v1/ai/speech", data, {
        headers: {
            "X-API-Key": process.env.LMNT_API_KEY, 
            "Content-Type": "application/json"
        }
    })

    return response.data
}