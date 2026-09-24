export interface ApiResponse<T = any> {
  success?: boolean;
  status?: number;
  message?: string;
  data?: T;
  token?: string;
  user?: User;
}

export interface User {
  userid: string;
  id?: string;
  name: string;
  email: string;
  mobile?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  totalamount?: number;
  totalorders?: number;
}

export interface Category {
  categoryid: string;
  name?: string;
  categoryname?: string;
  description?: string;
  thumbnailimage?: string;
  productcount?: number;
  image?: string;
  status?: string;
  createdAt?: string;
}

export interface Product {
  productid: string;
  name?: string;
  productname?: string;
  description?: string;
  price?: number | string;
  sellingprice?: number | string;
  originalPrice?: number | string;
  stock?: number | string;
  stockquantity?: number | string;
  categoryId?: string;
  categoryid?: string;
  categoryname?: string;
  brand?: string;
  dimensions?: string;
  benefits?: string;
  countryoforigin?: string;
  isFeatured?: string | boolean;
  isNewarrival?: string | boolean;
  images?: string[];
  thumbnailimage?: string;
  status?: string;
  createdAt?: string;
}

export interface OrderItem {
  orderitemid: string;
  productname: string;
  quantity: number;
  price: number;
  image?: string;
  image_url?: string;
  productimage?: string;
}

export interface OrderAddress {
  firstname: string;
  lastname?: string;
  phone: string;
  addressline1: string;
  addressline2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Order {
  orderid: string;
  userid?: string;
  totalamount: number;
  shippingprice?: number;
  paymentstatus: string;
  orderstatus: string;
  razorpayorderid?: string;
  createdAt: string;
  orderitems: OrderItem[];
  address?: OrderAddress;
}

export interface Coupon {
  couponid: string;
  code?: string;
  couponcode?: string;
  discountType?: string;
  type?: string;
  discountValue?: number;
  value?: number;
  minOrderValue?: number;
  minorder?: number;
  validFrom?: string;
  validUntil?: string;
  expiry?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Banner {
  bannerid: string;
  title?: string;
  subtitle?: string;
  bannerimage: string;
  link?: string;
  status?: string;
  createdAt?: string;
}

export interface Testimonial {
  testimonialid: string;
  author?: string;
  fullname?: string;
  content?: string;
  review?: string;
  rating?: number;
  location?: string;
  title?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactRequest {
  contactid: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductReview {
  reviewid: string;
  productid?: string;
  userid?: string;
  rating: number;
  comment?: string;
  status?: string;
  createdAt?: string;
}

export interface DashboardCounts {
  totalrevenue: number;
  totalorders: number;
  totalproducts: number;
  totalcustomers: number;
  pendingorders: number;
  confirmedorders: number;
  shippedorders: number;
  deliveredorders: number;
  cancelledorders: number;
  lowstockproducts: number;
}

export interface DashboardSalesItem {
  totalorders: number;
  totalamount: number;
  month: string;
}

export interface DashboardSalesResponse {
  sales: DashboardSalesItem[];
}
