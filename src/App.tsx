import { useCallback, useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HomeExploreStrip } from './components/HomeExploreStrip';
import { DistributorSection } from './components/DistributorSection';
import { ProductsPage } from './components/ProductsPage';
import { AboutPage } from './components/AboutPage';
import { GalleryPage } from './components/GalleryPage';
import { DepotsPage } from './components/DepotsPage';
import { ContactPage } from './components/ContactPage';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { LABAN_PRODUCTS, type FlavourKey, type ProductItem } from './data/catalog';
import type { BrandContactConfig, DepotRecord } from './types/api';

export type PageRoute = 'home' | 'products' | 'about' | 'gallery' | 'depots' | 'contact';

const ROUTE_TITLES: Record<PageRoute, string> = {
  home: 'LABAN DRINK – Refreshment for Every Moment',
  products: 'Our Products | LABAN DRINK',
  about: 'About Us | LABAN DRINK',
  gallery: 'Lifestyle Gallery | LABAN DRINK',
  depots: 'Nigeria Depot Directory | LABAN DRINK',
  contact: 'Contact Us | LABAN DRINK',
};

function resolveRouteFromPath(pathname: string): PageRoute {
  const clean = pathname.replace(/\/+$/, '');
  if (clean === '/products') return 'products';
  if (clean === '/about') return 'about';
  if (clean === '/gallery') return 'gallery';
  if (clean === '/depots') return 'depots';
  if (clean === '/contact') return 'contact';
  return 'home';
}

const DEFAULT_CONFIG: BrandContactConfig = {
  companyName: 'LABAN DRINK',
  slogan: 'Refreshment for Every Moment.',
  phone: '+234 800 522 2600',
  whatsapp: '2348005222600',
  email: 'hello@labandrink.com',
  officeAddress: 'Configurable Head Office — Plot 14, Industrial Commercial Avenue, Ikeja, Lagos, Nigeria',
  businessHours: 'Monday – Saturday, 08:00 – 18:00 WAT',
  socialLinks: {
    instagram: 'https://instagram.com/labandrink',
    facebook: 'https://facebook.com/labandrink',
    x: 'https://x.com/labandrink',
    linkedin: 'https://linkedin.com/company/labandrink',
  },
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>(() =>
    typeof window !== 'undefined' ? resolveRouteFromPath(window.location.pathname) : 'home'
  );
  const [pendingHash, setPendingHash] = useState<string | null>(null);

  const [config, setConfig] = useState<BrandContactConfig>(DEFAULT_CONFIG);
  const [depots, setDepots] = useState<DepotRecord[]>([]);
  const [depotsLoading, setDepotsLoading] = useState(true);
  const [depotsError, setDepotsError] = useState<string | null>(null);

  const [modalProduct, setModalProduct] = useState<ProductItem | null>(null);
  const [modalMode, setModalMode] = useState<'details' | 'enquiry'>('details');
  const [modalStart3D, setModalStart3D] = useState(false);

  const [prefilledDistributorState, setPrefilledDistributorState] = useState<string | undefined>(undefined);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<'depots' | 'distributors' | 'enquiries'>('depots');

  const fetchBrandData = useCallback(async () => {
    setDepotsLoading(true);
    setDepotsError(null);
    try {
      const [configRes, depotsRes] = await Promise.all([
        fetch('/api/config'),
        fetch('/api/depots'),
      ]);
      if (configRes.ok) {
        const configData = (await configRes.json()) as BrandContactConfig;
        setConfig(configData);
      }
      if (!depotsRes.ok) {
        throw new Error('Could not load Nigeria depot directory.');
      }
      const depotsData = (await depotsRes.json()) as { depots: DepotRecord[] };
      setDepots(depotsData.depots || []);
    } catch (err) {
      setDepotsError(err instanceof Error ? err.message : 'Unable to reach distribution server.');
    } finally {
      setDepotsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrandData();
  }, [fetchBrandData]);

  useEffect(() => {
    const onPopState = () => {
      setCurrentPage(resolveRouteFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    document.title = ROUTE_TITLES[currentPage];
  }, [currentPage]);

  useEffect(() => {
    if (currentPage === 'home' && pendingHash) {
      const hashId = pendingHash.replace(/^#/, '');
      const timer = window.setTimeout(() => {
        if (hashId === 'top' || hashId === '') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          document.getElementById(hashId)?.scrollIntoView({ behavior: 'smooth' });
        }
        setPendingHash(null);
      }, 60);
      return () => window.clearTimeout(timer);
    }
  }, [currentPage, pendingHash]);

  function navigateTo(page: PageRoute, hash?: string) {
    const targetPath = page === 'home' ? (hash ? `/${hash}` : '/') : `/${page}`;
    if (window.location.pathname + window.location.hash !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }

    if (page !== 'home') {
      setCurrentPage(page);
      setPendingHash(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentPage !== 'home') {
      setPendingHash(hash || '#top');
      setCurrentPage('home');
    } else if (hash) {
      const hashId = hash.replace(/^#/, '');
      if (hashId === 'top' || hashId === '') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        document.getElementById(hashId)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleOpenProductDetails(product: ProductItem, startIn3D = false) {
    setModalProduct(product);
    setModalMode('details');
    setModalStart3D(startIn3D);
  }

  function handleOpenProductEnquiry(product: ProductItem) {
    setModalProduct(product);
    setModalMode('enquiry');
    setModalStart3D(false);
  }

  function handleSelectProductByFlavour(flavour: FlavourKey) {
    const found = LABAN_PRODUCTS.find((p) => p.id === flavour);
    if (found) {
      setModalProduct(found);
    }
  }

  function handleEnquireForState(stateName: string) {
    setPrefilledDistributorState(stateName);
    navigateTo('home', '#distributors');
  }

  function openAdmin(tab: 'depots' | 'distributors' | 'enquiries') {
    setAdminTab(tab);
    setAdminOpen(true);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC] text-[#1A1128]">
      <Navbar currentPage={currentPage} onNavigate={navigateTo} />

      <main className="flex-1">
        {currentPage === 'products' ? (
          <ProductsPage
            onBackHome={(hash) => navigateTo('home', hash)}
            onSelectEnquiry={handleOpenProductEnquiry}
            onSelectDetails={handleOpenProductDetails}
            onOpenDepotsPage={() => navigateTo('depots')}
          />
        ) : currentPage === 'about' ? (
          <AboutPage
            onBackHome={(hash) => navigateTo('home', hash)}
            onOpenProductsPage={() => navigateTo('products')}
            onOpenGalleryPage={() => navigateTo('gallery')}
            onOpenDepotsPage={() => navigateTo('depots')}
            onOpenContactPage={() => navigateTo('contact')}
          />
        ) : currentPage === 'gallery' ? (
          <GalleryPage
            onBackHome={(hash) => navigateTo('home', hash)}
            onOpenProductsPage={() => navigateTo('products')}
          />
        ) : currentPage === 'depots' ? (
          <DepotsPage
            depots={depots}
            loading={depotsLoading}
            error={depotsError}
            config={config}
            onRetry={fetchBrandData}
            onBackHome={(hash) => navigateTo('home', hash)}
            onEnquireForState={handleEnquireForState}
            onOpenAdminDepots={() => openAdmin('depots')}
          />
        ) : currentPage === 'contact' ? (
          <ContactPage
            config={config}
            onBackHome={(hash) => navigateTo('home', hash)}
            onOpenDepotsPage={() => navigateTo('depots')}
          />
        ) : (
          <>
            <HeroSection
              onExploreProducts={() => navigateTo('products')}
              onDistributorEnquiry={() => navigateTo('home', '#distributors')}
            />

            <HomeExploreStrip onNavigate={navigateTo} />

            <DistributorSection
              prefilledState={prefilledDistributorState}
              onOpenAdmin={() => openAdmin('distributors')}
            />
          </>
        )}
      </main>

      <Footer
        config={config}
        onOpenAdmin={() => openAdmin('depots')}
        onNavigate={navigateTo}
      />

      <ProductModal
        product={modalProduct}
        mode={modalMode}
        initial3DView={modalStart3D}
        config={config}
        onClose={() => setModalProduct(null)}
        onSwitchToEnquiry={() => setModalMode('enquiry')}
        onSelectProductByFlavour={handleSelectProductByFlavour}
      />

      <AdminPortalModal
        open={adminOpen}
        initialTab={adminTab}
        onClose={() => setAdminOpen(false)}
        onDataUpdated={fetchBrandData}
      />
    </div>
  );
}
