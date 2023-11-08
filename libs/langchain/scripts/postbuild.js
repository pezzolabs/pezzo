console.log("Running postbuild script");

const fs = require("fs");
const path = require("path");

const distPackageJsonPath = path.resolve("dist/libs/langchain/package.json");

const packageJson = JSON.parse(fs.readFileSync(distPackageJsonPath, "utf8"));

const modifiedPackageJson = {
  ...packageJson,
};

// Delete the "openai" entry from "dependencies" because we only want to use it as a peer dependency.
delete modifiedPackageJson.dependencies["openai"];

// Rewirte the package.json file
fs.writeFileSync(
  distPackageJsonPath,
  JSON.stringify(modifiedPackageJson, null, 2)
);

console.log("Postbuild script ran successfully");
