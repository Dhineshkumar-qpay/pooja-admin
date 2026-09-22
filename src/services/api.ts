import axios from 'axios';

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
  login: async (email: string) => {
    const response = await api.post('/auth/login', { email });
    return response.data;
  },
  verify: async (email: string, otp: string) => {
    const response = await api.post('/auth/verify', { email, otp });
    return response.data;
  },
  getProfile: async () => {
    const response = await api.post('/auth/profile');
    return response.data;
  },
  updateProfile: async (data: { name: string; mobile: string }) => {
    const response = await api.post('/auth/update-profile', data);
    return response.data;
  },
  createCategory: async (data: any) => {
    const response = await api.post('/category/create', data);
    return response.data;
  },
  editCategory: async (id: string, data: any) => {
    const response = await api.post(`/category/edit/${id}`, data);
    return response.data;
  },
  deleteCategory: async (id: string) => {
    const response = await api.post(`/category/delete/${id}`);
    return response.data;
  },
  getCategories: async () => {
    const response = await api.post('/category/get');
    return response.data;
  },
  createProduct: async (data: any) => {
    const response = await api.post('/product/create', data);
    return response.data;
  },
  editProduct: async (id: string, data: any) => {
    const response = await api.post(`/product/edit/${id}`, data);
    return response.data;
  },
  deleteProduct: async (id: string) => {
    const response = await api.post(`/product/delete/${id}`);
    return response.data;
  },
  getProducts: async () => {
    const response = await api.post('/product/get');
    return response.data;
  },
  getProductById: async (id: string) => {
    const response = await api.post(`/product/get/${id}`);
    return response.data;
  },
  getProductReviews: async () => {
    const response = await api.post('/productreviews/get');
    return response.data;
  },
  updateProductReviewStatus: async (id: string, status: string) => {
    const response = await api.post(`/productreviews/update-status/${id}`, { status });
    return response.data;
  },
  deleteProductReview: async (id: string) => {
    const response = await api.post(`/productreviews/delete/${id}`);
    return response.data;
  },
  getAllUsers: async () => {
    const response = await api.post('/auth/get-all');
    return response.data;
  },
  getTestimonials: async (status: string = "") => {
    const response = await api.post('/testimonials/get', { status });
    return response.data;
  },
  updateTestimonialStatus: async (id: string, status: string) => {
    const response = await api.post(`/testimonials/update-status/${id}`, { status });
    return response.data;
  },
  deleteTestimonial: async (id: string) => {
    const response = await api.post(`/testimonials/delete/${id}`);
    return response.data;
  },
  getContacts: async () => {
    const response = await api.post('/contactus/get');
    return response.data;
  },
  deleteContact: async (id: string) => {
    const response = await api.post(`/contactus/delete/${id}`);
    return response.data;
  },
  createBanner: async (data: FormData) => {
    const response = await api.post('/banner/add', data);
    return response.data;
  },
  getBanners: async () => {
    const response = await api.post('/banner/get');
    return response.data;
  },
  updateBanner: async (id: string, data: FormData) => {
    const response = await api.post(`/banner/edit/${id}`, data);
    return response.data;
  },
  deleteBanner: async (id: string) => {
    const response = await api.post(`/banner/delete/${id}`);
    return response.data;
  },
  createCoupon: async (data: any) => {
    const response = await api.post('/coupon/add', data);
    return response.data;
  },
  getCoupons: async () => {
    const response = await api.post('/coupon/get');
    return response.data;
  },
  updateCoupon: async (id: string, data: any) => {
    const response = await api.post(`/coupon/edit/${id}`, data);
    return response.data;
  },
  deleteCoupon: async (id: string) => {
    const response = await api.post(`/coupon/delete/${id}`);
    return response.data;
  },
  getAllOrders: async (startdate: string, enddate: string) => {
    const response = await api.post('/orders/all', { startdate, enddate });
    return response.data;
  },
  getOrderDetail: async (orderid: string) => {
    const response = await api.post('/orders/details', { orderid });
    return response.data;
  },
};

export default api;
