import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";


const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
			financeBackground: "#F4F4F4",
			financeGradient: "#99DE91",
  		},
		fontFamily: {
			"avro": "var(--font-avro)",
			"ibm-plex-serif": "var(--font-ibm-plex-serif)",
		}
  	}
  },
  plugins: [tailwindcssAnimate],
};
export default config;
