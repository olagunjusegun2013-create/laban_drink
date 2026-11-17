import { useEffect, useRef, useState } from 'react';
import { Box, Camera, CheckCircle2, MessageCircle, ShieldAlert, X } from 'lucide-react';
import { NIGERIAN_STATES } from '../data/states';
import type { FlavourKey, ProductItem } from '../data/catalog';
import type { BrandContactConfig } from '../types/api';
import { LabanBottleStage } from '../three/LabanBottleStage';

interface ProductModalProps {
  product: ProductItem | null;
  mode: 'details' | 'enquiry';
  initial3DView?: boolean;
  config: BrandContactConfig;
  onClose: () => void;
  onSwitchToEnquiry: () => void;
  onSelectProductByFlavour: (flavour: FlavourKey) => void;
}

export function ProductModal({
  product,
  mode,
  initial3DView = false,
  config,
  onClose,
  onSwitchToEnquiry,
  onSelectProductByFlavour,
}: ProductModalProps) {
  const renderedAtRef = useRef<number>(Date.now());
  const [view3D, setView3D] = useState(initial3DView);
  const [bottleSize, setBottleSize] = useState('');
  const [enquiryType, setEnquiryType] = useState<'Retail' | 'Wholesale' | 'Event Catering'>('Wholesale');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('Lagos');
  const [notes, setNotes] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedRefId, setSubmittedRefId] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setBottleSize(product.bottleSizes[0] || '');
      setErrorMsg(null);
      setSubmittedRefId(null);
      renderedAtRef.current = Date.now();
    }
  }, [product, mode]);

  useEffect(() => {
    setView3D(initial3DView);
  }, [initial3DView, product?.id]);

  useEffect(() => {
    if (!product) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const whatsappText = encodeURIComponent(
    `Hello LABAN DRINK team, I am interested in ${product.name} (${bottleSize || product.bottleSizes[0]}) for ${enquiryType}.`
  );
  const whatsappUrl = `https://wa.me/${config.whatsapp.replace(/[^\d]/g, '')}?text=${whatsappText}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!product) return;
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const response = await fetch('/api/product-enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          bottleSize,
          enquiryType,
          name,
          phone,
          email,
          state,
          notes,
          company_website: honeypot,
          _startedAt: renderedAtRef.current,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMsg(data.error || 'Could not submit product enquiry.');
        return;
      }
      setSubmittedRefId(data.referenceId);
      setName('');
      setPhone('');
      setEmail('');
      setNotes('');
    } catch {
      setErrorMsg('Network error submitting your enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} ${mode === 'details' ? 'Information' : 'Enquiry'}`}
      className="fixed inset-0 z-50 bg-[#140326]/85 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <p className="text-xs font-semibold" style={{ color: product.accentHex }}>
              {product.productInfo.category}
            </p>
            <h3 className="font-display text-xl font-bold text-[#21063D]">{product.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            {mode === 'details' && (
              <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setView3D(false)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold ${
                    !view3D ? 'bg-[#35105F] text-white' : 'text-slate-600'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  Photo
                </button>
                <button
                  type="button"
                  onClick={() => setView3D(true)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold ${
                    view3D ? 'bg-[#35105F] text-white' : 'text-slate-600'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  3D Bottle
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-[#21063D]"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {mode === 'details' ? (
          <div className="p-6 space-y-6">
            {view3D ? (
              <LabanBottleStage
                compact
                activeFlavour={product.id}
                onFlavourChange={onSelectProductByFlavour}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                <div className="sm:col-span-5 aspect-[4/3] rounded-xl overflow-hidden bg-[#160826]">
                  <img
                    src={product.image}
                    alt={product.imageAlt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="sm:col-span-7 space-y-3">
                  <p className="text-sm font-semibold text-[#21063D]">{product.tagline}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-slate-500">Available Bottle Sizes</p>
                    <p className="text-sm font-medium text-[#21063D] mt-0.5 tabular-nums">
                      {product.bottleSizes.join(' · ')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-sm">
              <div>
                <p className="font-semibold text-[#21063D]">Serving Style</p>
                <p className="text-slate-600 mt-0.5">{product.productInfo.servingStyle}</p>
              </div>
              <div>
                <p className="font-semibold text-[#21063D]">Packaging Formats</p>
                <p className="text-slate-600 mt-0.5">{product.productInfo.packagingFormats}</p>
              </div>
              <div>
                <p className="font-semibold text-[#21063D]">Best Occasions</p>
                <p className="text-slate-600 mt-0.5">{product.servingOccasion}</p>
              </div>
              <div>
                <p className="font-semibold text-[#21063D]">Trade & Channel Fit</p>
                <p className="text-slate-600 mt-0.5">{product.productInfo.channelSuitability}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-[#21063D] hover:bg-slate-50"
              >
                <MessageCircle className="w-4 h-4" />
                Enquire on WhatsApp
              </a>
              <button
                type="button"
                onClick={onSwitchToEnquiry}
                className="px-5 py-2.5 rounded-xl bg-[#35105F] text-white text-sm font-bold hover:bg-[#21063D]"
              >
                Request Product Supply
              </button>
            </div>
          </div>
        ) : submittedRefId ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[#C8F52C]/40 text-[#21063D] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-display text-2xl font-bold text-[#21063D]">
              Product Enquiry Submitted
            </h4>
            <p className="text-sm text-slate-600 mt-2">
              Reference ID: <strong className="font-mono text-[#21063D]">{submittedRefId}</strong>
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C8F52C] text-[#21063D] text-sm font-bold"
              >
                <MessageCircle className="w-4 h-4" />
                Follow Up on WhatsApp
              </a>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-[#35105F] text-white text-sm font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
            <div className="sr-only" aria-hidden="true">
              <label htmlFor="prod-company-website">Leave empty</label>
              <input
                id="prod-company-website"
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
                <label htmlFor="prod-size" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Preferred Bottle Size
                </label>
                <select
                  id="prod-size"
                  value={bottleSize}
                  onChange={(e) => setBottleSize(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#35105F]"
                >
                  {product.bottleSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="prod-type" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Enquiry Type
                </label>
                <select
                  id="prod-type"
                  value={enquiryType}
                  onChange={(e) => setEnquiryType(e.target.value as 'Retail' | 'Wholesale' | 'Event Catering')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#35105F]"
                >
                  <option value="Wholesale">Wholesale</option>
                  <option value="Retail">Retail</option>
                  <option value="Event Catering">Event Catering</option>
                </select>
              </div>

              <div>
                <label htmlFor="prod-name" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Full Name *
                </label>
                <input
                  id="prod-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#35105F]"
                />
              </div>

              <div>
                <label htmlFor="prod-phone" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Phone Number *
                </label>
                <input
                  id="prod-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 ..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-[#35105F]"
                />
              </div>

              <div>
                <label htmlFor="prod-email" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Email Address *
                </label>
                <input
                  id="prod-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#35105F]"
                />
              </div>

              <div>
                <label htmlFor="prod-state" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  State *
                </label>
                <select
                  id="prod-state"
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
            </div>

            <div>
              <label htmlFor="prod-notes" className="block text-sm font-semibold text-slate-800 mb-1.5">
                Quantity or Delivery Notes
              </label>
              <textarea
                id="prod-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share estimated case volume, event date, or delivery city..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#35105F]"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#35105F] hover:underline"
              >
                <MessageCircle className="w-4 h-4" />
                Enquire directly on WhatsApp
              </a>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-[#35105F] text-white text-sm font-bold hover:bg-[#21063D] disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Submit Product Enquiry'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
