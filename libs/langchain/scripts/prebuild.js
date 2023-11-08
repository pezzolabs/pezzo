const fs = require("fs");
const path = require("path");

const version = require("../package.json").version;
console.log(
  `[@pezzo/langchain | prebuild] Injecting version to Pezzo LangChain - ${version}`
);

const filePath = path.join(__dirname, "../src/version.ts");
const fileContent = `export const version = "${version}";\n`;
fs.writeFileSync(filePath, fileContent, { encoding: "utf8" });

console.log(
  `[@pezzo/langchain | prebuild] Injected version to Pezzo LangChain - ${version}`
);
