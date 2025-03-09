const fs = require("fs");
const path = require("path");

const version = require("../package.json").version;
console.log(
  `[@pezzo/client | prebuild] Injecting version to Pezzo Client - ${version}`
);

const filePath = path.join(__dirname, "../src/version.ts");
const fileContent = `export const version = "${version}";\n`;
fs.writeFileSync(filePath, fileContent, { encoding: "utf8" });

console.log(
  `[@pezzo/client | prebuild] Injected version to Pezzo Client - ${version}`
);
