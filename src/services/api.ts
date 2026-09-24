import axios from 'axios';
import type {
  Order,
  DashboardCounts,
  DashboardSalesResponse,
  ApiResponse
} from '../types';

export const IMAGE_BASE_URL = 'http://localhost:3003';

const api = axios.create({
  baseURL: 'http://localhost:3003/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email: string): Promise<ApiResponse<any>> => {
    const response = await api.post('/auth/login', { email });
    return response.data;
  },
  verify: async (email: string, otp: string): Promise<ApiResponse<any>> => {
    const response = await api.post('/auth/verify', { email, otp });
    return response.data;
  },
  getProfile: async (): Promise<ApiResponse<any>> => {
    const response = await api.post('/auth/profile');
    return response.data;
  },
  updateProfile: async (data: { name: string; mobile: string }): Promise<ApiResponse<any>> => {
    const response = await api.post('/auth/update-profile', data);
    return response.data;
  },
  createCategory: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post('/category/create', data);
    return response.data;
  },
  editCategory: async (id: string, data: any): Promise<ApiResponse<any>> => {
    const response = await api.post(`/category/edit/${id}`, data);
    return response.data;
  },
  deleteCategory: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.post(`/category/delete/${id}`);
    return response.data;
  },
  getCategories: async (): Promise<ApiResponse<any>> => {
    const response = await api.post('/category/get');
    return response.data;
  },
  createProduct: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post('/product/create', data);
    return response.data;
  },
  editProduct: async (id: string, data: any): Promise<ApiResponse<any>> => {
    const response = await api.post(`/product/edit/${id}`, data);
    return response.data;
  },
  deleteProduct: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.post(`/product/delete/${id}`);
    return response.data;
  },
  getProducts: async (): Promise<ApiResponse<any>> => {
    const response = await api.post('/product/get');
    return response.data;
  },
  getProductById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.post(`/product/get/${id}`);
    return response.data;
  },
  getProductReviews: async (): Promise<ApiResponse<any>> => {
    const response = await api.post('/productreviews/get');
    return response.data;
  },
  updateProductReviewStatus: async (id: string, status: string): Promise<ApiResponse<any>> => {
    const response = await api.post(`/productreviews/update-status/${id}`, { status });
    return response.data;
  },
  deleteProductReview: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.post(`/productreviews/delete/${id}`);
    return response.data;
  },
  getAllUsers: async (): Promise<ApiResponse<any>> => {
    const response = await api.post('/auth/get-all');
    return response.data;
  },
  getTestimonials: async (status: string = ""): Promise<ApiResponse<any>> => {
    const response = await api.post('/testimonials/get', { status });
    return response.data;
  },
  updateTestimonialStatus: async (id: string, status: string): Promise<ApiResponse<any>> => {
    const response = await api.post(`/testimonials/update-status/${id}`, { status });
    return response.data;
  },
  deleteTestimonial: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.post(`/testimonials/delete/${id}`);
    return response.data;
  },
  getContacts: async (): Promise<ApiResponse<any>> => {
    const response = await api.post('/contactus/get');
    return response.data;
  },
  deleteContact: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.post(`/contactus/delete/${id}`);
    return response.data;
  },
  createBanner: async (data: FormData): Promise<ApiResponse<any>> => {
    const response = await api.post('/banner/add', data);
    return response.data;
  },
  getBanners: async (): Promise<ApiResponse<any>> => {
    const response = await api.post('/banner/get');
    return response.data;
  },
  updateBanner: async (id: string, data: FormData): Promise<ApiResponse<any>> => {
    const response = await api.post(`/banner/edit/${id}`, data);
    return response.data;
  },
  deleteBanner: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.post(`/banner/delete/${id}`);
    return response.data;
  },
  createCoupon: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post('/coupon/add', data);
    return response.data;
  },
  getCoupons: async (): Promise<ApiResponse<any>> => {
    const response = await api.post('/coupon/get');
    return response.data;
  },
  updateCoupon: async (id: string, data: any): Promise<ApiResponse<any>> => {
    const response = await api.post(`/coupon/edit/${id}`, data);
    return response.data;
  },
  deleteCoupon: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.post(`/coupon/delete/${id}`);
    return response.data;
  },
  getAllOrders: async (startdate: string, enddate: string): Promise<ApiResponse<Order[]>> => {
    const response = await api.post('/orders/all', { startdate, enddate });
    return response.data;
  },
  getOrderDetail: async (orderid: string): Promise<ApiResponse<{ orderdetails: Order; address: any }>> => {
    const response = await api.post('/orders/admin-details', { orderid });
    return response.data;
  },
  updateOrderStatus: async (orderid: string, orderstatus: string): Promise<ApiResponse<any>> => {
    const response = await api.post('/orders/update-status', { orderid, orderstatus });
    return response.data;
  },
  getDashboardCounts: async (): Promise<ApiResponse<DashboardCounts>> => {
    const response = await api.post('/dashboard/counts');
    return response.data;
  },
  getDashboardSales: async (year: number): Promise<ApiResponse<DashboardSalesResponse>> => {
    const response = await api.post('/dashboard/sales', { year });
    return response.data;
  },
};

export default api;
