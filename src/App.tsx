import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Orders } from "./pages/Orders";
import { OrderDetail } from "./pages/OrderDetail";
import { Products } from "./pages/Products";
import { AddProduct } from "./pages/AddProduct";
import { ProductDetail } from "./pages/ProductDetail";
import { EditProduct } from "./pages/EditProduct";
import { Categories } from "./pages/Categories";
import { AddCategory } from "./pages/AddCategory";
import { Customers } from "./pages/Customers";
import { Inventory } from "./pages/Inventory";
import { Coupons } from "./pages/Coupons";
import { AddCoupon } from "./pages/AddCoupon";
import { Settings } from "./pages/Settings";
import { Testimonials } from "./pages/Testimonials";
import { ContactUs } from "./pages/ContactUs";
import { Banners } from "./pages/Banners";
import { AddBanner } from "./pages/AddBanner";
import { ProductReviews } from "./pages/ProductReviews";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="products/:id/edit" element={<EditProduct />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/add" element={<AddCategory />} />
          <Route path="customers" element={<Customers />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="coupons/add" element={<AddCoupon />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="reviews" element={<ProductReviews />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="banners" element={<Banners />} />
          <Route path="banners/add" element={<AddBanner />} />
          <Route path="settings" element={<Settings />} />
          <Route
            path="*"
            element={
              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                Page under construction
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
