import React, { useState } from 'react';
import { User, Menu, LogOut, Bell, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard', orders: 'Orders', products: 'Products',
  categories: 'Categories', customers: 'Customers', inventory: 'Inventory',
  coupons: 'Coupons & Offers', testimonials: 'Testimonials', reviews: 'Product Reviews',
  contact: 'Contact Us', banners: 'Banners', 'gift-hampers': 'Gift Hampers',
  'festival-collections': 'Festival Collections', reports: 'Reports', settings: 'Settings',
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const segment = pathname.split('/').filter(Boolean).pop() ?? '';
  const pageLabel = routeLabels[segment] ?? 'Admin';

  return (
    <header className="h-16 shrink-0 sticky top-0 z-10 w-full
      bg-white border-b border-dark-brown-100
      flex items-center justify-between px-4 sm:px-6
      shadow-[0_1px_12px_rgba(58,43,37,0.06)]">

      {/* Left */}
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-1 rounded-lg text-dark-brown-500 hover:bg-dark-brown-50 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Divider + page label */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-0.5 rounded-full bg-gradient-to-b from-saffron-500 to-temple-gold-500" />
            <span className="text-base font-heading font-semibold text-dark-brown-900 tracking-tight">
              {pageLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* Notification bell */}
        <button className="relative p-2 rounded-xl text-dark-brown-400 hover:text-dark-brown-700 hover:bg-dark-brown-50 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-saffron-500 ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-dark-brown-100 mx-1" />

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(p => !p)}
            className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-dark-brown-50 transition-colors group"
          >
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-saffron-500 to-temple-gold-500 flex items-center justify-center shadow-sm">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-dark-brown-900 leading-tight">Admin</p>
              <p className="text-xs text-dark-brown-400 leading-tight">Administrator</p>
            </div>
            <ChevronDown className={`hidden sm:block h-3.5 w-3.5 text-dark-brown-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-dark-brown-100 shadow-lg shadow-dark-brown-900/10 z-20 overflow-hidden">
                <div className="px-4 py-3 border-b border-dark-brown-100">
                  <p className="text-sm font-semibold text-dark-brown-900">Admin User</p>
                  <p className="text-xs text-dark-brown-400 truncate">admin@poojastore.com</p>
                </div>
                <button
                  onClick={() => { setShowDropdown(false); navigate('/login'); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-dark-brown-600 hover:bg-saffron-50 hover:text-saffron-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
