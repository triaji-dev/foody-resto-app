import { ROUTES } from './routes';

export type MenuItemType = 'item' | 'separator' | 'logout';

export interface NavMenuItem {
  type: MenuItemType;
  label?: string;
  href?: string;
  icon?: string;
  className?: string;
}

// Items for Desktop User Dropdown
export const USER_DROPDOWN_ITEMS: NavMenuItem[] = [
  {
    type: 'item',
    label: 'Delivery Address',
    href: ROUTES.PROFILE,
    icon: 'DeliveryAddress',
  },
  { type: 'item', label: 'My Orders', href: ROUTES.ORDERS, icon: 'Orders' },
  { type: 'logout', label: 'Logout', icon: 'Logout' },
];

// Items for Mobile Menu (Authenticated) - Includes Nav + User Items
export const AUTHENTICATED_MOBILE_MENU: NavMenuItem[] = [
  { type: 'item', label: 'Home', href: ROUTES.HOME, icon: 'Home' },
  {
    type: 'item',
    label: 'Restaurants',
    href: ROUTES.RESTAURANTS,
    icon: 'Restaurant',
  },
  { type: 'item', label: 'Cart', href: ROUTES.CART, icon: 'Cart' },
  { type: 'separator' },
  ...USER_DROPDOWN_ITEMS,
];

// Keep for backward compatibility if needed, or deprecate
export const AUTHENTICATED_MENU_ITEMS = AUTHENTICATED_MOBILE_MENU;

export const GUEST_MENU_ITEMS: NavMenuItem[] = [
  { type: 'item', label: 'Sign In', href: ROUTES.AUTH, icon: 'SignIn' },
  {
    type: 'item',
    label: 'Sign Up',
    href: `${ROUTES.AUTH}?tab=signup`,
    icon: 'SignUp',
  },
  { type: 'separator' },
  { type: 'item', label: 'Home', href: ROUTES.HOME, icon: 'Home' },
  {
    type: 'item',
    label: 'Restaurants',
    href: ROUTES.RESTAURANTS,
    icon: 'Restaurant',
  },
];
