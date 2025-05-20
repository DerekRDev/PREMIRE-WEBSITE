/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable React Strict Mode for now to avoid double-rendering issues
  reactStrictMode: false,
  // Completely disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript type checking during builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Add any additional configuration options as needed
  swcMinify: true,
  images: {
    domains: ['example.com'],
  },
  // Allow importing YAML files
  webpack(config) {
    config.module.rules.push({
      test: /\.ya?ml$/,
      use: 'yaml-loader',
    });
    return config;
  },
}

module.exports = nextConfig