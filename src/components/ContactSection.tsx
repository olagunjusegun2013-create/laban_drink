import { useRef, useState } from 'react';
import { CheckCircle2, Mail, MapPin, MessageCircle, Phone, ShieldAlert } from 'lucide-react';
import type { BrandContactConfig } from '../types/api';

interface ContactSectionProps {
  config: BrandContactConfig;
}

export function ContactSection({ config }: ContactSectionProps) {
  const renderedAtRef = useRef<number>(Date.now());
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedRefId, setSubmittedRefId] = useState<string | null>(null);

  const whatsappUrl = `https://wa.me/${config.whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
    'Hello LABAN DRINK team, I would like to make an enquiry.'
  )}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          subject,
          message,
          company_website: honeypot,
          _startedAt: renderedAtRef.current,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMsg(data.error || 'Could not send your message.');
        return;
      }
      setSubmittedRefId(data.referenceId);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
      renderedAtRef.current = Date.now();
    } catch {
      setErrorMsg('Network error while sending your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="py-16 lg:py-24 bg-[#FAFAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5">
            <p className="text-sm font-semibold text-[#35105F] mb-2">Contact Us</p>
            <h2
              className="font-display text-3xl sm:text-4xl font-bold text-[#21063D] tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Connect With the LABAN DRINK Desk
            </h2>
            <p className="text-slate-600 mt-4 text-base leading-relaxed">
              Reach our commercial team for retail orders, event supply, press enquiries, or regional
              distribution support across Nigeria.
            </p>

            <div className="mt-8 space-y-5 border-t border-slate-200 pt-6 text-sm">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#35105F] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#21063D]">Telephone</p>
                  <a
                    href={`tel:${config.phone.replace(/[^\d+]/g, '')}`}
                    className="text-slate-600 hover:text-[#35105F] tabular-nums"
                  >
                    {config.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#35105F] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#21063D]">Business Email</p>
                  <a href={`mailto:${config.email}`} className="text-slate-600 hover:text-[#35105F]">
                    {config.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#35105F] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#21063D]">Head Office</p>
                  <p className="text-slate-600">{config.officeAddress}</p>
                  <p className="text-xs text-slate-500 mt-1 tabular-nums">{config.businessHours}</p>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C8F52C] text-[#21063D] font-bold text-sm hover:bg-[#d8fa5c] transition-colors whitespace-nowrap shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>

            <div className="mt-7 pt-6 border-t border-slate-200">
              <p className="text-xs font-semibold text-slate-500 mb-3">Official Social Channels</p>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-[#35105F]">
                <a
                  href={config.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Instagram
                </a>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <a
                  href={config.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Facebook
                </a>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <a
                  href={config.socialLinks.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  X (Twitter)
                </a>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <a
                  href={config.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              {submittedRefId ? (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#C8F52C]/40 text-[#21063D] flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#21063D]">Message Received</h3>
                  <p className="text-sm text-slate-600 mt-2">
                    Reference ID: <strong className="font-mono text-[#21063D]">{submittedRefId}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmittedRefId(null)}
                    className="mt-6 px-5 py-2.5 rounded-xl bg-[#35105F] text-white text-sm font-semibold hover:bg-[#21063D]"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div>
                    <h3 className="font-display text-xl font-bold text-[#21063D]">Send Us a Message</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Have a product or trade question? Write directly to our team.
                    </p>
                  </div>

                  <div className="sr-only" aria-hidden="true">
                    <label htmlFor="contact-company-website">Leave empty</label>
                    <input
                      id="contact-company-website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  {errorMsg && (
                    <div
                      role="alert"
                      className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800"
                    >
                      <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-semibold text-slate-800 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#35105F]"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-semibold text-slate-800 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#35105F]"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-phone" className="block text-sm font-semibold text-slate-800 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 ..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-[#35105F]"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-subject" className="block text-sm font-semibold text-slate-800 mb-1.5">
                        Subject *
                      </label>
                      <input
                        id="contact-subject"
                        type="text"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Event catering order"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#35105F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can the LABAN DRINK team help?"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#35105F]"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#35105F] text-white text-sm font-bold hover:bg-[#21063D] transition-colors disabled:opacity-60"
                    >
                      {submitting ? 'Sending Message...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
