import React from 'react';
import { Edit } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import type { Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  threshold: number;
  status: string;
}

const mockInventory: InventoryItem[] = [
  { id: '1', sku: 'PRD-001', name: 'Premium Pooja Thali Set', category: 'Pooja Items', currentStock: 50, reservedStock: 5, availableStock: 45, threshold: 10, status: 'In Stock' },
  { id: '3', sku: 'PRD-003', name: 'Brass Diya Medium', category: 'Diyas & Lamps', currentStock: 8, reservedStock: 3, availableStock: 5, threshold: 10, status: 'Low Stock' },
  { id: '4', sku: 'PRD-004', name: 'Ganga Jal 500ml', category: 'Holy Water', currentStock: 0, reservedStock: 0, availableStock: 0, threshold: 20, status: 'Out of Stock' },
];

export const Inventory: React.FC = () => {
  const columns: Column<InventoryItem>[] = [
    { key: 'name', header: 'Product', render: (row) => (
      <div>
        <div className="font-medium text-dark-brown-900">{row.name}</div>
        <div className="text-xs text-dark-brown-500">{row.sku}</div>
      </div>
    ) },
    { key: 'category', header: 'Category' },
    { key: 'currentStock', header: 'Current' },
    { key: 'reservedStock', header: 'Reserved', render: (row) => <span className="text-dark-brown-500">{row.reservedStock}</span> },
    { key: 'availableStock', header: 'Available', render: (row) => <span className="font-medium">{row.availableStock}</span> },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'actions', header: 'Adjust', render: () => (
      <button className="text-saffron-600 hover:text-saffron-700 font-medium text-sm flex items-center transition-colors">
        <Edit className="h-4 w-4 mr-1" /> Update
      </button>
    ) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-heading font-bold text-dark-brown-900">Inventory</h1>
      </div>
      
      <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-sm hover:shadow-[0_8px_30px_rgba(58,43,37,0.08)] transition-all duration-300 overflow-hidden">
        <div className="p-4 border-b border-dark-brown-100 flex flex-wrap gap-4">
          <input 
            type="text" 
            placeholder="Search by product or SKU..." 
            className="flex-1 min-w-[200px] border border-dark-brown-200 rounded-md px-3 py-2 text-sm text-dark-brown-900 placeholder-dark-brown-400 focus:outline-none focus:ring-1 focus:ring-temple-gold-500 focus:border-temple-gold-500"
          />
          <select className="border border-dark-brown-200 rounded-md px-3 py-2 text-sm bg-white text-dark-brown-900 focus:outline-none focus:ring-1 focus:ring-temple-gold-500 focus:border-temple-gold-500">
            <option>All Inventory</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>
        </div>
        <DataTable columns={columns} data={mockInventory} keyExtractor={(item) => item.id} />
      </div>
    </div>
  );
};
