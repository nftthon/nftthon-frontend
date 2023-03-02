module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        "d-purple": "#C026D3", 
        "d-pink": "#f94e9b",
        "d-blue": "#03E1F2"
      }
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui")
  ],
  daisyui: {
    styled: true,
    themes: [
      // first one will be the default theme
      "dark",
      // uncomment to enable
      // "light (default)",
      // "dark",
      // "cupcake",
      // "bumblebee",
      // "emerald",
      // "corporate",
      // "synthwave",
      // "retro",
      // "cyberpunk",
      // "valentine",
      // "halloween",
      // "garden",
      "forest",
      // "aqua",
      // "lofi",
      // "pastel",
      // "fantasy",
      // "wireframe",
      // "black",
      // "luxury",
      // "dracula",
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
  },
};
