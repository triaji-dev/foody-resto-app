export interface Restaurant {
  id: string;
  name: string;
  rating?: number;
  ratingCount?: number;
  deliveryTime?: string;
  distance?: string;
  priceRange?: string; // e.g. "$", "$$", "$$$"
  imageUrl?: string;
  categories?: string[];
  isOpen?: boolean;
}

export interface Menu {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  restaurantName?: string;
  category?: string;
}
