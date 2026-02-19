import { Metadata } from 'next';
import HomePageClient from '@/components/sections/HomePageClient';
import ServicesOverview from '@/components/sections/ServicesOverview';
import WhyCasa from '@/components/sections/WhyCasa';
import IntelligenceEngine from '@/components/sections/IntelligenceEngine';
import Process from '@/components/sections/Process';
import MarketContext from '@/components/sections/MarketContext';
import CostOfInaction from '@/components/sections/CostOfInaction';
import Team from '@/components/sections/Team';
import ContactCTA from '@/components/sections/ContactCTA';

export const metadata: Metadata = {
  title: 'Casa Intelligence | Development Feasibility | Sunshine Coast',
  description:
    'Proprietary development intelligence for the Sunshine Coast and South East Queensland. Free subdivision checker, development feasibility, planning analysis, and pre-development advisory. Know your site before you commit.',
  keywords: [
    'sunshine coast development',
    'queensland development',
    'property development sunshine coast',
    'development feasibility sunshine coast',
    'queensland property development',
    'development intelligence',
    'sunshine coast property development',
    'development advisory sunshine coast',
    'SEQ development',
    'south east queensland property development',
    'sunshine coast feasibility report',
    'development site assessment sunshine coast',
    'property development queensland',
    'development consultant sunshine coast',
    'sunshine coast planning assessment',
    'subdivision checker sunshine coast',
    'is my property subdividable',
    'subdivision eligibility queensland',
  ],
  openGraph: {
    title: 'Casa Intelligence | Development Intelligence & Feasibility',
    description:
      'Proprietary development intelligence for the Sunshine Coast. Free subdivision checker, planning analysis, and pre-development advisory.',
    type: 'website',
  },
};

export default function Home() {
  return (
    <>
      <HomePageClient />
      <ServicesOverview />
      <WhyCasa />
      <IntelligenceEngine />
      <Process />
      <MarketContext />
      <CostOfInaction />
      <Team />
      <ContactCTA />
    </>
  );
}
