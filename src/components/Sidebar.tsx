import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Tags,
  Users,
  Boxes,
  Ticket,
  MessageSquareQuote,
  Star,
  PhoneCall,
  Image,
  Gift,
  CalendarDays,
  BarChart3,
  Settings,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { name: "Categories", path: "/admin/categories", icon: Tags },
  { name: "Products", path: "/admin/products", icon: Package },
  { name: "Product Reviews", path: "/admin/reviews", icon: Star },
  { name: "Customers", path: "/admin/customers", icon: Users },
  { name: "Inventory", path: "/admin/inventory", icon: Boxes },
  { name: "Coupons & Offers", path: "/admin/coupons", icon: Ticket },
  {
    name: "Testimonials",
    path: "/admin/testimonials",
    icon: MessageSquareQuote,
  },
  { name: "Contact Us", path: "/admin/contact", icon: PhoneCall },
  { name: "Banners", path: "/admin/banners", icon: Image },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-dark-brown-900 to-dark-brown-800 border-r border-dark-brown-800 flex flex-col h-full transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:shadow-2xl ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-dark-brown-700/50 shrink-0">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-saffron-500 to-temple-gold-500 flex items-center justify-center mr-3 shadow-sm">
            <span className="text-white font-bold text-lg leading-none">P</span>
          </div>
          <h1 className="text-xl font-heading font-bold text-white tracking-tight">
            Pooja Admin
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                    ? "bg-gradient-to-r from-saffron-600 to-temple-gold-500 text-white shadow-md border border-temple-gold-500/30"
                    : "text-dark-brown-300 hover:bg-dark-brown-800/50 hover:text-white border border-transparent"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${isActive ? "text-white" : "text-dark-brown-400 group-hover:text-white"}`}
                    />
                    {item.name}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
