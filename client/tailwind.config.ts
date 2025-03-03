import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        nunito: ['"Nunito Sans"', 'sans-serif'], // Ensure correct naming
        prompt: ['"Prompt"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
