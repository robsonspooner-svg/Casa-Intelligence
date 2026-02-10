import Brand from '@/components/brand/Brand';
import { Metadata } from 'next';
import Container from '@/components/layout/Container';
import FadeIn from '@/components/ui/FadeIn';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy policy for Casa Intelligence. How we collect, use, and protect your personal information under Australian Privacy Act 1988.',
  alternates: {
    canonical: 'https://casaintelligence.com.au/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-canvas">
      <Container variant="wide">
        <FadeIn>
          <div className="max-w-3xl mx-auto">
            <h1 className="font-serif text-3xl md:text-4xl mb-8">Privacy Policy</h1>

            <div className="prose prose-lg text-text-secondary space-y-6">
              <p className="text-sm text-text-tertiary">Last updated: February 2026</p>

              <h2 className="font-serif text-xl text-text-primary mt-8">1. Information We Collect</h2>
              <p>
                <Brand>Casa Intelligence</Brand> Pty Ltd (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) collects personal information
                that you voluntarily provide when you contact us through our website,
                including your name, email address, phone number, and property address.
              </p>

              <h2 className="font-serif text-xl text-text-primary mt-8">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Respond to your enquiries and provide our services</li>
                <li>Communicate with you about your project</li>
                <li>Improve our services and website</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="font-serif text-xl text-text-primary mt-8">3. Information Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information
                to third parties. We may share information with trusted service providers
                who assist us in operating our website and conducting our business,
                provided they agree to keep this information confidential.
              </p>

              <h2 className="font-serif text-xl text-text-primary mt-8">4. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal
                information. However, no method of electronic transmission or storage
                is 100% secure.
              </p>

              <h2 className="font-serif text-xl text-text-primary mt-8">5. Your Rights</h2>
              <p>
                Under the Australian Privacy Act 1988, you have the right to access,
                correct, and request deletion of your personal information. Contact us
                at hello@casaintelligence.com.au to exercise these rights.
              </p>

              <h2 className="font-serif text-xl text-text-primary mt-8">6. Contact</h2>
              <p>
                For questions about this privacy policy, contact us at
                hello@casaintelligence.com.au.
              </p>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
