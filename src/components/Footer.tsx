import type { PageRoute } from '../App';
import { LabanLogo } from './LabanLogo';
import { LuxurySaleLogo } from './LuxurySaleLogo';
import type { BrandContactConfig } from '../types/api';

interface FooterProps {
  config: BrandContactConfig;
  onOpenAdmin: () => void;
  onNavigate?: (page: PageRoute, hash?: string) => void;
}

export function Footer({ config, onOpenAdmin, onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  function handleLink(
    e: React.MouseEvent<HTMLAnchorElement>,
    page: PageRoute,
    hash?: string
  ) {
    if (!onNavigate) return;
    e.preventDefault();
    onNavigate(page, hash);
  }

  return (
    <footer className="bg-[#21063D] text-slate-200 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <LabanLogo variant="light" size="md" />
            <p className="text-[#C8F52C] text-sm font-semibold mt-3">{config.slogan}</p>
            <p className="text-sm text-slate-300 leading-relaxed mt-3 max-w-md">
              Refreshing moments across Nigeria with LABAN Strawberry, LABAN Cola, and LABAN Wine.
              Connecting customers, retailers, wholesalers, and regional distribution partners.
            </p>
            <div className="mt-5">
              <LuxurySaleLogo
                variant="light"
                size="compact"
                onClick={onNavigate ? () => onNavigate('products') : undefined}
              />
            </div>
          </div>

          <div className="md:col-span-3 space-y-2.5 text-sm">
            <p className="font-display font-bold text-white mb-3">Explore</p>
            <a
              href="/products"
              onClick={(e) => handleLink(e, 'products')}
              className="block hover:text-[#C8F52C] transition-colors"
            >
              Our Products
            </a>
            <a
              href="/about"
              onClick={(e) => handleLink(e, 'about')}
              className="block hover:text-[#C8F52C] transition-colors"
            >
              About Us
            </a>
            <a
              href="/gallery"
              onClick={(e) => handleLink(e, 'gallery')}
              className="block hover:text-[#C8F52C] transition-colors"
            >
              Lifestyle Gallery
            </a>
            <a
              href="/#distributors"
              onClick={(e) => handleLink(e, 'home', '#distributors')}
              className="block hover:text-[#C8F52C] transition-colors"
            >
              Distributor Portal
            </a>
            <a
              href="/depots"
              onClick={(e) => handleLink(e, 'depots')}
              className="block hover:text-[#C8F52C] transition-colors"
            >
              Nigeria Depot Directory
            </a>
            <a
              href="/contact"
              onClick={(e) => handleLink(e, 'contact')}
              className="block hover:text-[#C8F52C] transition-colors"
            >
              Contact Us
            </a>
          </div>

          <div className="md:col-span-4 space-y-2.5 text-sm">
            <p className="font-display font-bold text-white mb-3">Trade & Administration</p>
            <p className="text-slate-300 tabular-nums">{config.phone}</p>
            <p className="text-slate-300">{config.email}</p>
            <p className="text-slate-300 text-xs leading-relaxed">{config.officeAddress}</p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenAdmin}
                className="text-sm font-semibold text-[#C8F52C] hover:underline underline-offset-4"
              >
                Administration Portal
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400">
          <p className="tabular-nums">
            © {currentYear} {config.companyName}. All rights reserved.
          </p>
          <p>
            Campaign visuals are illustrative brand imagery. Depot & contact details are configurable via Administration Portal.
          </p>
        </div>
      </div>
    </footer>
  );
}
