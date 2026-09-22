import React, { useState } from 'react';
import {
  IndianRupee, ShoppingCart, Users, TrendingUp,
  TrendingDown, Package, Download,
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const monthlyRevenue = [
  { month: 'Jan', revenue: 52000, orders: 210 },
  { month: 'Feb', revenue: 68000, orders: 275 },
  { month: 'Mar', revenue: 61000, orders: 248 },
  { month: 'Apr', revenue: 79000, orders: 312 },
  { month: 'May', revenue: 95000, orders: 380 },
  { month: 'Jun', revenue: 88000, orders: 354 },
  { month: 'Jul', revenue: 112000, orders: 445 },
  { month: 'Aug', revenue: 104000, orders: 418 },
  { month: 'Sep', revenue: 125000, orders: 502 },
];

const categoryData = [
  { name: 'Pooja Items', value: 38 },
  { name: 'Incense', value: 22 },
  { name: 'Diyas', value: 18 },
  { name: 'Malas', value: 12 },
  { name: 'Essentials', value: 10 },
];

const topProducts = [
  { name: 'Premium Pooja Thali Set', category: 'Pooja Items', sold: 312, revenue: 779688 },
  { name: 'Sandalwood Incense Sticks', category: 'Incense', sold: 284, revenue: 141716 },
  { name: 'Brass Diya Set of 5', category: 'Diyas', sold: 198, revenue: 198594 },
  { name: 'Tulsi Mala 108 Beads', category: 'Malas', sold: 175, revenue: 139825 },
  { name: 'Camphor Tablets Pack', category: 'Essentials', sold: 163, revenue: 48737 },
];

const orderStatusData = [
  { status: 'Delivered', count: 1120, color: '#d49822' },
  { status: 'Shipped', count: 210, color: '#f05000' },
  { status: 'Packed', count: 95, color: '#ff8c40' },
  { status: 'Pending', count: 45, color: '#b5a195' },
  { status: 'Cancelled', count: 38, color: '#46342b' },
];

const PIE_COLORS = ['#f05000', '#d49822', '#ff8c40', '#b57319', '#7e6353'];

const ranges = ['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'This Year'];

export const Reports: React.FC = () => {
  const [range, setRange] = useState('Last 3 Months');

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-heading font-bold text-dark-brown-900">Reports</h1>
        <div className="flex items-center gap-3">
          <select
            value={range}
            onChange={e => setRange(e.target.value)}
            className="border border-dark-brown-200 rounded-xl px-3 py-2 text-sm bg-white text-dark-brown-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-temple-gold-500"
          >
            {ranges.map(r => <option key={r}>{r}</option>)}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-saffron-600 to-temple-gold-500 text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="₹7,84,000" icon={IndianRupee} trend={{ value: 14.2, isPositive: true }} subtitle="vs last period" />
        <StatCard title="Total Orders" value="2,744" icon={ShoppingCart} trend={{ value: 9.8, isPositive: true }} subtitle="vs last period" />
        <StatCard title="New Customers" value="1,382" icon={Users} trend={{ value: 6.3, isPositive: true }} subtitle="vs last period" />
        <StatCard title="Avg. Order Value" value="₹2,856" icon={TrendingUp} trend={{ value: 3.1, isPositive: true }} subtitle="vs last period" />
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
            <AreaChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                formatter={(value: any, name: string) => [
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Monthly orders bar */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-dark-brown-100 shadow-sm hover:shadow-[0_8px_30px_rgba(58,43,37,0.08)] transition-all duration-300 p-6">
          <h2 className="text-base font-heading font-semibold text-dark-brown-900 mb-6">Monthly Order Volume</h2>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue} margin={{ top: 0, right: 10, left: 0, bottom: 0 }} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eae4df" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#967d6e', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#967d6e', fontSize: 12 }} dx={-10} />
                <Tooltip
                  contentStyle={{ borderRadius: '10px', border: '1px solid #eae4df', boxShadow: '0 4px 12px rgba(58,43,37,0.1)' }}
                  formatter={(value: any) => [value, 'Orders']}
                />
                <Bar dataKey="orders" radius={[6, 6, 0, 0]}>
                  {monthlyRevenue.map((_, i) => (
                    <Cell key={i} fill={i === monthlyRevenue.length - 1 ? '#f05000' : '#ffd5af'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category pie */}
        <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-sm hover:shadow-[0_8px_30px_rgba(58,43,37,0.08)] transition-all duration-300 p-6">
          <h2 className="text-base font-heading font-semibold text-dark-brown-900 mb-4">Sales by Category</h2>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '10px', border: '1px solid #eae4df' }}
                  formatter={(value: any) => [`${value}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {categoryData.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="text-xs text-dark-brown-600">{c.name}</span>
                </div>
                <span className="text-xs font-semibold text-dark-brown-800">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top products + Order status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Top products */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-dark-brown-100 shadow-sm hover:shadow-[0_8px_30px_rgba(58,43,37,0.08)] transition-all duration-300 overflow-hidden">
          <div className="px-6 py-4 border-b border-dark-brown-100">
            <h2 className="text-base font-heading font-semibold text-dark-brown-900">Top Selling Products</h2>
          </div>
          <div className="divide-y divide-dark-brown-50">
            {topProducts.map((p, i) => {
              const maxSold = topProducts[0].sold;
              const pct = Math.round((p.sold / maxSold) * 100);
              return (
                <div key={p.name} className="flex items-center gap-4 px-6 py-4 hover:bg-ivory-50 transition-colors">
                  <span className="text-sm font-bold text-dark-brown-300 w-5 shrink-0">#{i + 1}</span>
                  <div className="h-10 w-10 rounded-xl bg-temple-gold-50 flex items-center justify-center shrink-0">
                    <Package className="h-5 w-5 text-temple-gold-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark-brown-900 truncate">{p.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-dark-brown-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-saffron-500 to-temple-gold-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-dark-brown-400 shrink-0">{p.sold} sold</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-dark-brown-900">₹{p.revenue.toLocaleString()}</p>
                    <p className="text-xs text-dark-brown-400">{p.category}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order status breakdown */}
        <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-sm hover:shadow-[0_8px_30px_rgba(58,43,37,0.08)] transition-all duration-300 p-6">
          <h2 className="text-base font-heading font-semibold text-dark-brown-900 mb-5">Order Status</h2>
          <div className="space-y-4">
            {orderStatusData.map(s => {
              const total = orderStatusData.reduce((a, b) => a + b.count, 0);
              const pct = Math.round((s.count / total) * 100);
              return (
                <div key={s.status}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm text-dark-brown-700 font-medium">{s.status}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-dark-brown-400">{s.count}</span>
                      <span className="text-xs font-semibold text-dark-brown-700">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-dark-brown-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: s.color }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-6 pt-4 border-t border-dark-brown-100 grid grid-cols-2 gap-3">
            <div className="bg-temple-gold-50 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-temple-gold-700">
                {orderStatusData.find(s => s.status === 'Delivered')?.count.toLocaleString()}
              </p>
              <p className="text-xs text-dark-brown-500 mt-0.5">Delivered</p>
            </div>
            <div className="bg-saffron-50 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-saffron-700">
                {orderStatusData.find(s => s.status === 'Pending')?.count}
              </p>
              <p className="text-xs text-dark-brown-500 mt-0.5">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Highest Revenue Month', value: 'September', sub: '₹1,25,000', icon: TrendingUp, positive: true },
          { label: 'Lowest Revenue Month', value: 'January', sub: '₹52,000', icon: TrendingDown, positive: false },
          { label: 'Best Selling Category', value: 'Pooja Items', sub: '38% of total sales', icon: Package, positive: true },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-2xl border border-dark-brown-100 shadow-sm hover:shadow-[0_8px_30px_rgba(58,43,37,0.08)] transition-all duration-300 p-6 flex items-center gap-4">
            <div className="p-3 bg-temple-gold-50 rounded-xl shrink-0">
              <card.icon className="h-5 w-5 text-temple-gold-600" />
            </div>
            <div>
              <p className="text-xs text-dark-brown-400">{card.label}</p>
              <p className="text-base font-bold text-dark-brown-900 mt-0.5">{card.value}</p>
              <p className={`text-xs font-medium mt-0.5 ${card.positive ? 'text-temple-gold-600' : 'text-saffron-600'}`}>{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
