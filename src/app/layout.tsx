import type { Viewport } from 'next';
import { Bebas_Neue, Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  variable: '--font-bebas',
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const introBootScript = `(function(){try{var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;var seen=sessionStorage.getItem('ffb_intro_seen')==='1';if(!reduced&&!seen){document.documentElement.classList.add('intro-active');}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${bebasNeue.variable} h-full`} suppressHydrationWarning>
      <body className="flex min-h-full w-full min-w-0 max-w-full flex-col overflow-x-hidden antialiased">
        <script dangerouslySetInnerHTML={{ __html: introBootScript }} />
        {children}
      </body>
    </html>
  );
}
