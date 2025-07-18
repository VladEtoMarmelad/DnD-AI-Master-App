import styles from '@/styles/GameScreenStyles';
import { themeStyleUser } from '@/utils/themeStyleUser';
import { generateAPIUrl } from '@/utils/utils';
import { useChat } from '@ai-sdk/react';
import axios from 'axios';
import { createAudioPlayer } from 'expo-audio';
import { useLocalSearchParams } from 'expo-router';
import { fetch as expoFetch } from 'expo/fetch';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';

const GameScreen = () => {
	const searchParams = useLocalSearchParams();
	const colorScheme = useColorScheme();

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

	const themeUserMessageStyle = themeStyleUser(colorScheme, styles, "UserMessage")
	const themeAssistantMessageStyle = themeStyleUser(colorScheme, styles, "AssistantMessage")
	const themeSoundButtonStyle = themeStyleUser(colorScheme, styles, "SoundButton")
	const themePromptInputStyle = themeStyleUser(colorScheme, styles, "PromptInput")
	const themeTextStyle = themeStyleUser(colorScheme, styles, "Text")

	if (error) return <Text>{error.message}</Text>;
	//161440
	return (
		<SafeAreaView style={{height: '100%', backgroundColor: colorScheme === "light" ? '#f2f2f2' : '#232323'}}>
			<View
				style={{
					height: '95%',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<View style={{marginTop: 8}}>
					<TextInput
						style={[styles.promptInput, themePromptInputStyle]}
						placeholder="Скажите что-то..."
						placeholderTextColor={colorScheme === "light" ? 'black' : 'white'}
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

				<ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
					{messages.map(m => (
						<View key={m.id} style={{ marginVertical: 25}}>
							<View style={m.role === "assistant" ? [styles.assistantMessage, themeAssistantMessageStyle] : [styles.userMessage, themeUserMessageStyle]}>
								<Text style={{
									...themeTextStyle,
									fontWeight: 700, 
									fontSize: 25,
								}}>{m.role === "assistant" ? "ИИ Мастер" : "Я"}</Text>

								<Text 
									style={{
										...themeTextStyle,
										fontSize: 20,
										marginTop: 30
									}}
								>{m.content}</Text>

								<TouchableOpacity
									onPress={() => playSomeText(m.content)}
									style={[styles.soundButton, themeSoundButtonStyle]}
								>
									<Text style={{...themeTextStyle, alignSelf: 'center'}}>Произнести текст</Text>
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