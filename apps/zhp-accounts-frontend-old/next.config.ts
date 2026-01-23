import type { NextConfig } from 'next';

const developmentNextConfig: NextConfig = {};

const productionNextConfig: NextConfig = {
  output: 'export',
  images: {
    loader: 'custom',
    loaderFile: './lib/cloudflare-image-loader.js',
  },
};

export default process.env.NODE_ENV === 'production'
  ? productionNextConfig
  : developmentNextConfig;
