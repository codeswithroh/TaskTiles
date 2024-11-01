/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bento: {
          salmon: "#F4A261",
          yellow: "#e9c46a",
          blue: "#94d1ee",
          teal: "#2A9D8F",
        },
      },
    },
  },
  plugins: [],
};
