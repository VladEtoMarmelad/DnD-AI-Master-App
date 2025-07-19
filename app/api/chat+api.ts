import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import axios from 'axios';

export async function POST(req: Request) {
    const { messages, gameId } = await req.json();

    const game = await axios.get(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000`, {
        params: {gameId}
    })

    let result = streamText({
        model: groq("compound-beta"),
        messages: [
            {
                role: "system",
                content: `
                    Вот сокращённая версия всех ранее произошедших событий партии: ${game.data.full_story}. 
                    Ты должен остоваться в каноне прошлых событий.
                    Ты не должен при каждом вопросе описывать все произошедшие события.
                    Ты должен продолжать историю на основе происходящих событий.

                    Ты должен предлагать варианты действий либо просить игрока предоставить свои варианты.
                    Всегда, когда на действие требуется определённое мастерство ты должен посчитать вероятность успеха из рандомной цифры из брощеного кубика Д20 и характеристик персонажа и описывать неудачу
                `
            },
            messages[messages.length-1], //последнее сообщение пользователя
        ]
    });

    const dataResponse = await result.toDataStreamResponse({
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Encoding': 'none'
        }
    });

    const fullText: string = await dataResponse.text();

    let cleaned: string = fullText
        .replace(/f:{.*?}\n/, '') // Удалить мета-данные
        .replace(/e:{.*?}\n/, '') // Удалить usage
        .replace(/d:{.*?}\n/, '') // Удалить usage
        .replace(/(?:\d+:")|(?:",?$)/gm, '') // Удалить ключи и кавычки
        .replace(/\r?\n/g, '') // Удалить переносы строк
        .replace(/\\n/g, '') // Удалить \n
        .replace(/\\"/g, '"') // Преобразовать экранированные кавычки

    const data = {
        fullStory: cleaned,
        id: gameId
    }

    axios.put(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/update`, data, {
		headers: {
			"Content-Type": "application/json"
		}
    })

    return result.toDataStreamResponse({
        headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Encoding': 'none',
        },
    });
}