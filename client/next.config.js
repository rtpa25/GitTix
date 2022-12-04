/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    webpack: (config) => {
        config.watchOptions.poll = 300;
        return config;
    },
};

module.exports = nextConfig;
