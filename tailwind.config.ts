
import type { Config } from "tailwindcss"
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        birk: { bg: "#08110d", gold: "#c2a35c" }
      }
    }
  },
  plugins: []
}
export default config
