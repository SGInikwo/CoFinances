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
				"ibm-plex-serif": "var(--font-ibm-plex-serif)",
				"avro": "var(--font-avro)",
			},
			boxShadow: {
        form: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
        chart:
          "0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)",
        profile:
          "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)",
        creditCard: "8px 10px 16px 0px rgba(0, 0, 0, 0.05)",
      },
  	}
  },
  plugins: [tailwindcssAnimate],
};
export default config;
