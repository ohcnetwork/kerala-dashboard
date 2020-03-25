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
    extend: {}
  },
  variants: { spinner: ["responsive"] },
  plugins: [require("tailwindcss-spinner")()]
};
