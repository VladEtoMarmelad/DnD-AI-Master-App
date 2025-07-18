export const themeStyleUser = (colorScheme: "light"|"dark"|undefined|null, styles: any, styleName: string) => {
	const lightThemeStyleName = `lightTheme${styleName}`
	const darkThemeStyleName = `darkTheme${styleName}`

	const themeStyle = colorScheme === "light" ? styles[lightThemeStyleName] : styles[darkThemeStyleName]
	return themeStyle
}