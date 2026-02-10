import { Metadata } from 'next';
import ContactCTA from '@/components/sections/ContactCTA';

export const metadata: Metadata = {
  title: 'Contact | Free Consultation | Sunshine Coast Development Advisory',
  description:
    'Get in touch with Casa Intelligence for a free initial consultation about your development site on the Sunshine Coast. Expert feasibility analysis and development advisory.',
  keywords: [
    'development consultation sunshine coast',
    'property development advice queensland',
    'free feasibility consultation',
    'sunshine coast development advisory contact',
    'property development help sunshine coast',
  ],
  alternates: {
    canonical: 'https://casaintelligence.com.au/contact',
  },
  openGraph: {
    title: 'Contact Casa Intelligence | Free Development Consultation',
    description:
      'Get in touch for a free initial consultation about your development site on the Sunshine Coast.',
    type: 'website',
    url: 'https://casaintelligence.com.au/contact',
  },
};

export default function ContactPage() {
  return <ContactCTA />;
}
