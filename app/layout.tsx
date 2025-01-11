import type { Metadata } from 'next';
import { Arvo, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ibm-plex-sans',
});
const avro = Arvo({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-avro',
});

export const metadata: Metadata = {
  title: 'CoFinances',
  description: 'CoFinances is a web APP that helps in tracking your finances!',
  icons: {
    icon: 'icons/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ibmPlexSans.variable} ${avro.variable}`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
