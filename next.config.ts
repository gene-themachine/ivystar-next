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
  
  // Add webpack configuration to optimize chunk loading
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    // Optimize browser-side chunk size for faster loading
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Create a single vendor chunk for common dependencies
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            reuseExistingChunk: true,
          },
          // Group React and related packages into one chunk
          react: {
            name: 'react',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types)[\\/]/,
            priority: 20,
          },
          // Use a simpler approach for naming chunks to avoid null reference errors
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
            priority: 10,
          }
        },
      };
    }
    return config;
  },
  
  // Add retry mechanism for chunk loading
  experimental: {
    // Attempt to retry loading chunks that failed to load
    optimizeCss: true,
    scrollRestoration: true,
  },
};

module.exports = nextConfig;
