import { useEffect, useMemo, useState } from 'react';
import { Expand, X } from 'lucide-react';
import { LIFESTYLE_GALLERY, type GalleryItem } from '../data/catalog';
import { Tilt3DCard } from './Tilt3DCard';

const CATEGORIES: Array<'All Moments' | GalleryItem['category']> = [
  'All Moments',
  'Parties',
  'Outdoor',
  'Family',
  'Social',
];

export function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState<'All Moments' | GalleryItem['category']>('All Moments');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const visibleItems = useMemo(() => {
    if (selectedCategory === 'All Moments') {
      return LIFESTYLE_GALLERY;
    }
    return LIFESTYLE_GALLERY.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    if (!lightboxItem) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxItem(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxItem]);

  return (
    <section id="gallery" className="py-16 lg:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#35105F] mb-2">Lifestyle Gallery</p>
            <h2
              className="font-display text-3xl sm:text-4xl font-bold text-[#21063D] tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Shared Across Birthdays, Courtyards, and Family Tables
            </h2>
            <p className="text-sm text-slate-500 mt-2.5">
              Illustrative brand campaign photography showcasing LABAN DRINK moments across Nigeria.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter lifestyle gallery"
            className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto"
          >
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#35105F] ${
                    isActive
                      ? 'bg-[#35105F] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#21063D]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {visibleItems.map((item) => (
            <Tilt3DCard key={item.id} maxTilt={5}>
              <figure className="group bg-[#FAFAFC] rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <button
                  type="button"
                  onClick={() => setLightboxItem(item)}
                  className="relative block w-full aspect-[4/3] overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#35105F]"
                  aria-label={`View larger image: ${item.title}`}
                >
                  <img
                    src={item.image}
                    alt={item.alt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#21063D]/65 via-transparent to-transparent opacity-80"
                    aria-hidden="true"
                  />
                  <span className="absolute top-4 right-4 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#21063D]/75 text-white opacity-90 group-hover:opacity-100 transition-opacity">
                    <Expand className="w-4 h-4" />
                  </span>
                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <p className="text-xs font-semibold text-[#C8F52C]">{item.category}</p>
                    <p className="font-display text-xl font-bold mt-0.5">{item.title}</p>
                  </div>
                </button>
                <figcaption className="px-5 py-3.5 text-sm text-slate-600 border-t border-slate-200/80">
                  {item.caption}
                </figcaption>
              </figure>
            </Tilt3DCard>
          ))}
        </div>
      </div>

      {lightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.title}
          className="fixed inset-0 z-50 bg-[#140326]/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
              <div>
                <p className="text-xs font-semibold text-[#35105F]">{lightboxItem.category}</p>
                <h3 className="font-display text-lg font-bold text-[#21063D]">{lightboxItem.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-[#21063D]"
                aria-label="Close gallery preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-[#120422]">
              <img
                src={lightboxItem.image}
                alt={lightboxItem.alt}
                referrerPolicy="no-referrer"
                className="w-full max-h-[72vh] object-contain mx-auto"
              />
            </div>
            <div className="px-5 py-3.5 text-sm text-slate-600 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>{lightboxItem.caption}</span>
              <span className="text-xs text-slate-400">Illustrative brand campaign imagery</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
