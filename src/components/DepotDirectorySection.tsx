import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Clock, Compass, MapPin, Phone, Search, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { NIGERIAN_STATES, type NigerianStateInfo } from '../data/states';
import type { DepotRecord } from '../types/api';

interface DepotDirectorySectionProps {
  depots: DepotRecord[];
  loading: boolean;
  error: string | null;
  isDedicatedPage?: boolean;
  onRetry: () => void;
  onEnquireForState: (stateName: string) => void;
  onOpenAdminDepots: () => void;
  onOpenDepotsPage?: () => void;
}

type TypeFilter = 'all' | 'confirmed_depot' | 'coverage_location';
type RegionFilter = 'All Regions' | NigerianStateInfo['region'];

const REGION_OPTIONS: RegionFilter[] = [
  'All Regions',
  'South West',
  'South East',
  'South South',
  'North Central',
  'North East',
  'North West',
];

export function DepotDirectorySection({
  depots,
  loading,
  error,
  isDedicatedPage = false,
  onRetry,
  onEnquireForState,
  onOpenAdminDepots,
  onOpenDepotsPage,
}: DepotDirectorySectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedRegion, setSelectedRegion] = useState<RegionFilter>('All Regions');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [showAllStatesList, setShowAllStatesList] = useState(isDedicatedPage);

  const confirmedCount = useMemo(
    () => depots.filter((d) => d.depotType === 'confirmed_depot').length,
    [depots]
  );

  const statesWithConfirmedDepots = useMemo(
    () => new Set(depots.filter((d) => d.depotType === 'confirmed_depot').map((d) => d.state)),
    [depots]
  );

  const quickSelectStates = useMemo(() => {
    if (selectedRegion === 'All Regions') return NIGERIAN_STATES;
    return NIGERIAN_STATES.filter((s) => s.region === selectedRegion);
  }, [selectedRegion]);

  const filteredDepots = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return depots.filter((depot) => {
      if (selectedRegion !== 'All Regions' && depot.region !== selectedRegion) {
        return false;
      }
      if (selectedState !== 'All States' && depot.state !== selectedState) {
        return false;
      }
      if (typeFilter !== 'all' && depot.depotType !== typeFilter) {
        return false;
      }
      if (q) {
        const hay = `${depot.state} ${depot.region} ${depot.depotName} ${depot.address} ${depot.phone}`.toLowerCase();
        return hay.includes(q);
      }
      return true;
    });
  }, [depots, searchQuery, selectedRegion, selectedState, typeFilter]);

  useEffect(() => {
    if (isDedicatedPage || selectedState !== 'All States' || searchQuery.trim() !== '' || selectedRegion !== 'All Regions') {
      setShowAllStatesList(true);
    }
  }, [isDedicatedPage, selectedState, searchQuery, selectedRegion]);

  const visibleDepots = isDedicatedPage || showAllStatesList ? filteredDepots : filteredDepots.slice(0, 9);

  return (
    <section
      id="depots"
      className={`${isDedicatedPage ? 'py-12 lg:py-16 bg-white' : 'py-16 lg:py-24 bg-white border-t border-b border-slate-200/80'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isDedicatedPage && (
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-200">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-[#35105F] mb-2">
                Nigeria Nationwide Distribution Directory
              </p>
              <h2
                className="font-display text-3xl sm:text-4xl font-bold text-[#21063D] tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                36 States & FCT Abuja Depot Coverage
              </h2>
              <p className="text-slate-600 mt-3 text-base leading-relaxed">
                Verified operational hubs are explicitly listed as{' '}
                <strong className="text-[#21063D]">Confirmed Operational Depots</strong>. Other states
                are clearly marked as <strong className="text-[#21063D]">Coverage / Enquiry Locations</strong>{' '}
                served via regional wholesale dispatch.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="px-4 py-2.5 rounded-xl bg-[#FAFAFC] border border-slate-200 tabular-nums">
                <span className="font-bold text-[#21063D]">{confirmedCount}</span>{' '}
                <span className="text-slate-600">Confirmed Depots</span>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-[#FAFAFC] border border-slate-200 tabular-nums">
                <span className="font-bold text-[#21063D]">37</span>{' '}
                <span className="text-slate-600">States + FCT Covered</span>
              </div>
              {onOpenDepotsPage && (
                <button
                  type="button"
                  onClick={onOpenDepotsPage}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#35105F] text-white font-semibold hover:bg-[#21063D] transition-colors whitespace-nowrap shrink-0"
                >
                  Open Depots Page
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onOpenAdminDepots}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-[#35105F] font-semibold hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Manage Depots
              </button>
            </div>
          </div>
        )}

        {/* Geopolitical Region Tabs (always shown on dedicated page, helpful anywhere) */}
        {isDedicatedPage && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {REGION_OPTIONS.map((region) => {
              const active = selectedRegion === region;
              return (
                <button
                  key={region}
                  type="button"
                  onClick={() => {
                    setSelectedRegion(region);
                    setSelectedState('All States');
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#35105F] text-white border-[#35105F]'
                      : 'bg-[#FAFAFC] text-slate-700 border-slate-200 hover:border-[#35105F]/40 hover:text-[#21063D]'
                  }`}
                >
                  {region}
                </button>
              );
            })}
          </div>
        )}

        {/* Search & Filter Controls */}
        <div className={`${isDedicatedPage ? '' : 'mt-8'} grid grid-cols-1 md:grid-cols-12 gap-3 items-center`}>
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search state, city, depot name, or address..."
              aria-label="Search Nigerian depots"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-[#FAFAFC] text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#35105F]"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              aria-label="Filter by Nigerian state"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#FAFAFC] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#35105F]"
            >
              <option value="All States">All States (36 + FCT)</option>
              {quickSelectStates.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name} {statesWithConfirmedDepots.has(s.name) ? '— Confirmed Depot' : '— Coverage'}
                </option>
              ))}
            </select>
          </div>

          <div
            role="tablist"
            aria-label="Filter by depot classification"
            className="md:col-span-4 inline-flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto"
          >
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'confirmed_depot', label: 'Confirmed Depots' },
                { id: 'coverage_location', label: 'Coverage' },
              ] as Array<{ id: TypeFilter; label: string }>
            ).map((tab) => {
              const active = typeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTypeFilter(tab.id)}
                  className={`flex-1 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    active ? 'bg-[#35105F] text-white shadow-sm' : 'text-slate-600 hover:text-[#21063D]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick State Directory Strip */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">
              Quick State Selection ({selectedRegion === 'All Regions' ? '36 States & FCT' : selectedRegion})
            </span>
            {(selectedState !== 'All States' || selectedRegion !== 'All Regions') && (
              <button
                type="button"
                onClick={() => {
                  setSelectedState('All States');
                  setSelectedRegion('All Regions');
                }}
                className="text-xs font-semibold text-[#35105F] hover:underline"
              >
                Reset state & region filters
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickSelectStates.map((s) => {
              const isSelected = selectedState === s.name;
              const isConfirmed = statesWithConfirmedDepots.has(s.name);
              return (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setSelectedState(isSelected ? 'All States' : s.name)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 border ${
                    isSelected
                      ? 'bg-[#35105F] text-white border-[#35105F]'
                      : isConfirmed
                        ? 'bg-[#C8F52C]/25 text-[#21063D] border-[#C8F52C] hover:bg-[#C8F52C]/45'
                        : 'bg-[#FAFAFC] text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Directory Results */}
        {loading ? (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-56 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="mt-10 p-8 rounded-2xl bg-red-50 border border-red-200 text-center">
            <p className="text-base font-semibold text-red-900">{error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 px-4 py-2 rounded-lg bg-[#35105F] text-white text-sm font-semibold"
            >
              Retry Loading Directory
            </button>
          </div>
        ) : filteredDepots.length === 0 ? (
          <div className="mt-10 p-12 rounded-2xl bg-[#FAFAFC] border border-slate-200 text-center">
            <p className="text-base font-semibold text-[#21063D]">
              No depot or coverage records match your filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedState('All States');
                setSelectedRegion('All Regions');
                setTypeFilter('all');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-[#35105F] text-white text-sm font-semibold"
            >
              Show All 36 States & FCT
            </button>
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleDepots.map((depot) => {
                const isConfirmed = depot.depotType === 'confirmed_depot';
                return (
                  <article
                    key={depot.id}
                    className={`rounded-2xl border p-6 flex flex-col justify-between transition-colors ${
                      isConfirmed
                        ? 'bg-white border-[#35105F]/25 shadow-sm'
                        : 'bg-[#FAFAFC] border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-xs font-medium text-slate-500">
                          {depot.state} · {depot.region}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap shrink-0 ${
                            isConfirmed ? 'text-[#21063D]' : 'text-slate-600'
                          }`}
                        >
                          {isConfirmed ? (
                            <ShieldCheck className="w-3.5 h-3.5 text-[#35105F]" />
                          ) : (
                            <Compass className="w-3.5 h-3.5 text-slate-500" />
                          )}
                          {isConfirmed ? 'Confirmed Operational Depot' : 'Coverage / Enquiry Location'}
                        </span>
                      </div>

                      <h3 className="font-display text-lg font-bold text-[#21063D] mt-2.5">
                        {depot.depotName}
                      </h3>

                      <div className="mt-4 space-y-2.5 text-sm text-slate-600">
                        <p className="flex items-start gap-2.5">
                          <MapPin className="w-4 h-4 text-[#35105F] shrink-0 mt-0.5" />
                          <span>{depot.address}</span>
                        </p>
                        <p className="flex items-center gap-2.5 tabular-nums">
                          <Phone className="w-4 h-4 text-[#35105F] shrink-0" />
                          <a
                            href={`tel:${depot.phone.replace(/[^\d+]/g, '')}`}
                            className="hover:text-[#35105F] font-medium"
                          >
                            {depot.phone}
                          </a>
                        </p>
                        <p className="flex items-center gap-2.5 tabular-nums">
                          <Clock className="w-4 h-4 text-[#35105F] shrink-0" />
                          <span>{depot.operatingHours}</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-200/80 flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-slate-700">
                        Status: <span className="text-[#21063D]">{depot.availabilityStatus}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => onEnquireForState(depot.state)}
                        className="text-xs font-bold text-[#35105F] hover:text-[#21063D] underline underline-offset-4 whitespace-nowrap shrink-0"
                      >
                        {isConfirmed ? 'Order / Partner' : 'Apply for State Depot'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {!isDedicatedPage && filteredDepots.length > 9 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowAllStatesList((prev) => !prev)}
                  className="px-6 py-3 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-[#21063D] hover:bg-slate-50 transition-colors"
                >
                  {showAllStatesList
                    ? 'Show Fewer Locations'
                    : `Expand All ${filteredDepots.length} State Locations Here`}
                </button>
                {onOpenDepotsPage && (
                  <button
                    type="button"
                    onClick={onOpenDepotsPage}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#35105F] text-white text-sm font-semibold hover:bg-[#21063D] transition-colors"
                  >
                    Open Full Depots Page
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
