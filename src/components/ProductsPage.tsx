import { ArrowLeft, ArrowRight, PackageCheck } from 'lucide-react';
import { LABAN_PRODUCTS, type ProductItem } from '../data/catalog';
import { LuxurySaleLogo } from './LuxurySaleLogo';
import { ProductsSection } from './ProductsSection';

interface ProductsPageProps {
  onBackHome: (hash?: string) => void;
  onSelectEnquiry: (product: ProductItem) => void;
  onSelectDetails: (product: ProductItem, startIn3D?: boolean) => void;
  onOpenDepotsPage: () => void;
}

export function ProductsPage({
  onBackHome,
  onSelectEnquiry,
  onSelectDetails,
  onOpenDepotsPage,
}: ProductsPageProps) {
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
              onClick={() => onBackHome('#distributors')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C8F52C] text-[#21063D] text-sm font-bold hover:bg-[#d8fa5c] transition-colors"
            >
              Wholesale & Distributor Enquiry
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <div className="mb-4">
                <LuxurySaleLogo variant="light" size="crest" />
              </div>
              <h1
                className="font-display font-black tracking-tight text-white leading-[1.06]"
                style={{ fontSize: 'clamp(2.1rem, 4vw, 3.35rem)', textWrap: 'balance' }}
              >
                Signature Flavours Crafted for Every Occasion
              </h1>
              <p className="text-slate-200/90 mt-4 text-base leading-relaxed max-w-2xl">
                Explore LABAN Strawberry, LABAN Cola, and LABAN Wine. Compare bottle formats,
                inspect interactive 3D packaging, and submit retail, event, or wholesale supply enquiries.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-3 gap-3">
              {LABAN_PRODUCTS.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl bg-[#35105F] border border-white/15 p-3.5"
                >
                  <span
                    className="inline-block w-3 h-3 rounded-sm mb-2"
                    style={{ backgroundColor: item.accentHex }}
                    aria-hidden="true"
                  />
                  <p className="font-display text-sm font-bold text-white leading-snug">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-300 mt-1">{item.bottleSizes.length} bottle sizes</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ProductsSection
        onSelectEnquiry={onSelectEnquiry}
        onSelectDetails={onSelectDetails}
      />

      <section className="py-12 lg:py-16 bg-[#35105F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-sm font-bold text-[#C8F52C]">
              <PackageCheck className="w-4 h-4" />
              Retail, Events & Wholesale Dispatch
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1.5">
              Need regional stock or pallet allocations across Nigeria?
            </h2>
            <p className="text-slate-200/90 text-sm sm:text-base mt-2">
              Locate confirmed LABAN operational depots near you or register your distribution business.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenDepotsPage}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C8F52C] text-[#21063D] font-extrabold text-sm hover:bg-[#d8fa5c] transition-colors"
            >
              Browse Nigeria Depots
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onBackHome('#distributors')}
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              Apply as Distributor
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
