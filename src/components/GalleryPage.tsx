import { ArrowLeft, ArrowRight, Camera } from 'lucide-react';
import { GallerySection } from './GallerySection';

interface GalleryPageProps {
  onBackHome: (hash?: string) => void;
  onOpenProductsPage: () => void;
}

export function GalleryPage({ onBackHome, onOpenProductsPage }: GalleryPageProps) {
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
              onClick={onOpenProductsPage}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C8F52C] text-[#21063D] text-sm font-bold hover:bg-[#d8fa5c] transition-colors"
            >
              Explore LABAN Products
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-sm font-extrabold tracking-wide text-[#C8F52C] mb-2">
              <Camera className="w-4 h-4" />
              Campaign Visual Showcase
            </div>
            <h1
              className="font-display font-black tracking-tight text-white leading-[1.06]"
              style={{ fontSize: 'clamp(2.1rem, 4vw, 3.35rem)', textWrap: 'balance' }}
            >
              LABAN Lifestyle Gallery
            </h1>
            <p className="text-slate-200/90 mt-4 text-base leading-relaxed">
              Illustrative brand campaign imagery capturing Nigerian birthday celebrations, outdoor
              courtyard gatherings, Sunday family tables, and evening toasts with LABAN DRINK.
            </p>
          </div>
        </div>
      </section>

      <GallerySection />

      <section className="py-12 lg:py-16 bg-[#35105F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-sm font-bold text-[#C8F52C]">Stock LABAN for Your Next Event</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
              Bring Strawberry, Cola & Wine to your celebrations
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenProductsPage}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C8F52C] text-[#21063D] font-extrabold text-sm hover:bg-[#d8fa5c] transition-colors"
            >
              View Flavours
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onBackHome('#distributors')}
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              Become a Distributor
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
