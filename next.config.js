/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  compiler: {
    // Enable support for CSS Modules
    styledComponents: false,
  },
  experimental: {
    // Allows the use of certain packages in server components
    serverComponentsExternalPackages: [],
    // Optimize for modern browsers
    optimizeCss: true,
    // Improved tree-shaking
    optimizePackageImports: ['react', 'react-dom'],
  },
  // Environment variables that will be available in the browser
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  // Optional: Add asynchronous redirects if needed
  async redirects() {
    return [];
  },
  // Add Content Security Policy headers
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'",
          },
        ],
      },
    ];
  },
  // Optional: Customize webpack configuration
  webpack(config) {
    // Add support for importing SVGs as React components
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    return config;
  },
};

module.exports = nextConfig;