import typography from "@tailwindcss/typography";
import daisyui from "daisyui"


export default {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
  	extend: {}
  },
  plugins: [ typography,
    daisyui
],
  daisyui: {
    themes: ["light", "dark", "dracula"]
  }
};

