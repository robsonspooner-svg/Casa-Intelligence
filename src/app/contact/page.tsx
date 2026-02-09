import { Metadata } from 'next';
import ContactCTA from '@/components/sections/ContactCTA';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Casa Intelligence for a free initial consultation about your development site on the Sunshine Coast.',
};

export default function ContactPage() {
  return <ContactCTA />;
}
