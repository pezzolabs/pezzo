//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withNx } = require("@nrwl/next/plugins/with-nx");

// https://github.com/vercel/next.js/issues/49169
process.env.__NEXT_PRIVATE_PREBUNDLED_REACT = "next";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is not defined");
}

if (!process.env.PEZZO_API_KEY) {
  throw new Error("PEZZO_API_KEY environment variable is not defined");
}

if (!process.env.PEZZO_PROJECT_ID) {
  throw new Error("PEZZO_PROJECT_ID environment variable is not defined");
}

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
};

module.exports = withNx(nextConfig);
