import { Metadata } from 'next';
import Hero from '@/components/sections/Hero';
import ServicesOverview from '@/components/sections/ServicesOverview';
import WhyCasa from '@/components/sections/WhyCasa';
import IntelligenceEngine from '@/components/sections/IntelligenceEngine';
import Process from '@/components/sections/Process';
import SiteAnalyserPreview from '@/components/sections/SiteAnalyserPreview';
import MarketContext from '@/components/sections/MarketContext';
import CostOfInaction from '@/components/sections/CostOfInaction';
import Team from '@/components/sections/Team';
import ContactCTA from '@/components/sections/ContactCTA';

export const metadata: Metadata = {
  title: 'Casa Intelligence | Development Intelligence & Feasibility | Sunshine Coast',
  description:
    'Proprietary development intelligence for the Sunshine Coast and South East Queensland. Data-driven feasibility reports, planning analysis, and pre-development advisory. Know your site before you commit.',
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
  ],
  openGraph: {
    title: 'Casa Intelligence | Development Intelligence & Feasibility',
    description:
      'Proprietary development intelligence for the Sunshine Coast. Data-driven feasibility, planning analysis, and pre-development advisory.',
    type: 'website',
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <WhyCasa />
      <IntelligenceEngine />
      <Process />
      <SiteAnalyserPreview />
      <MarketContext />
      <CostOfInaction />
      <Team />
      <ContactCTA />
    </>
  );
}
