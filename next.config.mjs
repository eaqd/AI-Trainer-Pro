import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
    outputFileTracingIncludes: {
      '/api/**': ['./prisma/dev.db'],
      '/': ['./prisma/dev.db'],
    },
  },
};

export default nextConfig;
