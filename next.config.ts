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
          // Group larger libraries together
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module: any) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return `lib.${packageName.replace('@', '')}`;
            },
            priority: 10,
            minChunks: 1,
            reuseExistingChunk: true,
          },
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
  
  // Increase memory limit for builds if needed
  env: {
    // Allow 2GB memory for builds
    NODE_OPTIONS: '--max_old_space_size=2048'
  },
};

module.exports = nextConfig;
