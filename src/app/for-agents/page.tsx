import Brand from '@/components/brand/Brand';
import AgentHeroSection from '@/components/agents/AgentHeroSection';
import AgentMockup from '@/components/agents/AgentMockup';
import AgentFeatures from '@/components/agents/AgentFeatures';
import AgentPricing from '@/components/agents/AgentPricing';
import ContactCTA from '@/components/sections/ContactCTA';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'For Real Estate Agents | White-Label Development Intelligence',
  description:
    'Embed Casa Intelligence subdivision and development feasibility tools on your agency website. Generate qualified leads, differentiate your brand, and give every listing instant development insight.',
  keywords: [
    'real estate agent tools',
    'white label property tools',
    'agency development intelligence',
    'real estate lead generation',
    'property development tools agents',
    'white label feasibility tool',
    'real estate technology sunshine coast',
    'agency website tools',
  ],
  alternates: {
    canonical: 'https://casaintelligence.com.au/for-agents',
  },
  openGraph: {
    title: 'For Real Estate Agents | White-Label Development Intelligence',
    description:
      'Embed subdivision and development feasibility tools on your agency website. Generate qualified leads and differentiate your brand.',
    type: 'website',
    url: 'https://casaintelligence.com.au/for-agents',
  },
};

export default function ForAgentsPage() {
  return (
    <>
      <AgentHeroSection />
      <AgentMockup />
      <AgentFeatures />
      <AgentPricing />
      <ContactCTA />
    </>
  );
}
