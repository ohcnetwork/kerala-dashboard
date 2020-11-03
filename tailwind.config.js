const windmill = require("@windmill/react-ui/config");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = windmill({
  purge: [
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./lib/theme.ts",
  ],
  theme: {
    extend: {
      fontSize: {
        xxs: ".65rem",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        bottom:
          "0 5px 6px -7px rgba(0, 0, 0, 0.6), 0 2px 4px -5px rgba(0, 0, 0, 0.06)",
      },
      animation: {
        shine: "shine 15s ease infinite",
      },
      backgroundSize: {
        "100%": "400% 100%",
      },
      colors: {
        bunker: {
          100: "#E8E8E8",
          200: "#C5C6C6",
          300: "#A3A3A4",
          400: "#5D5F5F",
          50: "#F3F4F4",
          500: "#181A1B",
          600: "#161718",
          700: "#0E1010",
          800: "#0B0C0C",
          900: "#070808",
        },
      },
      maxHeight: {
        "90screen": "90vh",
      },
      height: {
        "50screen": "50vh",
        "60screen": "60vh",
        "70screen": "70vh",
        "75screen": "75vh",
        "80screen": "80vh",
        "90screen": "90vh",
      },
      maxWidth: {
        "35screen": "35vw",
      },
      width: {
        "35screen": "35vw",
      },
      keyframes: {
        shine: {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "100%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
        },
      },
    },
  },
  variants: {
    animation: ["responsive", "hover", "focus"],
    backgroundPosition: ["responsive", "hover", "focus"],
  },
  experimental: {
    applyComplexClasses: true,
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwind-css-variables")({
      colors: "color",
      screens: false,
      fontFamily: false,
      fontSize: false,
      fontWeight: false,
      lineHeight: false,
      letterSpacing: false,
      backgroundSize: false,
      borderWidth: false,
      borderRadius: false,
      width: false,
      height: false,
      minWidth: false,
      minHeight: false,
      maxWidth: false,
      maxHeight: false,
      padding: false,
      margin: false,
      boxShadow: false,
      zIndex: false,
      opacity: false,
    }),
  ],
});
