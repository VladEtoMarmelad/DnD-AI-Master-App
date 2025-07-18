import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    lightThemeText: {
		color: 'black'
	},
	darkThemeText: {
		color: 'white'
	},

    userMessage: {
        padding: 30,
        marginLeft: Platform.OS === "web" ? 100 : 50,
        marginRight: 15,
        borderRadius: 15
    },
    lightThemeUserMessage: {
        backgroundColor: '#e7decc'
    },
    darkThemeUserMessage: {
        backgroundColor: '#070504'
    },

    assistantMessage: {
        padding: 30,
        marginRight: Platform.OS === "web" ? 100 : 50,
        marginLeft: 15,
        borderRadius: 15
    },
    lightThemeAssistantMessage: {
        backgroundColor: '#faf5ef'
    },
    darkThemeAssistantMessage: {
        backgroundColor: '#121214'
    },

    soundButton: {
        width: Platform.OS === "web" ? '10%' : '100%',
        padding: 20,
        borderWidth: 1,
        marginTop: 25,
        borderStyle: 'solid',
        borderRadius: 10
    },
    lightThemeSoundButton: {
        borderColor: 'black'
    },
    darkThemeSoundButton: {
        borderColor: 'white'
    },

    promptInput: {
        alignSelf: 'center',
        padding: 20,
        marginTop: 15,
        width: '75%',
        borderRadius: 10
    },
    lightThemePromptInput: {
        backgroundColor: '#fffafa',
        color: 'black'
    },
    darkThemePromptInput: {
        backgroundColor: '#080402',
        color: 'white'
    }
})

export default styles;