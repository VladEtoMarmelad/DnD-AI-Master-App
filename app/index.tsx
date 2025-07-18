import styles from "@/styles/MainPageStyles";
import axios from "axios";
import { Link, useRouter } from "expo-router";
import 'expo-router/entry';
import { useEffect, useState } from "react";
import { FlatList, Platform, Text, TouchableOpacity, View, useColorScheme } from "react-native";

const HomeScreen = () => {
	const router = useRouter();
	const colorScheme = useColorScheme();
	const [games, setGames] = useState<any[]|null>(null)
	const [allGamesAmount, setAllGamesAmount] = useState(0)
	const [showGames, setShowGames] = useState(Platform.OS === "web" ? true : false)

	useEffect(() => {
		getMoreGames()
	}, [])

	const themeTextStyle = colorScheme === "light" ? styles.lightThemeText : styles.darkThemeText
	const themeButtonStyle = colorScheme === "light" ? styles.ligthThemeButton : styles.darkThemeButton;
	const themeGamesContainerStyle = colorScheme === "light" ? styles.lightThemeGamesContainer : styles.darkThemeGamesContainer 

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

	const getMoreGames = (): void => {
		axios.get(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/someGames`, {
			params: {amount: games ? games.length + 5 : 15}
		})
		.then(result => {
			if (result.status === 200) {
				setGames(result.data.games)
				setAllGamesAmount(result.data.allGamesAmount)
			}
		})
	}

	if (!games) return <Text style={themeTextStyle}>Загрузка</Text>

	return (
		<View style={{
			width: '100%',
			height: '100%', 
			backgroundColor: colorScheme === "light" ? "#f2f2f2" : "#232323"
		}}>
			{Platform.OS !== "web" && games.length > 0 &&
				<TouchableOpacity 
					onPress={() => setShowGames(!showGames)}
					style={{...styles.toggleGamesButton, left: 0}}
				/>
			}
			{showGames &&
				<FlatList 
					data={games}
					keyExtractor={game => game.id}
					showsVerticalScrollIndicator={false}
					style={[styles.gamesContainer, themeGamesContainerStyle]}
					renderItem={({item: game, index}) => 
						<View>
							{index === 0 && Platform.OS !== "web" &&
								<TouchableOpacity 
									onPress={() => setShowGames(!showGames)}
									style={styles.toggleGamesButton}
								/>
							}

							<Link 
								href={{
									pathname: "/game/[gameId]", 
									params: {gameId: game.id} 
								}}
								style={styles.game}
							>
								game id: {game.id}
							</Link>

							{index === games.length-1 && allGamesAmount > games.length && games.length > 0 &&
								<TouchableOpacity
									onPress={getMoreGames}
									activeOpacity={0.75}
									style={{...styles.button, ...themeButtonStyle, marginHorizontal: 5, padding: 10}}
								><Text style={{color: 'white'}}>Загрузить ещё...</Text></TouchableOpacity>
							}
						</View>
					}
				/>
			}

			<View style={{display:'flex', flex:1, alignItems:'center', justifyContent:'center'}}>
				<TouchableOpacity 
					onPress={startNewGame}
					activeOpacity={0.75}
					style={[styles.button, themeButtonStyle]}
				>
					<Text style={{color: 'white'}}>Начать новую партию</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default HomeScreen;