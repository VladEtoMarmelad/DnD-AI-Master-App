import { StyleSheet } from 'react-native';

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
		zIndex: 10,
		width: '12.5%',
		height: '100%',
		flexDirection: 'column',
		paddingRight: 25,
		borderRightWidth: 1,
		borderStyle: 'solid',
		borderRightColor: 'black'
	},
	game: {
		padding: 10,
		marginVertical: 7.5,
		marginHorizontal: 5,
		borderRadius: 25,
		backgroundColor: 'gray'
	}
})

export default styles;