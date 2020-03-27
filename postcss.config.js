const tailwindcss = require("tailwindcss");
const purgecss = require("@fullhuman/postcss-purgecss");
module.exports = {
  plugins: [
    tailwindcss("./tailwind.config.js"),
    require("autoprefixer"),
    purgecss({
      content: ["./src/**/*.html", "./src/**/*.js"],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
    })
  ]
};
