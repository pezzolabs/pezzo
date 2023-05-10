//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withNx } = require("@nrwl/next/plugins/with-nx");

if (!process.env.BASE_API_URL) {
  throw new Error("BASE_API_URL environment variable is not set");
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
  webpack: (config, { isServer }) => {
    return config;
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/prompts",
        permanent: true,
      },
    ];
  },
};

module.exports = withNx(nextConfig);
