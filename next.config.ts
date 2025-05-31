import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Handle Genkit and AI dependencies
    if (isServer) {
      config.externals = [...(config.externals || []), {
        '@opentelemetry/exporter-jaeger': 'commonjs @opentelemetry/exporter-jaeger',
        'handlebars': 'commonjs handlebars',
      }];
    }
    
    // Ignore warnings for specific modules
    config.ignoreWarnings = [
      { module: /node_modules\/@opentelemetry/ },
      { module: /node_modules\/handlebars/ },
      { module: /node_modules\/dotprompt/ },
    ];

    return config;
  },
  experimental: {
    // Disable webpack cache to avoid permission issues
    webpackBuildWorker: false,
  },
};

export default nextConfig;
