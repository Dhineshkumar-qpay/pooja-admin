import React, { useState, useEffect } from 'react';
import {
  IndianRupee,
  ShoppingCart,
  Package,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { authService } from '../services/api';
import type { DashboardCounts } from '../types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart, Bar, Cell,

} from 'recharts';
import {
  Download,
} from 'lucide-react';


export const Dashboard: React.FC = () => {
  const [counts, setCounts] = useState<DashboardCounts | null>(null);
  const [salesData, setSalesData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const countsRes = await authService.getDashboardCounts();
        setCounts(countsRes.data as DashboardCounts || countsRes as unknown as DashboardCounts);

        const salesRes = await authService.getDashboardSales(new Date().getFullYear());
        const sales = salesRes.data?.sales || (salesRes as any).sales || [];

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyData = monthNames.map(month => ({ month, revenue: 0, orders: 0 }));

        sales.forEach((s: any) => {
          if (s.month) {
            const shortMonth = s.month.substring(0, 3);
            const monthIndex = monthNames.indexOf(shortMonth);
            if (monthIndex !== -1) {
              monthlyData[monthIndex].revenue += Number(s.totalamount) || 0;
              monthlyData[monthIndex].orders += Number(s.totalorders) || 0;
            }
          }
        });

        setSalesData(monthlyData);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-heading font-bold text-dark-brown-900">Dashboard</h1>
        <div className="flex gap-2 text-sm">
          <select className="border border-dark-brown-200 rounded-md px-3 py-2 bg-white text-dark-brown-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-temple-gold-500">
            <option>2026</option>
            <option>2027</option>
            <option>2028</option>
            <option>2029</option>
            <option>2030</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-saffron-600 to-temple-gold-500 text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`₹${(counts?.totalrevenue || 0).toLocaleString()}`} icon={IndianRupee} />
        <StatCard title="Total Orders" value={(counts?.totalorders || 0).toLocaleString()} icon={ShoppingCart} />
        <StatCard title="Total Products" value={(counts?.totalproducts || 0).toLocaleString()} icon={Package} />
        <StatCard title="Total Customers" value={(counts?.totalcustomers || 0).toLocaleString()} icon={Users} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Pending Orders" value={(counts?.pendingorders || 0).toString()} icon={Clock} />
        <StatCard title="Delivered Orders" value={(counts?.deliveredorders || 0).toString()} icon={CheckCircle2} />
        <StatCard title="Low Stock Products" value={(counts?.lowstockproducts || 0).toString()} icon={AlertTriangle} />
      </div>

      {/* Revenue & Orders chart */}
      <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-sm hover:shadow-[0_8px_30px_rgba(58,43,37,0.08)] transition-all duration-300 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <h2 className="text-base font-heading font-semibold text-dark-brown-900">Revenue & Orders Overview</h2>
          <div className="flex items-center gap-4 text-xs text-dark-brown-500">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-saffron-500 inline-block" />Revenue</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-temple-gold-400 inline-block" />Orders</span>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f05000" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f05000" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d49822" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#d49822" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eae4df" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#967d6e', fontSize: 12 }} dy={10} />
              <YAxis yAxisId="rev" axisLine={false} tickLine={false} tick={{ fill: '#967d6e', fontSize: 12 }} tickFormatter={v => `₹${v / 1000}k`} dx={-10} />
              <YAxis yAxisId="ord" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#967d6e', fontSize: 12 }} dx={10} />
              <Tooltip
                contentStyle={{ borderRadius: '10px', border: '1px solid #eae4df', boxShadow: '0 4px 12px rgba(58,43,37,0.1)' }}
                formatter={(value: any, name: any) => [
                  name === 'revenue' ? `₹${Number(value).toLocaleString()}` : value,
                  name === 'revenue' ? 'Revenue' : 'Orders',
                ]}
              />
              <Area yAxisId="rev" type="monotone" dataKey="revenue" stroke="#f05000" strokeWidth={2} fill="url(#gradRevenue)" />
              <Area yAxisId="ord" type="monotone" dataKey="orders" stroke="#d49822" strokeWidth={2} fill="url(#gradOrders)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar chart + Pie chart */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-dark-brown-100 shadow-sm hover:shadow-[0_8px_30px_rgba(58,43,37,0.08)] transition-all duration-300 p-6">
        <h2 className="text-base font-heading font-semibold text-dark-brown-900 mb-6">Monthly Order Volume</h2>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eae4df" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#967d6e', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#967d6e', fontSize: 12 }} dx={-10} />
              <Tooltip
                contentStyle={{ borderRadius: '10px', border: '1px solid #eae4df', boxShadow: '0 4px 12px rgba(58,43,37,0.1)' }}
                formatter={(value: any) => [value, 'Orders']}
              />
              <Bar dataKey="orders" radius={[6, 6, 0, 0]}>
                {salesData.map((_, i) => (
                  <Cell key={i} fill={i === salesData.length - 1 ? '#f05000' : '#ffd5af'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
