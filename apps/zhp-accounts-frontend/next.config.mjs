/** @type {import('next').NextConfig} */
const developmentNextConfig = {};

/** @type {import('next').NextConfig} */
const productionNextConfig = {
  output: 'export',
  images: {
    loader: 'custom',
    loaderFile: './app/image-loader.js',
  },
};

export default process.env.NODE_ENV === 'production'
  ? productionNextConfig
  : developmentNextConfig;
