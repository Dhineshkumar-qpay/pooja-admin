import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import type { Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { authService, IMAGE_BASE_URL } from '../services/api';
import type { Order } from '../types';


export const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchOrders = async () => {
    try {
      // Default to a wide range to get all orders, or adjust as needed
      const startdate = '2020-01-01';
      const enddate = '2030-12-31';
      const res = await authService.getAllOrders(startdate, enddate);
      if (res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = orders.filter((o) => {
    const term = search.toLowerCase();
    const matchSearch = o.orderid.toLowerCase().includes(term);
    const matchStatus = statusFilter === "All" || o.orderstatus.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const columns: Column<Order>[] = [
    {
      key: 'orderid',
      header: 'Order Details',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.orderitems?.[0] && row.orderitems[0].productimage ? (
            <img 
              src={`${IMAGE_BASE_URL}${row.orderitems[0].productimage}`} 
              alt={row.orderitems[0].productname} 
              className="h-10 w-10 rounded-md object-cover flex-shrink-0" 
            />
          ) : (
            <div className="h-10 w-10 rounded-md bg-dark-brown-50 border border-dark-brown-100 flex-shrink-0" />
          )}
          <div className="flex flex-col">
            <span className="font-medium text-dark-brown-900 block truncate max-w-[200px]" title={row.orderitems?.[0]?.productname}>
              {row.orderitems?.[0]?.productname || "Unknown Product"} {row.orderitems?.length > 1 && `+${row.orderitems.length - 1} more`}
            </span>
          </div>
        </div>
      )
    },
    { key: 'createdAt', header: 'Order Date', render: (row) => new Date(row.createdAt).toLocaleDateString() },
    { key: 'items', header: 'Items', render: (row) => row.orderitems?.length || 0 },
    { key: 'totalamount', header: 'Total', render: (row) => `₹${row.totalamount.toLocaleString()}` },
    { key: 'paymentstatus', header: 'Payment', render: (row) => <StatusBadge status={row.paymentstatus === 'paid' ? 'Paid' : 'Pending'} /> },
    { key: 'orderstatus', header: 'Status', render: (row) => <StatusBadge status={row.orderstatus} /> },
    {
      key: 'actions', header: 'Actions', render: (row) => (
        <div className="flex gap-3">
          <button onClick={() => navigate(`/admin/orders/${row.orderid}`)} className="text-dark-brown-400 hover:text-temple-gold-600 transition-colors" title="View Details"><Eye className="h-4 w-4" /></button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-heading font-bold text-dark-brown-900">Orders</h1>
      </div>

      <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-[0_4px_20px_rgba(58,43,37,0.04)] transition-all duration-300 overflow-hidden">
        <div className="p-4 border-b border-dark-brown-100 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by Order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-dark-brown-200 rounded-md px-3 py-2 text-sm text-dark-brown-900 placeholder-dark-brown-400 focus:outline-none focus:ring-1 focus:ring-temple-gold-500 focus:border-temple-gold-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-dark-brown-200 rounded-md px-3 py-2 text-sm bg-white text-dark-brown-900 focus:outline-none focus:ring-1 focus:ring-temple-gold-500 focus:border-temple-gold-500"
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-dark-brown-500">Loading orders...</div>
        ) : (
          <DataTable columns={columns} data={filtered} keyExtractor={(item) => item.orderid} />
        )}
      </div>
    </div>
  );
};
