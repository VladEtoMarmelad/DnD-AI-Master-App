import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import axios from 'axios';

export async function POST(req: Request) {
    console.log("reqJson:",await req.json())
    const { messages, id } = await req.json();

    console.log(JSON.stringify(messages, null, 4))
    console.log(`messagesLength: ${messages.length}`)

    let result = streamText({
        model: groq("gemma2-9b-it"),
        // messages: [
        //     ...messages,
        //     // {
        //     //     "role": "system",
        //     //     "content": "",   
        //     // }
        // ],
        prompt: //сокращённая прошедшая история
        messages: [
            messages[messages.length-1] //вроде то, что ввёл пользователь
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

    console.log("Cleaned text:", cleaned)

    const data = {
        aiContent: ,
        fullStory: ,
        id: id
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