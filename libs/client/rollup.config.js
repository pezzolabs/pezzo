const path = require("path");
const generatePackageJson = require("rollup-plugin-generate-package-json");
const commonjs = require("@rollup/plugin-commonjs");
const sizes = require("rollup-plugin-sizes");
const typescript2 = require("rollup-plugin-typescript2");
const copy = require("rollup-plugin-copy");

const LIB_PATH = `libs/client`;
const DIST_PATH = `dist/libs/client`;

module.exports = (config, context) => {
  function isExternal(moduleName) {
    const internal =
      moduleName.includes("@pezzo") ||
      moduleName.includes("pezzo/apps") ||
      moduleName.includes("pezzo/libs") ||
      /^\.{0,2}\//.test(moduleName);
    return !internal;
  }

  const localPkg = require(path.resolve(
    process.cwd(),
    "libs/client/package.json"
  ));

  return {
    input: config.input,
    output: {
      ...config.output,
      sourcemap: true,
    },
    external: isExternal,
    plugins: [
      typescript2({
        tsconfig: context.tsConfig,
        compilerOptions: { outDir: config.output.dir, sourceMap: true },
      }),
      commonjs(),
      generatePackageJson({
        baseContents: () => ({
          ...localPkg,
          main: "./index.cjs.js",
          module: "./index.esm.js",
          types: "./libs/client/src/index.d.ts",
        }),
        additionalDependencies: {
          // ...localPkg.dependencies,
        },
      }),
      copy({
        targets: [
          {
            src: "./LICENSE",
            dest: DIST_PATH,
          },
          {
            src: path.resolve(LIB_PATH, "README.md"),
            dest: DIST_PATH,
          },
        ],
      }),
      sizes({ details: true }),
    ],
  };
};
