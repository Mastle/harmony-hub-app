import typography from "@tailwindcss/typography";
import daisyui from "daisyui"


export default {
    darkMode: ['class'],
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {}
  	}
  },
  plugins: [ typography,
    daisyui,
      require("tailwindcss-animate")
],
  daisyui: {
    themes: ["light", "dark", "dracula"]
  }
};

