/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add this block to ignore ESLint errors during deployment
  eslint: {
    ignoreDuringBuilds: ,
  },
  // If you also want to ignore TypeScript type-checking errors during build, add this:
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
