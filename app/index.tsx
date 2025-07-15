import styles from "@/styles/MainPageStyles";
import axios from "axios";
import { Link, useRouter } from "expo-router";
import 'expo-router/entry';
import { useEffect, useState } from "react";
import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";

const HomeScreen = () => {
	const router = useRouter();
	const [games, setGames] = useState(null)

	useEffect(() => {
		axios.get(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/someGames`)
		.then(result => {
			if (result.status === 200) {
				console.log(result.data)
				setGames(result.data.games)
			}
		})
	}, [])

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

	if (!games) return <Text>Загрузка</Text>

	return (
		<View style={{width: '100%', height: '100%'}}>
			<ScrollView style={styles.gamesContainer}>
				<FlatList 
					data={games}
					keyExtractor={game => game.id}
					renderItem={({item: game}) => 
						<Link 
							href={{
								pathname: "/game/[gameId]", 
								params: {gameId: game.id} 
							}}
							style={styles.game}
						>
							game id: {game.id}
						</Link>
					}
				/>
				<TouchableOpacity
					activeOpacity={0.75}
					style={styles.button}
				>

				</TouchableOpacity>
			</ScrollView>
			<View style={{display:'flex', flex:1, alignItems:'center', justifyContent:'center'}}>
				<TouchableOpacity 
					onPress={startNewGame}
					activeOpacity={0.75}
					style={styles.button}
				>
					<Text style={{color: 'white'}}>Начать новую партию</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default HomeScreen;