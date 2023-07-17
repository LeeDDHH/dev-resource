const config = {
  webpack: (config) => {
    // this will override the experiments
    config.experiments = { ...config.experiments, topLevelAwait: true };
    // this will just update topLevelAwait property of config.experiments
    // config.experiments.topLevelAwait = true
    return config;
  },
};

const withBundleAnalyzer =
  process.env.ANALYZE === 'true' ? require('@next/bundle-analyzer')({ enabled: true }) : (config) => config;
module.exports = withBundleAnalyzer(config);
