interface AboutSectionProps {
  onOpenDepotsPage?: () => void;
  onOpenContactPage?: () => void;
}

export function AboutSection({ onOpenDepotsPage, onOpenContactPage }: AboutSectionProps) {
  const pillars = [
    {
      index: '01.',
      title: 'Company Background',
      body: 'LABAN DRINK was created to bring memorable, boldly branded refreshment to Nigerian tables, retail counters, and celebrations—combining distinctive bottle presentation with consistent flavour craft.',
    },
    {
      index: '02.',
      title: 'Our Mission',
      body: 'To deliver crisp, reliable beverage enjoyment for every social occasion while building dependable wholesale margins and responsive supply routes for Nigerian trade partners.',
    },
    {
      index: '03.',
      title: 'Our Vision',
      body: 'To stand as one of Nigeria’s most trusted and recognisable beverage houses, present in neighbourhoods, hospitality venues, and celebratory gatherings across all 36 states and the FCT.',
    },
    {
      index: '04.',
      title: 'Commitment to Customers & Trade',
      body: 'From chilled single bottles for weekend hangouts to structured pallet allocations for regional distributors, we prioritise consistent packaging, attentive communication, and long-term partnership.',
    },
  ];

  return (
    <section id="about" className="py-16 lg:py-24 bg-[#35105F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5">
            <p className="text-sm font-semibold text-[#C8F52C] mb-2">About LABAN DRINK</p>
            <h2
              className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight"
              style={{ textWrap: 'balance' }}
            >
              Built for Nigerian Celebrations and Everyday Trade.
            </h2>
            <p className="text-slate-200/90 mt-4 text-base leading-relaxed">
              Whether shared among friends on a rooftop, stocked in a bustling neighbourhood supermarket,
              or poured at a family celebration, LABAN DRINK is engineered to turn ordinary gatherings into
              lasting moments.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              {onOpenDepotsPage ? (
                <button
                  type="button"
                  onClick={onOpenDepotsPage}
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#C8F52C] text-[#21063D] font-bold text-sm hover:bg-[#d8fa5c] transition-colors whitespace-nowrap shrink-0"
                >
                  View Nigeria Depots
                </button>
              ) : (
                <a
                  href="/depots"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#C8F52C] text-[#21063D] font-bold text-sm hover:bg-[#d8fa5c] transition-colors whitespace-nowrap shrink-0"
                >
                  View Nigeria Depots
                </a>
              )}
              {onOpenContactPage ? (
                <button
                  type="button"
                  onClick={onOpenContactPage}
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
                >
                  Speak With Our Team
                </button>
              ) : (
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
                >
                  Speak With Our Team
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 pt-2 lg:pt-0">
            {pillars.map((pillar) => (
              <div
                key={pillar.index}
                className="pt-5 border-t border-white/15"
              >
                <p className="font-display text-sm font-bold text-[#FFD33F] tabular-nums">
                  {pillar.index}
                </p>
                <h3 className="font-display text-xl font-bold text-white mt-1.5">
                  {pillar.title}
                </h3>
                <p className="text-sm text-slate-200/90 leading-relaxed mt-2.5">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
