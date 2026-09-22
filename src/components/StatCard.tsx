import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, subtitle }) => {
  return (
    <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-[0_4px_20px_rgba(58,43,37,0.04)] hover:shadow-[0_8px_30px_rgba(58,43,37,0.08)] hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-dark-brown-500">{title}</p>
          <h3 className="text-2xl font-bold font-heading text-dark-brown-900 mt-2">{value}</h3>
        </div>
        <div className="p-3 bg-temple-gold-50 rounded-xl">
          <Icon className="h-6 w-6 text-temple-gold-600" />
        </div>
      </div>
      
      {(trend || subtitle) && (
        <div className="mt-4 flex items-center text-sm">
          {trend && (
            <span className={`font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          )}
          {subtitle && (
            <span className="text-gray-500 ml-2">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
};
