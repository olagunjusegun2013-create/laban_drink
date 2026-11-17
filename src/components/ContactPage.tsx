import { ArrowLeft, ArrowRight, Mail, MessageCircle, Phone } from 'lucide-react';
import type { BrandContactConfig } from '../types/api';
import { ContactSection } from './ContactSection';

interface ContactPageProps {
  config: BrandContactConfig;
  onBackHome: (hash?: string) => void;
  onOpenDepotsPage: () => void;
}

export function ContactPage({ config, onBackHome, onOpenDepotsPage }: ContactPageProps) {
  const whatsappUrl = `https://wa.me/${config.whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
    'Hello LABAN DRINK team, I would like to make an enquiry.'
  )}`;

  return (
    <div className="bg-[#FAFAFC]">
      <section className="bg-[#21063D] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <button
              type="button"
              onClick={() => onBackHome()}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#C8F52C] hover:underline underline-offset-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Homepage
            </button>

            <button
              type="button"
              onClick={onOpenDepotsPage}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/15 transition-colors"
            >
              Browse Nigeria Depots
              <ArrowRight className="w-4 h-4 text-[#C8F52C]" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <p className="text-sm font-extrabold tracking-wide text-[#C8F52C] mb-2">
                Customer & Trade Support
              </p>
              <h1
                className="font-display font-black tracking-tight text-white leading-[1.06]"
                style={{ fontSize: 'clamp(2.1rem, 4vw, 3.35rem)', textWrap: 'balance' }}
              >
                Contact LABAN DRINK
              </h1>
              <p className="text-slate-200/90 mt-4 text-base leading-relaxed max-w-2xl">
                Speak directly with our commercial and customer care desks via telephone, WhatsApp,
                or email, or send an enquiry using the verified contact form below.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
              <a
                href={`tel:${config.phone.replace(/[^\d+]/g, '')}`}
                className="rounded-xl bg-[#35105F] border border-white/15 p-3.5 flex items-center gap-3 hover:border-[#C8F52C]/60 transition-colors"
              >
                <Phone className="w-4 h-4 text-[#C8F52C] shrink-0" />
                <span className="text-sm font-semibold text-white tabular-nums">{config.phone}</span>
              </a>
              <a
                href={`mailto:${config.email}`}
                className="rounded-xl bg-[#35105F] border border-white/15 p-3.5 flex items-center gap-3 hover:border-[#C8F52C]/60 transition-colors"
              >
                <Mail className="w-4 h-4 text-[#C8F52C] shrink-0" />
                <span className="text-sm font-semibold text-white truncate">{config.email}</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-[#C8F52C] text-[#21063D] p-3.5 flex items-center justify-between font-bold text-sm hover:bg-[#d8fa5c] transition-colors"
              >
                <span className="inline-flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Chat Directly on WhatsApp
                </span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <ContactSection config={config} />
    </div>
  );
}
