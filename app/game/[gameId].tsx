import { generateAPIUrl } from '@/utils/utils';
import { useChat } from '@ai-sdk/react';
import { fetch as expoFetch } from 'expo/fetch';
import { View, TextInput, ScrollView, Text, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const GameScreen = () => {
	const searchParams = useLocalSearchParams();
	const { messages, error, handleInputChange, input, handleSubmit } = useChat({
		fetch: expoFetch as unknown as typeof globalThis.fetch,
		api: generateAPIUrl('/api/chat'),
		onError: error => console.error(error, 'ERROR'),
		body: {
			id: searchParams.gameId
		}
	});

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
								}}>{m.role === "assistant" ? "Gemma" : "Я"}</Text>
								<Text 
									style={{color: m.role === "user" ? "goldenrod" : "#006400"}}
								>{m.content}</Text>
							</View>
						</View>
					))}
				</ScrollView>
			</View>
		</SafeAreaView>
	);
}

export default GameScreen;