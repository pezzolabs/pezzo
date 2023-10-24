const { join } = require("path");

module.exports = {
  plugins: {
    "postcss-nested": {},
    tailwindcss: {
      config: join(__dirname, "tailwind.config.js"),
    },
    autoprefixer: {},
  },
};
