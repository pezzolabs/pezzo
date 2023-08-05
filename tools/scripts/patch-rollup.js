// https://github.com/nrwl/nx/issues/10395#issuecomment-1426761781
const fs = require("fs");
const path = require("path");

function patchNxPlugin() {
  const target = path.resolve(
    process.cwd(),
    "./node_modules/@nx/rollup/src/executors/rollup/lib/update-package-json.js"
  );
  const data = fs.readFileSync(target, "utf-8");

  const patchMatch = "const hasEsmFormat";
  const patchReplace = `return;${patchMatch}`;
  if (!data.includes(patchReplace)) {
    const output = data.replace(patchMatch, patchReplace);
    fs.writeFileSync(target, output, "utf-8");
    console.log(`PATCHED @nx/rollup updatePackageJson, re-run build`);
  } else {
    console.log(`ALREADY PATCHED @nx/rollup updatePackageJson`);
  }
}
patchNxPlugin();
