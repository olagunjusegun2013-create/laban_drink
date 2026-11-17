import { ArrowLeft, ArrowRight, Compass, MapPinned, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { useMemo } from 'react';
import type { BrandContactConfig, DepotRecord } from '../types/api';
import { DepotDirectorySection } from './DepotDirectorySection';

interface DepotsPageProps {
  depots: DepotRecord[];
  loading: boolean;
  error: string | null;
  config: BrandContactConfig;
  onRetry: () => void;
  onBackHome: (hash?: string) => void;
  onEnquireForState: (stateName: string) => void;
  onOpenAdminDepots: () => void;
}

export function DepotsPage({
  depots,
  loading,
  error,
  config,
  onRetry,
  onBackHome,
  onEnquireForState,
  onOpenAdminDepots,
}: DepotsPageProps) {
  const confirmedCount = useMemo(
    () => depots.filter((d) => d.depotType === 'confirmed_depot').length,
    [depots]
  );
  const coverageCount = useMemo(
    () => depots.filter((d) => d.depotType === 'coverage_location').length,
    [depots]
  );

  const whatsappUrl = `https://wa.me/${config.whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
    'Hello LABAN DRINK distribution team, I would like depot or wholesale dispatch information.'
  )}`;

  return (
    <div className="bg-[#FAFAFC]">
      {/* Dedicated Depots Page Header Banner */}
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
              onClick={onOpenAdminDepots}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/15 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#C8F52C]" />
              Manage Depots (Admin)
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <p className="text-sm font-extrabold tracking-wide text-[#C8F52C] mb-2">
                Nationwide Distribution Network
              </p>
              <h1
                className="font-display font-black tracking-tight text-white leading-[1.06]"
                style={{ fontSize: 'clamp(2.1rem, 4vw, 3.35rem)', textWrap: 'balance' }}
              >
                Nigeria Depot & State Coverage Directory
              </h1>
              <p className="text-slate-200/90 mt-4 text-base leading-relaxed max-w-2xl">
                Search confirmed LABAN DRINK operational depots and regional wholesale coverage desks
                across all 36 Nigerian states and FCT Abuja. Verified hubs are strictly separated
                from coverage and enquiry locations.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#35105F] border border-white/15 p-4">
                <div className="flex items-center gap-2 text-[#C8F52C] text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  Confirmed Depots
                </div>
                <p className="font-display text-2xl font-black text-white mt-1.5 tabular-nums">
                  {confirmedCount}
                </p>
              </div>

              <div className="rounded-xl bg-[#35105F] border border-white/15 p-4">
                <div className="flex items-center gap-2 text-[#FFD33F] text-xs font-bold">
                  <Compass className="w-4 h-4" />
                  Coverage Locations
                </div>
                <p className="font-display text-2xl font-black text-white mt-1.5 tabular-nums">
                  {coverageCount}
                </p>
              </div>

              <div className="rounded-xl bg-[#35105F] border border-white/15 p-4 col-span-2 sm:col-span-1 lg:col-span-2">
                <div className="flex items-center gap-2 text-slate-200 text-xs font-bold">
                  <MapPinned className="w-4 h-4 text-[#C8F52C]" />
                  National Reach
                </div>
                <p className="font-display text-lg font-bold text-white mt-1 tabular-nums">
                  36 States + FCT Abuja · 6 Geopolitical Zones
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Interactive Directory */}
      <DepotDirectorySection
        depots={depots}
        loading={loading}
        error={error}
        isDedicatedPage
        onRetry={onRetry}
        onEnquireForState={onEnquireForState}
        onOpenAdminDepots={onOpenAdminDepots}
      />

      {/* Distributor & Trade Dispatch CTA Band */}
      <section className="py-12 lg:py-16 bg-[#35105F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-sm font-bold text-[#C8F52C]">Expand LABAN Reach in Your State</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
              Looking to operate an official LABAN DRINK wholesale depot?
            </h2>
            <p className="text-slate-200/90 text-sm sm:text-base mt-2">
              Submit a distributor application for your state or speak directly with our regional trade
              coordination desk for pallet schedules.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onBackHome('#distributors')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C8F52C] text-[#21063D] font-extrabold text-sm hover:bg-[#d8fa5c] transition-colors"
            >
              Apply as Distributor
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              WhatsApp Trade Desk
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
