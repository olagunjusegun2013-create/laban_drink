import { useMemo, useState } from 'react';
import { Search, ArrowUpRight, Info, Box } from 'lucide-react';
import { LABAN_PRODUCTS, type FlavourKey, type ProductItem } from '../data/catalog';
import { Tilt3DCard } from './Tilt3DCard';

interface ProductsSectionProps {
  onSelectEnquiry: (product: ProductItem) => void;
  onSelectDetails: (product: ProductItem, startIn3D?: boolean) => void;
}

const FLAVOUR_TABS: Array<{ id: 'all' | FlavourKey; label: string }> = [
  { id: 'all', label: 'All Flavours' },
  { id: 'strawberry', label: 'Strawberry' },
  { id: 'cola', label: 'Cola' },
  { id: 'wine', label: 'Wine' },
];

export function ProductsSection({ onSelectEnquiry, onSelectDetails }: ProductsSectionProps) {
  const [activeFlavour, setActiveFlavour] = useState<'all' | FlavourKey>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return LABAN_PRODUCTS.filter((product) => {
      if (activeFlavour !== 'all' && product.id !== activeFlavour) {
        return false;
      }
      if (q) {
        const text = `${product.name} ${product.tagline} ${product.description} ${product.bottleSizes.join(' ')} ${product.servingOccasion}`.toLowerCase();
        return text.includes(q);
      }
      return true;
    });
  }, [activeFlavour, searchQuery]);

  return (
    <section id="products" className="py-16 lg:py-24 bg-[#FAFAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#35105F] mb-2">Our Products</p>
            <h2
              className="font-display text-3xl sm:text-4xl font-bold text-[#21063D] tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Three Distinct Expressions of LABAN Refreshment
            </h2>
            <p className="text-slate-600 mt-3 text-base leading-relaxed">
              Every bottle carries consistent LABAN branding, crisp chilled presentation, and formats tailored for
              retail shelves, hospitality venues, and social gatherings.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search flavour or size..."
                aria-label="Search LABAN products"
                className="w-full sm:w-64 pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#35105F]"
              />
            </div>

            <div
              role="tablist"
              aria-label="Filter products by flavour"
              className="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl overflow-x-auto"
            >
              {FLAVOUR_TABS.map((tab) => {
                const isActive = activeFlavour === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveFlavour(tab.id)}
                    className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#35105F] ${
                      isActive
                        ? 'bg-[#35105F] text-white shadow-sm'
                        : 'text-slate-700 hover:text-[#21063D]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 mt-10 px-6">
            <p className="text-lg font-semibold text-[#21063D]">No matching LABAN products found</p>
            <p className="text-sm text-slate-600 mt-1">
              Try clearing your search or selecting All Flavours.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveFlavour('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-[#35105F] text-white text-sm font-semibold hover:bg-[#21063D]"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Tilt3DCard key={product.id} className="h-full">
                <article className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden flex flex-col h-full shadow-sm hover:shadow-xl transition-shadow duration-200">
                  <div className="relative aspect-[4/3] bg-[#160826] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.imageAlt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                    <button
                      type="button"
                      onClick={() => onSelectDetails(product, true)}
                      className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21063D]/90 text-[#C8F52C] text-xs font-bold border border-white/15 hover:bg-[#35105F] transition-colors"
                      aria-label={`Inspect ${product.name} in 3D`}
                    >
                      <Box className="w-3.5 h-3.5" />
                      3D View
                    </button>
                    <div
                      className="absolute inset-x-0 bottom-0 h-1.5"
                      style={{ backgroundColor: product.accentHex }}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <span style={{ color: product.accentHex }} className="font-semibold">
                        {product.productInfo.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{product.servingOccasion.split(',')[0]}</span>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-[#21063D] mt-2">
                      {product.name}
                    </h3>
                    <p className="text-sm font-medium text-slate-700 mt-1">{product.tagline}</p>
                    <p className="text-sm text-slate-600 leading-relaxed mt-3">{product.description}</p>

                    <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5 text-xs sm:text-sm">
                      <div>
                        <span className="font-semibold text-[#21063D] block">Available Bottle Sizes</span>
                        <span className="text-slate-600 tabular-nums">
                          {product.bottleSizes.join(' · ')}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-[#21063D] block">Serving & Channel Fit</span>
                        <span className="text-slate-600">{product.productInfo.servingStyle}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => onSelectEnquiry(product)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#35105F] text-white text-sm font-semibold hover:bg-[#21063D] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#35105F]"
                      >
                        Product Enquiry
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectDetails(product, false)}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:text-[#21063D] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#35105F]"
                      >
                        <Info className="w-4 h-4" />
                        Info
                      </button>
                    </div>
                  </div>
                </article>
              </Tilt3DCard>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
