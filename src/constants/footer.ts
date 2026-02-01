import { ROUTES } from './routes';

export const FOOTER_BRAND = {
  name: 'Foody',
  logo: '/icons/logo-foody.svg',
  description:
    "Enjoy homemade flavors & chef's signature dishes, freshly prepared every day. Order online or visit our nearest branch.",
};

export const FOOTER_SOCIAL_LINKS = [
  {
    name: 'Facebook',
    href: 'https://facebook.com',
    icon: '/icons/fb.svg',
    ariaLabel: 'Follow us on Facebook',
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    icon: '/icons/ig.svg',
    ariaLabel: 'Follow us on Instagram',
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: '/icons/linkedin.svg',
    ariaLabel: 'Follow us on LinkedIn',
  },
  {
    name: 'TikTok',
    href: 'https://tiktok.com',
    icon: '/icons/tiktok.svg',
    ariaLabel: 'Follow us on TikTok',
  },
];

export const FOOTER_NAV_SECTIONS = [
  {
    title: 'Explore',
    links: [
      { label: 'All Food', href: ROUTES.RESTAURANTS },
      { label: 'Nearby', href: '/restaurants?range=10' },
      { label: 'Discount', href: '/restaurants?category=discount' },
      { label: 'Best Seller', href: '/restaurants?rating=4.5' },
      { label: 'Delivery', href: '/restaurants?delivery=true' },
      { label: 'Lunch', href: '/restaurants?category=lunch' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'How to Order', href: ROUTES.HELP },
      { label: 'Payment Methods', href: ROUTES.HELP },
      { label: 'Track My Order', href: ROUTES.ORDERS },
      { label: 'FAQ', href: ROUTES.HELP },
      { label: 'Contact Us', href: ROUTES.CONTACT },
    ],
  },
];
