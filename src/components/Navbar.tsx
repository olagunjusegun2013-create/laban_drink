import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { PageRoute } from '../App';
import { LabanLogo } from './LabanLogo';
import { LuxurySaleLogo } from './LuxurySaleLogo';

interface NavbarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute, hash?: string) => void;
}

const NAV_LINKS: Array<{ label: string; page: Exclude<PageRoute, 'home'>; href: string }> = [
  { label: 'Products', page: 'products', href: '/products' },
  { label: 'About', page: 'about', href: '/about' },
  { label: 'Gallery', page: 'gallery', href: '/gallery' },
  { label: 'Depots', page: 'depots', href: '/depots' },
  { label: 'Contact', page: 'contact', href: '/contact' },
];

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleNavClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    page: PageRoute,
    hash?: string
  ) {
    e.preventDefault();
    setMobileOpen(false);
    onNavigate(page, hash);
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        <a
          href="/"
          onClick={(e) => handleNavClick(e, 'home', '#top')}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#35105F] rounded-lg shrink-0"
          aria-label="LABAN DRINK home"
        >
          <LabanLogo variant="dark" size="sm" />
        </a>

        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-medium text-slate-700">
          {NAV_LINKS.map((link) => {
            const isActive = currentPage === link.page;
            return (
              <a
                key={link.page}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.page)}
                className={`whitespace-nowrap shrink-0 py-1 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#35105F] after:transition-all after:duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#35105F] rounded ${
                  isActive
                    ? 'text-[#35105F] font-bold after:w-full'
                    : 'hover:text-[#35105F] after:w-0 hover:after:w-full'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden xl:block">
            <LuxurySaleLogo
              variant="dark"
              size="compact"
              onClick={() => onNavigate('products')}
            />
          </div>

          <a
            href="/#distributors"
            onClick={(e) => handleNavClick(e, 'home', '#distributors')}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-[#35105F] text-white hover:bg-[#21063D] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8F52C]"
          >
            Become a Distributor
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-[#21063D] hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#35105F]"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-1">
          {NAV_LINKS.map((link) => {
            const isActive = currentPage === link.page;
            return (
              <a
                key={link.page}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.page)}
                className={`block px-3 py-2.5 text-base rounded-lg ${
                  isActive
                    ? 'bg-[#35105F]/10 text-[#35105F] font-bold'
                    : 'font-medium text-slate-800 hover:bg-slate-50 hover:text-[#35105F]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <div className="pt-2">
            <a
              href="/#distributors"
              onClick={(e) => handleNavClick(e, 'home', '#distributors')}
              className="block w-full text-center px-4 py-3 text-sm font-semibold rounded-lg bg-[#35105F] text-white hover:bg-[#21063D]"
            >
              Become a Distributor
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
