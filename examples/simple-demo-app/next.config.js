//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withNx } = require("@nx/next/plugins/with-nx");

// https://github.com/vercel/next.js/issues/49169
process.env.__NEXT_PRIVATE_PREBUNDLED_REACT = "next";

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    PEZZO_API_KEY: process.env.PEZZO_API_KEY,
    PEZZO_PROJECT_ID: process.env.PEZZO_PROJECT_ID,
    PEZZO_SERVER_URL: process.env.PEZZO_SERVER_URL,
  },
};

module.exports = withNx(nextConfig);
