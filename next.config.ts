import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const LOCALES = ['en', 'es'] as const;

const nextConfig: NextConfig = {
  async redirects() {
    const rules: {
      source: string;
      destination: string;
      permanent: boolean;
    }[] = [];

    for (const locale of LOCALES) {
      rules.push(
        { source: `/${locale}/gallery`, destination: `/${locale}/menu`, permanent: true },
        { source: `/${locale}/catering`, destination: `/${locale}/booking`, permanent: true },
        { source: `/${locale}/products`, destination: `/${locale}/menu`, permanent: true },
        {
          source: `/${locale}/products/chocolate-protein-shake`,
          destination: `/${locale}/products/protein-shake`,
          permanent: true,
        },
        {
          source: `/${locale}/products/protein-shake-:flavor`,
          destination: `/${locale}/products/protein-shake`,
          permanent: true,
        }
      );
    }

    return rules;
  },
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
