import type { Metadata } from 'next';
import { DM_Serif_Display, Inter } from 'next/font/google';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dm-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://casaintelligence.com.au'),
  title: {
    default: 'Casa Intelligence — Development Feasibility & Advisory | Sunshine Coast',
    template: '%s | Casa Intelligence',
  },
  description:
    'Development feasibility reports and pre-development advisory for the Sunshine Coast. Planning, architecture, and financial analysis in one integrated report. Delivered in 5–7 business days.',
  keywords: [
    'development feasibility',
    'property development sunshine coast',
    'feasibility report',
    'pre-development management',
    'sunshine coast property',
    'development advisory',
    'planning assessment',
    'architectural feasibility',
    'SEQ property development',
    'sunshine coast development',
    'property development consulting',
    'site feasibility analysis',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://casaintelligence.com.au',
    siteName: 'Casa Intelligence',
    title: 'Casa Intelligence — Development Feasibility & Advisory',
    description:
      'Planning, architecture, and financial analysis in one integrated report. Delivered in 5–7 business days on the Sunshine Coast.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Casa Intelligence — Development Feasibility & Advisory',
    description:
      'Planning, architecture, and financial analysis in one integrated report.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSerif.variable}`}>
      <body className="font-sans bg-canvas text-text-primary antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
