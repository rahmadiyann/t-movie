/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			screens: {
				xs: "380px",
			},
			colors: {
				netflixRed: "#E50914",
				netflixBlack: "#141414",
				netflixGray: "#808080",
			},
			textColor: {
				primary: "#FFFFFF",
				secondary: "#E5E5E5",
				tertiary: "#B3B3B3",
			},
			backgroundColor: {
				mainColor: "#141414",
				secondaryColor: "#181818",
				blackOverlay: "rgba(0, 0, 0, 0.6)",
			},
			boxShadow: {
				glow: "0 0 18px rgba(229, 9, 20, 0.7)",
				glowLight: "0 0 24px rgba(229, 9, 20, 0.5)",
			},
		},
		fontFamily: {
			sans: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
		},
	},
	plugins: [],
};
