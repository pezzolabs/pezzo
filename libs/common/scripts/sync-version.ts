import fs from "fs";

console.log("Synchronizing version");
const packageJsonFile = fs.readFileSync("./package.json", "utf8");
const packageJson = JSON.parse(packageJsonFile);
const version = packageJson.version;
fs.writeFileSync("./libs/common/src/version.json", JSON.stringify({ version }));
console.log(`Synced version ${version}`);
