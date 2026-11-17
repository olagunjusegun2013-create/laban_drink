import { useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { HERO_IMAGE, LABAN_PRODUCTS } from '../data/catalog';
import { LuxurySaleLogo } from './LuxurySaleLogo';

interface HeroSectionProps {
  onExploreProducts?: () => void;
  onDistributorEnquiry?: () => void;
}

const SIGN_ITEMS = [...LABAN_PRODUCTS, ...LABAN_PRODUCTS, ...LABAN_PRODUCTS];

export function HeroSection({ onExploreProducts, onDistributorEnquiry }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const smoothX = useSpring(pointerX, { stiffness: 120, damping: 22, mass: 0.6 });
  const smoothY = useSpring(pointerY, { stiffness: 120, damping: 22, mass: 0.6 });

  const signParallaxX = useTransform(smoothX, [0, 1], [60, -60]);
  const crestTiltX = useTransform(smoothY, [0, 1], [4, -4]);
  const crestTiltY = useTransform(smoothX, [0, 1], [-5, 5]);
  const spotlightLeft = useTransform(smoothX, [0, 1], ['15%', '85%']);
  const spotlightTop = useTransform(smoothY, [0, 1], ['20%', '80%']);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (prefersReducedMotion || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const nx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    pointerX.set(nx);
    pointerY.set(ny);
  }

  function handleMouseLeave() {
    setIsHovered(false);
    pointerX.set(0.5);
    pointerY.set(0.5);
  }

  return (
    <section
      id="top"
      ref={heroRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative bg-[#21063D] text-white overflow-hidden group"
    >
      <div className="relative min-h-[560px] lg:min-h-[640px] flex flex-col justify-between">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Chilled bottles of LABAN Strawberry, LABAN Cola, and LABAN Wine surrounded by fresh strawberries, dark grapes, mint leaves, lime slices, and crystal ice in warm sunlight"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#21063D]/92 via-[#21063D]/68 to-[#21063D]/20"
            aria-hidden="true"
          />
          {!prefersReducedMotion && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full blur-3xl transition-opacity duration-300"
              style={{
                left: spotlightLeft,
                top: spotlightTop,
                opacity: isHovered ? 0.24 : 0,
                background: 'radial-gradient(circle, rgba(255,211,63,0.55) 0%, rgba(200,245,44,0.18) 50%, transparent 75%)',
              }}
            />
          )}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-16 pb-10 lg:pt-24 lg:pb-14 flex-1 flex items-center">
          <div className="max-w-2xl">
            <motion.div
              className="mb-5 inline-block"
              style={
                prefersReducedMotion
                  ? undefined
                  : {
                      rotateX: crestTiltX,
                      rotateY: crestTiltY,
                      transformPerspective: 900,
                    }
              }
            >
              <LuxurySaleLogo
                variant="light"
                size="crest"
                onClick={onExploreProducts}
              />
            </motion.div>

            <h1
              className="font-display font-black tracking-tight text-white leading-[1.02] mb-5 drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)]"
              style={{ fontSize: 'clamp(2.55rem, 4.8vw, 4.35rem)', textWrap: 'balance' }}
            >
              Refreshment for Every Moment.
            </h1>
            <p className="text-base sm:text-lg font-semibold text-white leading-relaxed max-w-xl mb-8 drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]">
              Crafted in signature Strawberry, Cola, and Sparkling Grape Wine expressions for everyday
              refreshment, weekend celebrations, and thriving retail shelves across Nigeria.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              {onExploreProducts ? (
                <button
                  type="button"
                  onClick={onExploreProducts}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C8F52C] text-[#21063D] font-extrabold text-sm sm:text-base hover:bg-[#d8fa5c] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Explore Flavours
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              ) : (
                <a
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C8F52C] text-[#21063D] font-extrabold text-sm sm:text-base hover:bg-[#d8fa5c] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Explore Flavours
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </a>
              )}

              {onDistributorEnquiry ? (
                <button
                  type="button"
                  onClick={onDistributorEnquiry}
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl border-2 border-white/65 bg-[#21063D]/65 text-white font-bold text-sm sm:text-base hover:bg-white/15 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8F52C]"
                >
                  Distributor Enquiry
                </button>
              ) : (
                <a
                  href="#distributors"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl border-2 border-white/65 bg-[#21063D]/65 text-white font-bold text-sm sm:text-base hover:bg-white/15 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8F52C]"
                >
                  Distributor Enquiry
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Hover-Activated Product Sign Sweeping Across the Hero Section */}
        <div
          className={`relative z-10 w-full overflow-hidden border-t transition-all duration-300 ${
            isHovered
              ? 'bg-[#21063D]/90 border-[#FFD33F]/50 py-3'
              : 'bg-[#21063D]/65 border-white/15 py-2.5'
          }`}
        >
          <motion.div
            style={prefersReducedMotion ? undefined : { x: signParallaxX }}
            className="w-full"
          >
            <motion.div
              className="flex items-center gap-5 w-max px-4"
              animate={
                prefersReducedMotion
                  ? undefined
                  : isHovered
                    ? { x: ['0%', '-33.333%'] }
                    : { x: '0%' }
              }
              transition={
                isHovered
                  ? {
                      x: {
                        repeat: Infinity,
                        repeatType: 'loop',
                        duration: 14,
                        ease: 'linear',
                      },
                    }
                  : { duration: 0.45, ease: 'easeOut' }
              }
            >
              {SIGN_ITEMS.map((product, idx) => (
                <button
                  key={`${product.id}-${idx}`}
                  type="button"
                  onClick={onExploreProducts}
                  className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl border transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    isHovered
                      ? 'bg-[#35105F]/95 border-[#FFD33F]/55 shadow-[0_4px_20px_rgba(255,211,63,0.16)] scale-[1.01]'
                      : 'bg-[#35105F]/75 border-white/15'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-sm shrink-0"
                    style={{ backgroundColor: product.accentHex }}
                    aria-hidden="true"
                  />
                  <span className="font-display text-sm font-black tracking-wide text-white uppercase">
                    {product.name}
                  </span>
                  <span className="text-xs font-semibold text-[#C8F52C]">
                    {product.productInfo.category}
                  </span>
                  <span className="text-xs text-slate-200/85 tabular-nums hidden sm:inline">
                    · {product.bottleSizes[0]}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-[#FFD33F]" aria-hidden="true" />
                </button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="bg-[#35105F] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="font-bold text-base text-[#FFD33F]">Three Signature Flavours</p>
            <p className="font-medium text-white/90 mt-0.5">LABAN Strawberry, LABAN Cola & LABAN Wine</p>
          </div>
          <div>
            <p className="font-bold text-base text-[#FFD33F]">Nationwide Distribution Network</p>
            <p className="font-medium text-white/90 mt-0.5">Regional hubs serving all 36 states & FCT Abuja</p>
          </div>
          <div>
            <p className="font-bold text-base text-[#FFD33F]">Trade & Retail Partnerships</p>
            <p className="font-medium text-white/90 mt-0.5">Built for wholesalers, supermarkets, lounges & events</p>
          </div>
        </div>
      </div>
    </section>
  );
}
