import "@/utils/polyfills";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  	const colorScheme = useColorScheme()
	return (
		<Stack screenOptions={{
			headerStyle: {
				backgroundColor: colorScheme === "light" ? '#f2f2f2' : '#232323'
			},
			headerTintColor: colorScheme === "light" ? 'black' : 'white'	
		}}>
			<Stack.Screen 
				name="index"
				options={{
					title: "Главная"
				}}
			/>
			<Stack.Screen
				name="game/[gameId]"
				options={{
					title: "Партия"
				}}
			/>
		</Stack>
	)
}