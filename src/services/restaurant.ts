import { api } from '@/lib/axios';
import type {
  ApiResponse,
  Restaurant,
  RestaurantDetail,
  RestaurantFilters,
  PaginatedResponse,
} from '@/types/api';

// Types for restaurant list response
export interface RestaurantListData {
  restaurants: Restaurant[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RecommendedData {
  recommendations: Restaurant[];
}

export const restaurantService = {
  /**
   * Get restaurants with filters
   * @returns ApiResponse containing restaurants array and pagination
   */
  getRestaurants: async (params?: RestaurantFilters) => {
    const response = await api.get<ApiResponse<RestaurantListData>>(
      '/api/resto',
      { params }
    );
    return response.data;
  },

  /**
   * Get recommended restaurants (requires auth)
   * @returns ApiResponse containing recommendations array
   */
  getRecommended: async () => {
    const response = await api.get<ApiResponse<RecommendedData>>(
      '/api/resto/recommended'
    );
    return response.data;
  },

  /**
   * Get best seller restaurants sorted by rating
   */
  getBestSellers: async (params?: {
    page?: number;
    limit?: number;
    lat?: number;
    lng?: number;
  }) => {
    const response = await api.get<ApiResponse<RestaurantListData>>(
      '/api/resto/best-seller',
      { params }
    );
    return response.data;
  },

  /**
   * Get nearby restaurants (requires auth, uses user's saved location)
   */
  getNearby: async (params?: { range?: number; limit?: number }) => {
    const response = await api.get<ApiResponse<RestaurantListData>>(
      '/api/resto/nearby',
      { params }
    );
    return response.data;
  },

  /**
   * Search restaurants by name
   */
  searchRestaurants: async (params: {
    q: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get<ApiResponse<RestaurantListData>>(
      '/api/resto/search',
      { params }
    );
    return response.data;
  },

  /**
   * Get restaurant detail with menus and reviews
   */
  getRestaurantDetail: async (
    id: number,
    options?: { limitMenu?: number; limitReview?: number }
  ) => {
    const response = await api.get<ApiResponse<RestaurantDetail>>(
      `/api/resto/${id}`,
      { params: options }
    );
    return response.data;
  },
};

export default restaurantService;
