'use client';

import { useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import Hero from './Hero';
import Container from '@/components/layout/Container';

const SiteAnalyserTabs = dynamic(() => import('@/components/analyser/SiteAnalyserTabs'), {
  ssr: false,
});

interface Candidate {
  address: string;
  lat: number;
  lng: number;
  score: number;
  suburb: string;
}

export default function HomePageClient() {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleAddressSelect = useCallback((candidate: Candidate) => {
    setSelectedCandidate(candidate);

    // Smooth scroll to results section after a short delay for render
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }, []);

  return (
    <>
      <Hero onAddressSelect={handleAddressSelect} />

      {/* Analysis results — always mounted so dynamic import stays alive, just hidden when empty */}
      <section ref={resultsRef} className={`bg-canvas ${selectedCandidate ? 'py-6' : ''}`}>
        <Container variant="full">
          <SiteAnalyserTabs externalCandidate={selectedCandidate} />
        </Container>
      </section>
    </>
  );
}
