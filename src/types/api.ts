// ===========================
// COMMON TYPES
// ===========================
export type OrderStatus =
  | 'preparing'
  | 'on_the_way'
  | 'delivered'
  | 'done'
  | 'cancelled';

export type PaymentMethod = 'credit_card' | 'debit_card' | 'cash' | 'e_wallet';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]> | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface AsyncState<T = unknown> extends LoadingState {
  data: T | null;
}

// ===========================
// AUTH TYPES
// ===========================
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface RegisterRequest {
  name: string; // minLength: 2
  email: string; // email format
  phone: string;
  password: string; // minLength: 6
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: File; // For client-side handling (multipart/form-data)
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// ===========================
// RESTAURANT & MENU TYPES
// ===========================
export interface Restaurant {
  id: number;
  name: string;
  description?: string;
  place: string;
  star: number;
  logo: string;
  images: string[];
  reviewCount: number;
  menuCount: number;
  priceRange: {
    min: number;
    max: number;
  };
  isOpen?: boolean;
}

export interface Menu {
  id: number;
  name: string;
  foodName?: string; // API sometimes returns foodName instead of name
  description: string;
  price: number;
  image: string;
  category: string;
  isBestSeller?: boolean;
}

export interface RestaurantDetail extends Restaurant {
  menus: Menu[];
  reviews: Review[];
}

export interface RestaurantFilters {
  location?: string;
  lat?: number;
  long?: number; // Backend usually expects 'long' or 'lng' - checking usage
  range?: number;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  category?: string;
  page?: number;
  limit?: number;
}

// ===========================
// CART TYPES
// ===========================
export interface CartItem {
  id: number;
  menuId: number;
  restaurantId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface CartGrouped {
  restaurantId: number;
  restaurantName: string;
  items: CartItem[];
}

export interface Cart {
  items: CartItem[];
  summary: {
    totalItems: number;
    totalPrice: number;
  };
}

export interface AddToCartRequest {
  restaurantId: number;
  menuId: number;
  quantity?: number; // default: 1
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// ===========================
// ORDER TYPES
// ===========================
export interface CheckoutItem {
  menuId: number;
  quantity: number;
}

export interface CheckoutRestaurant {
  restaurantId: number;
  items: CheckoutItem[];
}

export interface CheckoutRequest {
  restaurants: CheckoutRestaurant[];
  deliveryAddress: string;
  phone?: string;
  paymentMethod?: string;
  notes?: string;
}

export interface Order {
  id?: number;
  transactionId: string;
  restaurantId: number;
  restaurantName: string;
  totalAmount: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
  deliveryAddress?: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

export interface OrderItem {
  menuId?: number;
  menuName: string;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface CreateOrderResponse {
  transactionId: string;
  orderId: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  deliveryAddress: string;
  status: OrderStatus;
}

export interface OrderFilters {
  status?: OrderStatus;
  page?: number;
  limit?: number;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

// ===========================
// REVIEW TYPES
// ===========================
export interface Review {
  id: number;
  userId?: number;
  userName?: string;
  userAvatar?: string; // API sometimes returns avatar at top level
  restaurantId?: number;
  transactionId?: string;
  star: number; // 1-5
  comment?: string;
  menuIds?: number[];
  createdAt: string;
  user?: {
    name: string;
    avatar?: string;
  };
  restaurant?: {
    name: string;
    image: string;
  };
}

export interface CreateReviewRequest {
  transactionId: string;
  restaurantId: number;
  star: number;
  comment?: string;
  menuIds?: number[];
}

export interface UpdateReviewRequest {
  star?: number;
  comment?: string;
}

export interface ReviewFilters {
  rating?: number;
  page?: number;
  limit?: number;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    '5': number;
    '4': number;
    '3': number;
    '2': number;
    '1': number;
  };
}

export interface RestaurantReviewsResponse {
  reviews: Review[];
  pagination: PaginationMeta;
  summary: ReviewSummary;
}

export interface MyReviewsResponse {
  reviews: Review[];
  pagination: PaginationMeta;
  summary: {
    totalReviews: number;
    averageRating: number;
  };
}
