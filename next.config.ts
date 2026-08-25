import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    localPatterns: [
      { pathname: '/uploads/**' },
      { pathname: '/images/**' },
      { pathname: '/flavours/**' },
      { pathname: '/brand/**' },
      { pathname: '/signature flavour collection/**' },
      { pathname: '/new flavour collection/**' },
      { pathname: '/fall citrus collection/**' },
      { pathname: '/fall berry collection/**' },
      { pathname: '/school fun collection/**' },
    ],
  },
};

export default withNextIntl(nextConfig);
