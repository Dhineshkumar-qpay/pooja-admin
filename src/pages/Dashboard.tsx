import React from 'react';
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
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const salesData = [
  { name: 'Jan', total: 12000 },
  { name: 'Feb', total: 19000 },
  { name: 'Mar', total: 15000 },
  { name: 'Apr', total: 22000 },
  { name: 'May', total: 28000 },
  { name: 'Jun', total: 25000 },
  { name: 'Jul', total: 32000 },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-heading font-bold text-dark-brown-900">Dashboard</h1>
        <div className="flex gap-2 text-sm">
          <select className="border border-dark-brown-200 rounded-md px-3 py-2 bg-white text-dark-brown-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-temple-gold-500">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="₹2,45,000" icon={IndianRupee} trend={{ value: 12.5, isPositive: true }} subtitle="vs last month" />
        <StatCard title="Total Orders" value="1,245" icon={ShoppingCart} trend={{ value: 8.2, isPositive: true }} subtitle="vs last month" />
        <StatCard title="Total Products" value="342" icon={Package} />
        <StatCard title="Total Customers" value="8,921" icon={Users} trend={{ value: 4.1, isPositive: true }} subtitle="vs last month" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Pending Orders" value="45" icon={Clock} />
        <StatCard title="Delivered Orders" value="1,120" icon={CheckCircle2} />
        <StatCard title="Low Stock Products" value="12" icon={AlertTriangle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-dark-brown-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
          <h2 className="text-lg font-heading font-semibold mb-4 text-dark-brown-900">Sales Overview</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f05000" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f05000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eae4df" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#967d6e', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#967d6e', fontSize: 12 }} tickFormatter={(value) => `₹${value/1000}k`} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #eae4df', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="total" stroke="#f05000" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
          <h2 className="text-lg font-heading font-semibold mb-4 text-dark-brown-900">Top Selling Products</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center gap-3 group">
                <div className="h-12 w-12 rounded-lg bg-ivory-100 flex-shrink-0 flex items-center justify-center group-hover:bg-temple-gold-50 transition-colors">
                  <Package className="h-6 w-6 text-dark-brown-400 group-hover:text-temple-gold-600 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-dark-brown-900 truncate">Premium Pooja Thali Set</h4>
                  <p className="text-xs text-dark-brown-500">Pooja Items</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-dark-brown-900">₹2,499</p>
                  <p className="text-xs text-dark-brown-500">124 sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
