'use client';

import Button from '@/components/ui/Button';
import FadeIn from '@/components/ui/FadeIn';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Container from '@/components/layout/Container';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import { FormEvent, useState } from 'react';

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function ContactCTA() {
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState('loading');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      message: formData.get('message') as string,
    };

    try {
      const res = await fetch('https://formspree.io/f/mpqjwgzg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Something went wrong. Please try again.');
      }

      setFormState('success');
    } catch (err) {
      setFormState('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <section className="section-padding gradient-navy" id="contact">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Form */}
          <FadeIn direction="left">
            <div>
              <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-white/40 mb-4">
                Get in Touch
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-3">
                Ready to unlock your site&apos;s potential?
              </h2>
              <p className="text-white/50 mb-8 leading-relaxed">
                Tell us about your property. We&apos;ll give you an honest assessment of
                whether a feasibility study is worthwhile — no obligation.
              </p>

              {formState === 'success' ? (
                <div className="bg-white/5 border border-white/10 rounded-card p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="font-serif text-xl text-white mb-2">Thank you</h3>
                  <p className="text-white/50 text-sm">
                    We&apos;ve received your enquiry and will be in touch within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="block text-sm font-medium text-white/70">
                        Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        required
                        placeholder="Your name"
                        className="w-full h-12 px-4 rounded-button border border-white/10 bg-white/5 text-[15px] text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="block text-sm font-medium text-white/70">
                        Email *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="w-full h-12 px-4 rounded-button border border-white/10 bg-white/5 text-[15px] text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="block text-sm font-medium text-white/70">
                        Phone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="04XX XXX XXX"
                        className="w-full h-12 px-4 rounded-button border border-white/10 bg-white/5 text-[15px] text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="address" className="block text-sm font-medium text-white/70">
                        Property Address
                      </label>
                      <input
                        id="address"
                        name="address"
                        placeholder="Site address (if known)"
                        className="w-full h-12 px-4 rounded-button border border-white/10 bg-white/5 text-[15px] text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="message" className="block text-sm font-medium text-white/70">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      placeholder="Tell us about your site or project..."
                      className="w-full px-4 py-3 rounded-button border border-white/10 bg-white/5 text-[15px] text-white placeholder:text-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
                    />
                  </div>

                  {formState === 'error' && (
                    <p className="text-sm text-red-400">{errorMessage}</p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={formState === 'loading'}
                    className="w-full sm:w-auto bg-white text-casa-navy hover:bg-white/90"
                  >
                    {formState === 'loading' ? 'Sending...' : 'Send Enquiry'}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </form>
              )}
            </div>
          </FadeIn>

          {/* Right: Contact Info */}
          <FadeIn direction="right" delay={0.2}>
            <div className="lg:pt-20">
              <div className="space-y-8">
                <div>
                  <p className="text-xs font-semibold tracking-[0.15em] uppercase text-white/30 mb-3">
                    Call us directly
                  </p>
                  <a
                    href="tel:+61400000000"
                    className="flex items-center gap-3 text-2xl md:text-3xl font-serif text-white hover:text-white/80 transition-colors"
                  >
                    <Phone className="w-6 h-6" />
                    0400 000 000
                  </a>
                </div>

                <div>
                  <p className="text-xs font-semibold tracking-[0.15em] uppercase text-white/30 mb-3">
                    Email
                  </p>
                  <a
                    href="mailto:hello@casaintelligence.com.au"
                    className="flex items-center gap-3 text-lg text-white/70 hover:text-white transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    hello@casaintelligence.com.au
                  </a>
                </div>

                <div>
                  <p className="text-xs font-semibold tracking-[0.15em] uppercase text-white/30 mb-3">
                    Location
                  </p>
                  <div className="flex items-start gap-3 text-lg text-white/70">
                    <MapPin className="w-5 h-5 mt-0.5" />
                    <div>
                      Sunshine Coast, Queensland
                      <br />
                      <span className="text-sm text-white/40">
                        Servicing the broader South East Queensland corridor
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs font-semibold tracking-[0.15em] uppercase text-white/30 mb-3">
                    Response Time
                  </p>
                  <p className="text-white/70 leading-relaxed">
                    We respond to all enquiries within 24 hours. For urgent matters, call
                    us directly.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
