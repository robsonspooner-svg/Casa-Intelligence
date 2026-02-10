'use client';

import { MapPin, Search, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Candidate {
  address: string;
  lat: number;
  lng: number;
  score: number;
  suburb: string;
}

interface AddressSearchProps {
  onSelect: (candidate: Candidate) => void;
}

export default function AddressSearch({ onSelect }: AddressSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/geocode?address=${encodeURIComponent(q)}`);
      const data = await res.json();
      const candidates = data.candidates || [];
      setResults(candidates);
      setIsOpen(candidates.length > 0);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    search(query);
  }, [query, search]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length >= 3) {
      debounceRef.current = setTimeout(() => search(query), 400);
    } else {
      setResults([]);
      setIsOpen(false);
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, search]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a Sunshine Coast address..."
            className="w-full h-14 pl-12 pr-4 rounded-2xl border border-border bg-surface text-base text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-casa-navy/20 focus:border-casa-navy transition-colors shadow-card"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={query.length < 3 || isLoading}
          className="h-14 px-6 rounded-2xl bg-casa-navy text-white font-medium text-sm hover:bg-casa-navy-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm flex items-center gap-2 flex-shrink-0"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-elevated overflow-hidden z-50">
          <div className="px-4 py-2 bg-subtle border-b border-border/50">
            <p className="text-[10px] text-text-tertiary uppercase tracking-wider font-semibold">
              Select an address to analyse
            </p>
          </div>
          {results.map((candidate, i) => (
            <button
              key={`${candidate.lat}-${candidate.lng}-${i}`}
              onClick={() => {
                onSelect(candidate);
                setQuery(candidate.address);
                setIsOpen(false);
              }}
              className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-subtle transition-colors border-b border-border/50 last:border-b-0"
            >
              <MapPin className="w-4 h-4 text-casa-navy mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-text-primary">{candidate.address}</p>
                {candidate.suburb && (
                  <p className="text-xs text-text-tertiary">{candidate.suburb}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
