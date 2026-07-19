export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#132242",
        inksoft: "#1F345C",
        canvas: "#FAF8F2",
        canvasalt: "#F1ECDF",
        gold: "#C69A3E",
        golddeep: "#9C7626",
        teal: "#2E6E60",
        tealdeep: "#1E4A40",
        rust: "#B2543A",
        line: "#E4DECE",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
