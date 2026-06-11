// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

import type { NextConfig } from "next";

import bundleAnalyzer
from "@next/bundle-analyzer";

const withBundleAnalyzer =
  bundleAnalyzer({

    enabled:
      process.env.ANALYZE ===
      "true",

  });

const nextConfig:
NextConfig = {

};

export default
withBundleAnalyzer(
  nextConfig
);