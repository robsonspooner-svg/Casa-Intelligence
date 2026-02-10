'use client';

import Button from '@/components/ui/Button';
import { ArrowRight, FileText, Phone } from 'lucide-react';

interface CTAPromptProps {
  address?: string;
}

export default function CTAPrompt({ address }: CTAPromptProps) {
  const contactUrl = address
    ? `/contact?site=${encodeURIComponent(address)}`
    : '/contact';

  return (
    <div className="gradient-navy rounded-card p-6 md:p-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
        <FileText className="w-7 h-7 text-white/80" />
      </div>

      <h3 className="font-serif text-xl md:text-2xl text-white mb-2">
        Want the full picture?
      </h3>
      <p className="text-sm text-white/50 mb-6 max-w-md mx-auto leading-relaxed">
        This is a preliminary assessment based on publicly available data. Our formal
        feasibility report goes deeper: site-specific analysis, accurate costings,
        architectural yield studies, and a clear recommendation you can act on.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button
          href={contactUrl}
          size="lg"
          className="bg-white text-casa-navy hover:bg-white/90"
        >
          Request Full Report
          <ArrowRight className="w-5 h-5" />
        </Button>
        <Button
          href="tel:+61400000000"
          variant="outline"
          size="md"
        >
          <Phone className="w-4 h-4" />
          Call Us
        </Button>
      </div>

      <p className="text-[10px] text-white/30 mt-4">
        Free initial consultation, no obligation
      </p>
    </div>
  );
}
