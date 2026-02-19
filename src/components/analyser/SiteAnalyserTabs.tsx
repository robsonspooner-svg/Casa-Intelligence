'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import AddressSearch from './AddressSearch';

const SubdivisionAnalyser = dynamic(() => import('./SubdivisionAnalyser'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-6 h-6 text-casa-navy animate-spin" />
    </div>
  ),
});

const SiteAnalyser = dynamic(() => import('./SiteAnalyser'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-6 h-6 text-casa-navy animate-spin" />
    </div>
  ),
});

interface Candidate {
  address: string;
  lat: number;
  lng: number;
  score: number;
  suburb: string;
}

type Tab = 'subdivision' | 'development';

interface SiteAnalyserTabsProps {
  /** When provided externally (e.g. from the Hero search bar), hides the built-in search */
  externalCandidate?: Candidate | null;
}

export default function SiteAnalyserTabs({ externalCandidate }: SiteAnalyserTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('subdivision');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const lastExternalAddressRef = useRef<string | null>(null);

  // Sync external candidate from Hero search bar — dedup by address to prevent re-triggers
  useEffect(() => {
    if (externalCandidate && externalCandidate.address !== lastExternalAddressRef.current) {
      lastExternalAddressRef.current = externalCandidate.address;
      setSelectedCandidate(externalCandidate);
    }
  }, [externalCandidate]);

  const handleSelect = useCallback((candidate: Candidate) => {
    setSelectedCandidate(candidate);
  }, []);

  const isExternallyDriven = externalCandidate !== undefined;

  return (
    <div className="space-y-4">
      {/* Shared address search — hidden when driven by the Hero search bar */}
      {!isExternallyDriven && (
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-text-primary mb-4">
            Search your property now
          </h2>
          <AddressSearch onSelect={handleSelect} />
          <p className="text-xs text-text-tertiary mt-2">
            Search any address in South East Queensland
          </p>
        </div>
      )}

      {/* Tab switcher — only show when we have a selected address */}
      {selectedCandidate && (
        <div className="flex justify-center">
          <div className="inline-flex bg-subtle rounded-xl p-1 gap-1">
            <button
              onClick={() => setActiveTab('subdivision')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'subdivision'
                  ? 'bg-casa-navy text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              Subdivision
            </button>
            <button
              onClick={() => setActiveTab('development')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'development'
                  ? 'bg-casa-navy text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              Development
            </button>
          </div>
        </div>
      )}

      {/* Tab content */}
      {selectedCandidate && (
        activeTab === 'subdivision' ? (
          <SubdivisionAnalyser selectedCandidate={selectedCandidate} />
        ) : (
          <SiteAnalyser selectedCandidate={selectedCandidate} />
        )
      )}
    </div>
  );
}
