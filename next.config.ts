/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // if you only need Clerk avatars, you can use domains instead of remotePatterns:
    domains: ['img.clerk.com'],

    // Or, if you really need fine‐grained control:
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'img.clerk.com',
    //     pathname: '/**',
    //   },
    // ],

    // unoptimized will bypass Next's built-in loader entirely
    unoptimized: true,
  },
};

module.exports = nextConfig;
