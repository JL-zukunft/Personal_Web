/** @type {import('tailwindcss').Config} */
import sharedConfig from '../config/tailwind/main.config.js'

export default {
  ...sharedConfig,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../styles/**/*.css"
  ],
}
