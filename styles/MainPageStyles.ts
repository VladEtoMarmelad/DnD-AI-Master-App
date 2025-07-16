import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	button: {
		padding: 25,
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
		borderRadius: 15,
		backgroundColor: 'black'
	},
	gamesContainer: {
		display: 'flex',
		position: 'absolute',
		flex: 1,
		top: 0,
		left: 0,
		zIndex: 100,
		width: Platform.OS === "web" ? '12.5%': "75%",
		height: '100%',
		flexDirection: 'column',
		borderRightWidth: 1,
		borderStyle: 'solid',
		borderRightColor: 'black',
		backgroundColor: '#f2f2f2'
	},
	game: {
		padding: 10,
		marginVertical: 7.5,
		marginLeft: 5,
		marginRight: Platform.OS !== "web" ? 75 : 5,
		borderRadius: 15,
		backgroundColor: 'gray'
	},
	toggleGamesButton: {
		position: 'absolute',
		top: 0,
		right: 0,
		width: 15,
		height: 15,
		padding: 25,
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
		borderRadius: 15,
		backgroundColor: 'black'
	}
})

export default styles;