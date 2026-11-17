import { ArrowRight, Building2, Camera, MapPinned, MessageSquare, Sparkles } from 'lucide-react';
import type { PageRoute } from '../App';

interface HomeExploreStripProps {
  onNavigate: (page: PageRoute, hash?: string) => void;
}

const EXPLORE_PAGES: Array<{
  page: Exclude<PageRoute, 'home'>;
  label: string;
  title: string;
  summary: string;
  cta: string;
  icon: typeof Sparkles;
}> = [
  {
    page: 'products',
    label: 'Product Collection',
    title: 'Our Products',
    summary: 'Explore LABAN Strawberry, Cola & Wine formats, sizes, and 3D bottle inspection.',
    cta: 'Open Products Page',
    icon: Sparkles,
  },
  {
    page: 'about',
    label: 'Brand Story',
    title: 'About LABAN DRINK',
    summary: 'Read our company background, mission, vision, and commitment to Nigerian trade.',
    cta: 'Open About Page',
    icon: Building2,
  },
  {
    page: 'gallery',
    label: 'Brand Moments',
    title: 'Lifestyle Gallery',
    summary: 'Browse illustrative campaign visuals from celebrations, courtyards, and family meals.',
    cta: 'Open Gallery Page',
    icon: Camera,
  },
  {
    page: 'depots',
    label: 'Distribution Reach',
    title: 'Nigeria Depots',
    summary: 'Search confirmed operational depots and state coverage desks across 36 states & FCT.',
    cta: 'Open Depots Page',
    icon: MapPinned,
  },
  {
    page: 'contact',
    label: 'Trade & Care Desk',
    title: 'Contact Us',
    summary: 'Reach our team by telephone, WhatsApp, office address, or verified enquiry form.',
    cta: 'Open Contact Page',
    icon: MessageSquare,
  },
];

export function HomeExploreStrip({ onNavigate }: HomeExploreStripProps) {
  return (
    <section className="py-14 lg:py-20 bg-[#FAFAFC] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <p className="text-sm font-semibold text-[#35105F] mb-2">Explore LABAN DRINK</p>
          <h2
            className="font-display text-3xl sm:text-4xl font-bold text-[#21063D] tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            Dedicated Pages for Every Part of Our Brand
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {EXPLORE_PAGES.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.page}
                type="button"
                onClick={() => onNavigate(item.page)}
                className="group text-left rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between hover:border-[#35105F]/40 hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#35105F]"
              >
                <div>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#35105F]/10 text-[#35105F] group-hover:bg-[#35105F] group-hover:text-[#C8F52C] transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-500 mt-4">{item.label}</p>
                  <h3 className="font-display text-lg font-bold text-[#21063D] mt-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                    {item.summary}
                  </p>
                </div>

                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#35105F] group-hover:text-[#21063D]">
                  {item.cta}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
