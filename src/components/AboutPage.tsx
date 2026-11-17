import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AboutSection } from './AboutSection';

interface AboutPageProps {
  onBackHome: (hash?: string) => void;
  onOpenProductsPage: () => void;
  onOpenGalleryPage: () => void;
  onOpenDepotsPage: () => void;
  onOpenContactPage: () => void;
}

export function AboutPage({
  onBackHome,
  onOpenProductsPage,
  onOpenGalleryPage,
  onOpenDepotsPage,
  onOpenContactPage,
}: AboutPageProps) {
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/15 transition-colors"
            >
              Explore Our Flavours
              <ArrowRight className="w-4 h-4 text-[#C8F52C]" />
            </button>
          </div>

          <div className="max-w-3xl">
            <p className="text-sm font-extrabold tracking-wide text-[#C8F52C] mb-2">
              Our Story, Mission & Vision
            </p>
            <h1
              className="font-display font-black tracking-tight text-white leading-[1.06]"
              style={{ fontSize: 'clamp(2.1rem, 4vw, 3.35rem)', textWrap: 'balance' }}
            >
              About LABAN DRINK
            </h1>
            <p className="text-slate-200/90 mt-4 text-base sm:text-lg leading-relaxed">
              Refreshment for Every Moment — crafted to unite vibrant Nigerian celebrations with dependable
              retail and wholesale trade supply nationwide.
            </p>
          </div>
        </div>
      </section>

      <AboutSection
        onOpenDepotsPage={onOpenDepotsPage}
        onOpenContactPage={onOpenContactPage}
      />

      <section className="py-12 lg:py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-[#FAFAFC] p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-[#35105F]">Product Lineup</p>
              <h2 className="font-display text-xl font-bold text-[#21063D] mt-1.5">
                Strawberry, Cola & Wine
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Explore bottle sizes, serving occasions, and 3D packaging views for every flavour.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenProductsPage}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#35105F] hover:text-[#21063D]"
            >
              Go to Products Page
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-[#FAFAFC] p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-[#35105F]">Brand Moments</p>
              <h2 className="font-display text-xl font-bold text-[#21063D] mt-1.5">
                Lifestyle Gallery
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                See illustrative campaign photography from birthday lounges, courtyards, and family meals.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenGalleryPage}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#35105F] hover:text-[#21063D]"
            >
              View Gallery Page
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-[#FAFAFC] p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-[#35105F]">Distribution Network</p>
              <h2 className="font-display text-xl font-bold text-[#21063D] mt-1.5">
                36 States & FCT Coverage
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Search confirmed operational depots and wholesale coverage desks across Nigeria.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenDepotsPage}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#35105F] hover:text-[#21063D]"
            >
              Open Depots Page
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
