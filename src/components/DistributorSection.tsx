import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, ShieldAlert, SlidersHorizontal } from 'lucide-react';
import { NIGERIAN_STATES } from '../data/states';

interface DistributorSectionProps {
  prefilledState?: string;
  onOpenAdmin: () => void;
}

export function DistributorSection({ prefilledState, onOpenAdmin }: DistributorSectionProps) {
  const renderedAtRef = useRef<number>(Date.now());
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState(prefilledState || 'Lagos');
  const [businessLocation, setBusinessLocation] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedRefId, setSubmittedRefId] = useState<string | null>(null);

  useEffect(() => {
    if (prefilledState) {
      setState(prefilledState);
    }
  }, [prefilledState]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const response = await fetch('/api/distributors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          businessName,
          phone,
          email,
          state,
          businessLocation,
          message,
          company_website: honeypot,
          _startedAt: renderedAtRef.current,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMsg(data.error || 'Could not submit your distributor enquiry.');
        return;
      }
      setSubmittedRefId(data.referenceId);
      setFullName('');
      setBusinessName('');
      setPhone('');
      setEmail('');
      setBusinessLocation('');
      setMessage('');
      renderedAtRef.current = Date.now();
    } catch {
      setErrorMsg('Network error submitting your enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="distributors" className="py-16 lg:py-24 bg-[#21063D] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5">
            <p className="text-sm font-semibold text-[#C8F52C] mb-2">Distributor Portal</p>
            <h2
              className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight"
              style={{ textWrap: 'balance' }}
            >
              Partner With LABAN DRINK Across Nigeria
            </h2>
            <p className="text-slate-200/90 mt-4 text-base leading-relaxed">
              We are expanding retail and wholesale territories across all 36 states and FCT Abuja.
              Register your business to connect with our regional trade coordination team.
            </p>

            <div className="mt-8 space-y-4 border-t border-white/15 pt-6 text-sm">
              <div>
                <p className="font-bold text-[#FFD33F]">Territory & Stock Allocation</p>
                <p className="text-slate-200/85 mt-1">
                  Structured supply support for supermarkets, major market wholesalers, and event suppliers.
                </p>
              </div>
              <div>
                <p className="font-bold text-[#FFD33F]">Consistent Three-Flavour Range</p>
                <p className="text-slate-200/85 mt-1">
                  Carry LABAN Strawberry, LABAN Cola, and LABAN Wine across single-serve and sharing packs.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#C8F52C] hover:underline underline-offset-4"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Administration Portal (Review Applications)
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white text-slate-900 rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xl">
              {submittedRefId ? (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#C8F52C]/40 text-[#21063D] flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#21063D]">
                    Distributor Enquiry Recorded
                  </h3>
                  <p className="text-sm text-slate-600 mt-2">
                    Reference ID: <strong className="font-mono text-[#21063D]">{submittedRefId}</strong>
                  </p>
                  <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                    Our regional distribution desk will review your territory and reach out promptly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmittedRefId(null)}
                    className="mt-6 px-5 py-2.5 rounded-xl bg-[#35105F] text-white text-sm font-semibold hover:bg-[#21063D]"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div>
                    <h3 className="font-display text-xl font-bold text-[#21063D]">
                      Distributor Registration Form
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Complete your trading details and state of operation below.
                    </p>
                  </div>

                  <div className="sr-only" aria-hidden="true">
                    <label htmlFor="dist-company-website">Leave empty</label>
                    <input
                      id="dist-company-website"
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
                      <label htmlFor="dist-fullname" className="block text-sm font-semibold text-slate-800 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        id="dist-fullname"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Chinedu Okafor"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#35105F]"
                      />
                    </div>

                    <div>
                      <label htmlFor="dist-business" className="block text-sm font-semibold text-slate-800 mb-1.5">
                        Business Name *
                      </label>
                      <input
                        id="dist-business"
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Horizon Beverage Ventures"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#35105F]"
                      />
                    </div>

                    <div>
                      <label htmlFor="dist-phone" className="block text-sm font-semibold text-slate-800 mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        id="dist-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 ..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-[#35105F]"
                      />
                    </div>

                    <div>
                      <label htmlFor="dist-email" className="block text-sm font-semibold text-slate-800 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        id="dist-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="orders@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#35105F]"
                      />
                    </div>

                    <div>
                      <label htmlFor="dist-state" className="block text-sm font-semibold text-slate-800 mb-1.5">
                        State of Operation *
                      </label>
                      <select
                        id="dist-state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#35105F]"
                      >
                        {NIGERIAN_STATES.map((s) => (
                          <option key={s.name} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="dist-location" className="block text-sm font-semibold text-slate-800 mb-1.5">
                        Business Location *
                      </label>
                      <input
                        id="dist-location"
                        type="text"
                        required
                        value={businessLocation}
                        onChange={(e) => setBusinessLocation(e.target.value)}
                        placeholder="City, town, or main market"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#35105F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="dist-message" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      Message & Capacity Details *
                    </label>
                    <textarea
                      id="dist-message"
                      rows={3}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your warehouse/shop coverage, current beverage lines, and target monthly volume..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#35105F]"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#35105F] text-white text-sm font-bold hover:bg-[#21063D] transition-colors disabled:opacity-60"
                    >
                      {submitting ? 'Submitting Enquiry...' : 'Submit Enquiry'}
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
