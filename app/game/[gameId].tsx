import { generateAPIUrl } from '@/utils/utils';
import { useChat } from '@ai-sdk/react';
import axios from 'axios';
import { createAudioPlayer } from 'expo-audio';
import { useLocalSearchParams } from 'expo-router';
import { fetch as expoFetch } from 'expo/fetch';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const GameScreen = () => {
	const searchParams = useLocalSearchParams();
	const { messages, error, handleInputChange, input, handleSubmit } = useChat({
		fetch: expoFetch as unknown as typeof globalThis.fetch,
		api: generateAPIUrl('/api/chat'),
		onError: error => console.error(error, 'ERROR'),
		body: {
			gameId: searchParams.gameId
		}
	});

	const playSomeText = async (text: string) => {
        const result = await axios.post(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/textToSpeech`, {"text": text}, {
            headers: {
				"Content-Type": "application/json"
			}
        })

        if (result.status === 204) {
            const speech = require("@/assets/audios/lastSpeech.mp3")
            const speechPlayer = createAudioPlayer(speech)
            speechPlayer.seekTo(0)
            speechPlayer.play()
        }
    }

	if (error) return <Text>{error.message}</Text>;

	return (
		<SafeAreaView style={{height: '100%', backgroundColor:'black'}}>
			<View
				style={{
					height: '95%',
					display: 'flex',
					flexDirection: 'column',
					paddingHorizontal: 8,
				}}
			>
				<View style={{marginTop: 8}}>
					<TextInput
						style={{backgroundColor: 'white', padding: 8 }}
						placeholder="Say something..."
						value={input}
						onChange={e =>
							handleInputChange({
								...e,
								target: {
									...e.target,
									value: e.nativeEvent.text,
								},
							} as unknown as React.ChangeEvent<HTMLInputElement>)
						}
						onSubmitEditing={e => {
							handleSubmit(e);
							e.preventDefault();
						}}
						autoFocus={true}
					/>
				</View>

				<ScrollView style={{ flex: 1 }}>
					{messages.map(m => (
						<View key={m.id} style={{ marginVertical: 25}}>
							<View>
								<Text style={{ 
									fontWeight: 700, 
									color: m.role === "assistant" ? "#00FF00" : "white"
								}}>{m.role === "assistant" ? "ИИ Мастер" : "Я"}</Text>
								<Text 
									style={{
										color: m.role === "user" ? "goldenrod" : "#006400",
										fontSize: 20
									}}
								>{m.content}</Text>
							</View>
							<View>
								<TouchableOpacity
									onPress={() => playSomeText(m.content)}
									style={{
										padding: 25,
										borderWidth: 3,
										borderStyle: 'solid',
										borderColor: 'black',
									}}
								>
									<Text style={{color: "white"}}>Звук</Text>
								</TouchableOpacity>
							</View>
						</View>
					))}
				</ScrollView>
			</View>
		</SafeAreaView>
	);
}

export default GameScreen;