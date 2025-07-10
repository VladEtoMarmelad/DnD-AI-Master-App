import { View, TouchableOpacity, Text } from "react-native"
import { useRouter } from "expo-router";
import axios from "axios";
import 'expo-router/entry';

const HomeScreen = () => {
	const router = useRouter();
	const startNewGame = async () => {
		const result = await axios.post(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/insert`, {"fullText": ""}, {
			headers: {
				"Content-Type": "application/json"
			}
    	})
		console.log("resultFromFronrend:", result)
		if (result.status === 201) {
			router.push({
				pathname: "/game/[gameId]", 
				params: {gameId: result.data.id}
			})
		}
	}

	return (
		<View style={{display:'flex', flex:1, alignItems:'center', justifyContent:'center'}}>
			<TouchableOpacity style={{
				padding: 25,
				borderWidth: 1,
				borderColor: 'black',
				borderStyle: 'solid',
				borderRadius: 15,
				backgroundColor: 'gray'
			}}
				onPress={startNewGame}
			>
				<Text>Создать</Text>
			</TouchableOpacity>
		</View>
	)
}

export default HomeScreen;