module.exports = {
  theme: {
    spinner: theme => ({
      default: {
        color: "#A0AEC0",
        size: "4em",
        border: "2px",
        speed: "500ms"
      }
    }),
    extend: {
      textColor: {
        primary: "#edf2f7",
        secondary: "#ffed4a",
        danger: "#e3342f"
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"]
      },
      colors: {
        purps: "#9561E2",
        fiord: {
          100: "#EDEEF0",
          200: "#D2D5DA",
          300: "#B7BBC3",
          400: "#828997",
          500: "#4C566A",
          600: "#444D5F",
          700: "#2E3440",
          800: "#222730",
          900: "#171A20"
        }
      },
      screens: {
        avg: "1432px"
      }
    },
    linearBorderGradients: theme => ({ colors: theme("colors") }),
    linearGradientColors: theme => theme("colors"),
    radialGradientColors: theme => theme("colors"),
    conicGradientColors: theme => theme("colors")
  },
  variants: { spinner: ["responsive"] },
  plugins: [
    require("tailwindcss-spinner")(),
    require("tailwindcss-border-gradients")(),
    require("tailwindcss-gradients")
  ]
};
