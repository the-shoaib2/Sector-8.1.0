/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com'], // For Google OAuth profile pictures
  },
  // Add pageExtensions to ensure Next.js recognizes all page files
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  // Add trailingSlash to ensure consistent URL handling
  trailingSlash: false,
  // Configure experimental features
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000', 
        'baby.vercel.app',
        '*.vercel.app'
      ],
    },
    // Add experimental features for better build handling
    optimizePackageImports: ['@radix-ui/react-*'],
  },
  // Add output configuration
  output: 'standalone',
  // Configure webpack to handle font files
  webpack: (config, { isServer }) => {
    // Add rule for font files
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      issuer: { and: [/\.(js|ts|md)x?$/] },
      type: 'asset/resource',
      generator: {
        filename: 'static/fonts/[name][ext]',
        publicPath: '/_next/static/fonts/',
        outputPath: 'static/fonts/'
      }
    });
    return config;
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

export default nextConfig; 