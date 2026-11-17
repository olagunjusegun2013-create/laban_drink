export type FlavourKey = 'strawberry' | 'cola' | 'wine';

export interface ProductItem {
  id: FlavourKey;
  name: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  accentHex: string;
  surfaceTint: string;
  badgeTextColor: string;
  bottleSizes: string[];
  servingOccasion: string;
  productInfo: {
    category: string;
    servingStyle: string;
    packagingFormats: string;
    channelSuitability: string;
  };
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Parties' | 'Outdoor' | 'Family' | 'Social';
  caption: string;
  image: string;
  alt: string;
}

export const HERO_IMAGE = '/src/assets/images/hero_laban_nourishing_v2_1794936064624.jpg';

export const LABAN_PRODUCTS: ProductItem[] = [
  {
    id: 'strawberry',
    name: 'LABAN Strawberry',
    tagline: 'Bright berry lift crafted for daytime energy and celebrations.',
    description:
      'A crisp, vibrant strawberry-flavoured beverage balanced for chilled refreshment at parties, outdoor hangouts, and everyday moments.',
    image: '/src/assets/images/product_laban_strawberry_clean_1794932657787.jpg',
    imageAlt: 'Chilled bottle of LABAN Strawberry drink with condensation droplets surrounded by fresh halved strawberries and ice cubes',
    accentHex: '#C81E56',
    surfaceTint: '#FFF4F7',
    badgeTextColor: '#8F113B',
    bottleSizes: ['330ml Glass Bottle', '500ml PET Bottle', '1L Sharing Pack'],
    servingOccasion: 'Birthdays, daytime hangouts & outdoor events',
    productInfo: {
      category: 'Fruit Refreshment',
      servingStyle: 'Best served ice-cold straight from the chiller or over clear ice',
      packagingFormats: 'Single-serve glass, on-the-go PET, and family sharing formats',
      channelSuitability: 'Supermarkets, lounges, campus hubs, and event catering',
    },
  },
  {
    id: 'cola',
    name: 'LABAN Cola',
    tagline: 'Bold, crisp sparkling cola built for meals and high-energy gatherings.',
    description:
      'Deep, sparkling cola refreshment with a clean finish, designed to pair naturally with social meals, match nights, and busy afternoons.',
    image: '/src/assets/images/product_laban_cola_1794932637744.jpg',
    imageAlt: 'Chilled bottle of LABAN Cola with condensation droplets, ice cubes, and sparkling amber cola splash',
    accentHex: '#6E3717',
    surfaceTint: '#FAF5F1',
    badgeTextColor: '#4E240D',
    bottleSizes: ['355ml Glass Bottle', '500ml PET Bottle', '1.5L Party Bottle'],
    servingOccasion: 'Meals, street festivals, viewing centres & retail',
    productInfo: {
      category: 'Sparkling Cola',
      servingStyle: 'Serve chilled at 4°C over ice cubes with a fresh wedge of lime',
      packagingFormats: 'Returnable glass, convenience PET, and large gathering packs',
      channelSuitability: 'Restaurants, quick-service outlets, supermarkets, and wholesalers',
    },
  },
  {
    id: 'wine',
    name: 'LABAN Wine',
    tagline: 'Rich vineyard grape character for toasts, dinners, and milestones.',
    description:
      'Smooth, celebratory grape refreshment crafted for memorable family dinners, formal receptions, and refined weekend hosting.',
    image: '/src/assets/images/product_laban_wine_1794932639626.jpg',
    imageAlt: 'Chilled bottle of LABAN Wine beside fresh dark purple Concord grapes and a crystal flute glass',
    accentHex: '#6A1B4D',
    surfaceTint: '#FAF3F8',
    badgeTextColor: '#4C1036',
    bottleSizes: ['750ml Celebration Bottle', '330ml Solo Bottle'],
    servingOccasion: 'Weddings, family tables, anniversaries & executive hosting',
    productInfo: {
      category: 'Sparkling Grape Beverage',
      servingStyle: 'Chill thoroughly before opening and pour into stemmed glassware',
      packagingFormats: 'Presentation 750ml table bottle and individual reception bottle',
      channelSuitability: 'Hospitality venues, supermarkets, gift hampers, and events',
    },
  },
];

export const LIFESTYLE_GALLERY: GalleryItem[] = [
  {
    id: 'vip-gala-table',
    title: 'Awards Night VIP Gala Table',
    category: 'Parties',
    caption: 'Red-carpet awards night VIP table celebrating with chilled LABAN Wine and LABAN Strawberry.',
    image: '/src/assets/images/gallery_vip_redcarpet_1794936308828.jpg',
    alt: 'Editorial VIP awards gala photo of Nigerian film and music figures celebrating around a banquet table with chilled LABAN Wine and LABAN Strawberry bottles',
  },
  {
    id: 'garden-brunch',
    title: 'Sunlit VIP Garden Brunch',
    category: 'Outdoor',
    caption: 'Toasting chilled LABAN Strawberry and LABAN Cola at an Abuja palm-canopy VIP garden brunch.',
    image: '/src/assets/images/gallery_celebrity_gardenparty_1794936308362.jpg',
    alt: 'High-fashion outdoor VIP garden brunch under palm trees with hosts clinking chilled LABAN Strawberry and LABAN Cola bottles beside fresh fruit platters',
  },
  {
    id: 'gala-family-toast',
    title: 'Candlelit Veranda Banquet',
    category: 'Family',
    caption: 'A milestone evening dinner pouring sparkling LABAN Wine into stemmed flutes beside Nigerian feast dishes.',
    image: '/src/assets/images/gallery_gala_family_toast_1794936308888.jpg',
    alt: 'Editorial candlelit veranda dinner celebrating a milestone with sparkling LABAN Wine poured into crystal flutes alongside festive Nigerian dishes',
  },
  {
    id: 'backstage-greenroom',
    title: 'Backstage Green Room Chill',
    category: 'Social',
    caption: 'Relaxing backstage in Lagos with ice-cold LABAN Cola and LABAN Strawberry straight from the silver bucket.',
    image: '/src/assets/images/gallery_backstage_lounge_1794936307399.jpg',
    alt: 'Candid editorial backstage VIP green room photo of recording artists relaxing on leather sofas with chilled LABAN Cola and LABAN Strawberry bottles in ice buckets',
  },
];
