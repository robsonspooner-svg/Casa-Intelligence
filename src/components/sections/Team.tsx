'use client';

import FadeIn from '@/components/ui/FadeIn';
import SectionHeading from '@/components/ui/SectionHeading';
import Container from '@/components/layout/Container';

const founders = [
  {
    initials: 'FS',
    name: 'Finlay Schulz',
    role: 'Co-Founder & Director',
    focus: 'Distribution, relationships, and deal origination',
    credentials: [
      '$20M+ in residential property sales',
      'Established network across Sunshine Coast agents, developers, and builders',
      'Deep understanding of buyer psychology and market positioning',
      'Identifies high-potential sites before they reach the open market',
    ],
  },
  {
    initials: 'RS',
    name: 'Robert Spooner',
    role: 'Co-Founder & Director',
    focus: 'Product, intelligence, and technical analysis',
    credentials: [
      'Master of Architecture',
      'Planning, architectural, and financial feasibility specialist',
      'Intimate knowledge of Sunshine Coast construction costs and timelines',
      'Integrates multiple disciplines into one cohesive deliverable',
    ],
  },
];

export default function Team() {
  return (
    <section className="section-padding bg-surface">
      <Container variant="wide">
        <SectionHeading
          badge="Our Team"
          title="Built by people who know property"
          subtitle="Deep local expertise amplified by proprietary intelligence. A combination no other advisory firm can replicate."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {founders.map((person, index) => (
            <FadeIn key={person.name} delay={index * 0.15}>
              <div className="bg-canvas rounded-card p-8 border border-border/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl gradient-navy flex items-center justify-center">
                    <span className="text-white font-serif text-xl">
                      {person.initials}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl">{person.name}</h3>
                    <p className="text-sm text-text-tertiary">{person.role}</p>
                  </div>
                </div>

                <p className="text-sm font-medium text-casa-navy mb-4">{person.focus}</p>

                <ul className="space-y-2.5">
                  {person.credentials.map((credential) => (
                    <li
                      key={credential}
                      className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-casa-navy/30 mt-1.5 flex-shrink-0" />
                      {credential}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
