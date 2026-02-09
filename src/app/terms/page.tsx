import { Metadata } from 'next';
import Container from '@/components/layout/Container';
import FadeIn from '@/components/ui/FadeIn';

export const metadata: Metadata = {
  title: 'Terms of Service',
};

export default function TermsPage() {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-canvas">
      <Container>
        <FadeIn>
          <div className="max-w-3xl mx-auto">
            <h1 className="font-serif text-3xl md:text-4xl mb-8">Terms of Service</h1>

            <div className="prose prose-lg text-text-secondary space-y-6">
              <p className="text-sm text-text-tertiary">Last updated: February 2026</p>

              <h2 className="font-serif text-xl text-text-primary mt-8">1. Services</h2>
              <p>
                Casa Intelligence Pty Ltd provides development feasibility reports,
                pre-development management services, and development advisory services.
                All services are subject to a separate engagement agreement.
              </p>

              <h2 className="font-serif text-xl text-text-primary mt-8">2. Use of Website</h2>
              <p>
                This website is provided for informational purposes only. The content
                does not constitute professional advice. You should obtain professional
                advice specific to your circumstances before making any property
                development decisions.
              </p>

              <h2 className="font-serif text-xl text-text-primary mt-8">3. Disclaimer</h2>
              <p>
                While we endeavour to ensure the accuracy of information on this website,
                we make no warranties or representations about the completeness, accuracy,
                reliability, or suitability of the information. Any reliance you place on
                such information is at your own risk.
              </p>

              <h2 className="font-serif text-xl text-text-primary mt-8">4. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Casa Intelligence Pty Ltd shall
                not be liable for any indirect, incidental, special, or consequential
                damages arising out of or in connection with the use of this website or
                our services.
              </p>

              <h2 className="font-serif text-xl text-text-primary mt-8">5. Intellectual Property</h2>
              <p>
                All content on this website, including text, graphics, logos, and images,
                is the property of Casa Intelligence Pty Ltd and is protected by
                Australian and international intellectual property laws.
              </p>

              <h2 className="font-serif text-xl text-text-primary mt-8">6. Governing Law</h2>
              <p>
                These terms are governed by the laws of Queensland, Australia. Any
                disputes shall be subject to the exclusive jurisdiction of the courts
                of Queensland.
              </p>

              <h2 className="font-serif text-xl text-text-primary mt-8">7. Contact</h2>
              <p>
                For questions about these terms, contact us at
                hello@casaintelligence.com.au.
              </p>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
