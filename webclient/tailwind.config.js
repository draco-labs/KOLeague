/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "backdrop-gradient":
        'linear-gradient(180deg, #0D0D15 0%, rgba(0, 0, 0, 0.9) 30%, rgba(13, 13, 21, 0.8) 59%, #0D0D15 100%), url("/background.png")',
        "backdrop-gradient1":
        'linear-gradient(180deg, #0D0D15 0%, rgba(0, 0, 0, 0.4) 30%, rgba(13, 13, 21, 0.5) 59%, #0D0D15 100%), url("/background1.png")',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      boxShadow: {
        'custom-top': '0px -8px 12px 0px #00000066',
        'custom-bottom': '0px 8px 12px 0px #00000066',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.text-shadow-custom-white': {
          'text-shadow': '0px 0px 4px #FFFFFFAB',
        },
      });
    },
  ],
};
