import Hero from '@/components/sections/Hero';
import ServicesOverview from '@/components/sections/ServicesOverview';
import WhyCasa from '@/components/sections/WhyCasa';
import Process from '@/components/sections/Process';
import MarketContext from '@/components/sections/MarketContext';
import Team from '@/components/sections/Team';
import ContactCTA from '@/components/sections/ContactCTA';

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <WhyCasa />
      <Process />
      <MarketContext />
      <Team />
      <ContactCTA />
    </>
  );
}
