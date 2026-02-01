import { api } from '@/lib/axios';
import type { ApiResponse, CreateReviewRequest } from '@/types/api';

export const reviewService = {
  createReview: async (data: CreateReviewRequest) => {
    const response = await api.post<ApiResponse<null>>(
      '/api/review/create',
      data
    );
    return response.data;
  },
};
