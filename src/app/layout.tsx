import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Serif_Display, Inter } from 'next/font/google';
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

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://casaintelligence.com.au'),
  title: {
    default: 'Casa Intelligence | Development Feasibility & Advisory | Sunshine Coast',
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
    'queensland development',
    'queensland property development',
    'property development queensland',
    'sunshine coast development consultant',
    'sunshine coast feasibility study',
    'development approval sunshine coast',
    'sunshine coast planning scheme',
    'property development advisory queensland',
    'development intelligence',
    'site analysis sunshine coast',
    'property feasibility sunshine coast',
    'development site assessment',
    'sunshine coast planning overlays',
    'infill development sunshine coast',
    'medium density development queensland',
    'property development SEQ',
    'south east queensland development',
    'sunshine coast property market',
    'development risk assessment',
    'pre-development advisory sunshine coast',
    'development feasibility report queensland',
    'sunshine coast zoning',
    'property development due diligence',
    'sunshine coast council planning',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://casaintelligence.com.au',
    siteName: 'Casa Intelligence',
    title: 'Casa Intelligence | Development Feasibility & Advisory',
    description:
      'Planning, architecture, and financial analysis in one integrated report. Delivered in 5–7 business days on the Sunshine Coast.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Casa Intelligence | Development Feasibility & Advisory',
    description:
      'Planning, architecture, and financial analysis in one integrated report.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://casaintelligence.com.au',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Casa Intelligence',
  url: 'https://casaintelligence.com.au',
  description:
    'Proprietary development intelligence for the Sunshine Coast and South East Queensland.',
  publisher: {
    '@type': 'Organization',
    name: 'Casa Intelligence',
    url: 'https://casaintelligence.com.au',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Casa Intelligence',
  description:
    'Proprietary development intelligence for South East Queensland. Data-driven feasibility analysis, planning assessment, and pre-development advisory for the Sunshine Coast.',
  url: 'https://casaintelligence.com.au',
  telephone: '+61400000000',
  email: 'hello@casaintelligence.com.au',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Sunshine Coast',
    addressRegion: 'QLD',
    addressCountry: 'AU',
  },
  areaServed: [
    {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: -26.65,
        longitude: 153.07,
      },
      geoRadius: '100000',
    },
    { '@type': 'AdministrativeArea', name: 'Sunshine Coast, Queensland' },
    { '@type': 'AdministrativeArea', name: 'South East Queensland' },
  ],
  serviceType: [
    'Development Feasibility Reports',
    'Pre-Development Advisory',
    'Property Development Consulting',
    'Planning Assessment',
    'Site Feasibility Analysis',
  ],
  knowsAbout: [
    'Property development',
    'Development feasibility',
    'Planning schemes',
    'Sunshine Coast development',
    'Queensland property market',
    'Infill development',
    'Development overlays',
    'Zoning analysis',
  ],
  sameAs: [],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSerif.variable} ${cormorant.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-canvas text-text-primary antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
