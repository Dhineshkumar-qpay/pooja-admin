import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Package, MapPin,
  CheckCircle2, Printer, Hash,
  ShoppingBag, Truck, Clock, XCircle,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { authService, IMAGE_BASE_URL } from '../services/api';

const ORDER_STATUSES = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending:   <Clock className="h-3.5 w-3.5" />,
  confirmed: <CheckCircle2 className="h-3.5 w-3.5" />,
  packed:    <Package className="h-3.5 w-3.5" />,
  shipped:   <Truck className="h-3.5 w-3.5" />,
  delivered: <ShoppingBag className="h-3.5 w-3.5" />,
  cancelled: <XCircle className="h-3.5 w-3.5" />,
};

export const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [orderStatus, setOrderStatus] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        const res = await authService.getOrderDetail(id);
        if (res.data) {
          setOrderData(res.data);
          setOrderStatus(res.data.orderdetails.orderstatus.toLowerCase());
        }
      } catch (err) {
        console.error("Failed to fetch order detail", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-dark-brown-400">
        <p className="text-base font-semibold text-dark-brown-700">Loading Order Details...</p>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-dark-brown-400">
        <div className="h-16 w-16 rounded-2xl bg-dark-brown-50 flex items-center justify-center mb-4">
          <Package className="h-8 w-8 opacity-40" />
        </div>
        <p className="text-base font-semibold text-dark-brown-700">Order not found</p>
        <p className="text-sm text-dark-brown-400 mt-1">The order you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/admin/orders')}
          className="mt-5 px-4 py-2 rounded-xl bg-gradient-to-r from-saffron-600 to-temple-gold-500 text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity">
          Back to Orders
        </button>
      </div>
    );
  }

  const { orderdetails: order, address } = orderData;
  const subtotal = order.orderitems.reduce((s: number, i: any) => s + i.quantity * i.price, 0);
  const shipping = order.shippingprice || 0;
  const total = subtotal + shipping;
  const statusIndex = ORDER_STATUSES.indexOf(orderStatus);
  const isCancelled = orderStatus === 'cancelled';

  const handleSave = () => { 
    // Usually you'd call an API here like: await authService.updateOrderStatus(order.orderid, orderStatus)
    setSaved(true); 
    setTimeout(() => setSaved(false), 2500); 
  };

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button onClick={() => navigate('/admin/orders')}
          className="p-2 w-fit rounded-xl border border-dark-brown-200 text-dark-brown-500 hover:bg-dark-brown-50 hover:text-dark-brown-800 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-heading font-bold text-dark-brown-900">{order.orderid}</h1>
            <StatusBadge status={orderStatus} />
            <StatusBadge status={order.paymentstatus === 'paid' ? 'Paid' : 'Pending'} />
          </div>
          <p className="text-sm text-dark-brown-400 mt-0.5 flex items-center gap-1.5">
            <Hash className="h-3.5 w-3.5" /> Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dark-brown-200 text-dark-brown-600 text-sm font-medium hover:bg-dark-brown-50 transition-colors w-fit">
          <Printer className="h-4 w-4" /> Print Invoice
        </button>
      </div>

      {/* ── Progress stepper ── */}
      <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-sm p-6">
        <p className="text-xs font-semibold text-dark-brown-400 uppercase tracking-wider mb-6">Order Progress</p>
        <div className="flex items-start">
          {ORDER_STATUSES.filter(s => s !== 'cancelled').map((s, i, arr) => {
            const done = !isCancelled && ORDER_STATUSES.indexOf(s) <= statusIndex;
            const current = !isCancelled && ORDER_STATUSES.indexOf(s) === statusIndex;
            const isLast = i === arr.length - 1;
            return (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    done
                      ? 'bg-gradient-to-br from-saffron-500 to-temple-gold-500 border-temple-gold-400 shadow-md shadow-temple-gold-200'
                      : 'bg-white border-dark-brown-200'
                  } ${current ? 'ring-4 ring-saffron-100' : ''}`}>
                    <span className={done ? 'text-white' : 'text-dark-brown-300'}>
                      {STATUS_ICONS[s]}
                    </span>
                  </div>
                  <span className={`text-xs font-medium whitespace-nowrap capitalize ${
                    done ? 'text-saffron-600' : 'text-dark-brown-300'
                  }`}>{s}</span>
                </div>
                {!isLast && (
                  <div className={`flex-1 h-0.5 mt-4 mx-1 rounded-full transition-all duration-500 ${
                    !isCancelled && ORDER_STATUSES.indexOf(arr[i + 1]) <= statusIndex
                      ? 'bg-gradient-to-r from-saffron-500 to-temple-gold-400'
                      : 'bg-dark-brown-100'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        {isCancelled && (
          <div className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-dark-brown-50 rounded-xl w-fit">
            <XCircle className="h-4 w-4 text-dark-brown-500" />
            <span className="text-sm text-dark-brown-600 font-medium">This order has been cancelled</span>
          </div>
        )}
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — items + status update */}
        <div className="lg:col-span-2 space-y-6">

          {/* Order items */}
          <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-dark-brown-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-temple-gold-50 rounded-lg">
                  <Package className="h-4 w-4 text-temple-gold-600" />
                </div>
                <h2 className="text-sm font-semibold text-dark-brown-800">Order Items</h2>
              </div>
              <span className="text-xs text-dark-brown-400 bg-dark-brown-50 px-2.5 py-1 rounded-full font-medium">
                {order.orderitems.length} {order.orderitems.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <div className="divide-y divide-dark-brown-50">
              {order.orderitems.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-ivory-50 transition-colors group">
                  <div className="h-12 w-12 rounded-xl overflow-hidden border border-dark-brown-100 shrink-0">
                    <img src={`${IMAGE_BASE_URL}${item.productimage}`} alt={item.productname} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-dark-brown-900 truncate">{item.productname}</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-6">
                    <div className="text-center hidden sm:block">
                      <p className="text-xs text-dark-brown-400">Unit Price</p>
                      <p className="text-sm font-medium text-dark-brown-700 mt-0.5">₹{item.price.toLocaleString()}</p>
                    </div>
                    <div className="text-center hidden sm:block">
                      <p className="text-xs text-dark-brown-400">Qty</p>
                      <p className="text-sm font-medium text-dark-brown-700 mt-0.5">{item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-dark-brown-400">Total</p>
                      <p className="text-sm font-bold text-dark-brown-900 mt-0.5">₹{(item.quantity * item.price).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill summary */}
            <div className="px-6 py-5 bg-gradient-to-br from-ivory-50 to-ivory-100 border-t border-dark-brown-100">
              <div className="max-w-xs ml-auto space-y-2.5">
                <div className="flex justify-between text-sm text-dark-brown-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-dark-brown-700">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-dark-brown-500">
                  <span>Shipping</span>
                  <span className="font-medium text-dark-brown-700">₹{shipping}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-dark-brown-900 pt-3 border-t border-dark-brown-200">
                  <span>Grand Total</span>
                  <span className="text-saffron-600">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Update status */}
          <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="p-1.5 bg-saffron-50 rounded-lg">
                <Truck className="h-4 w-4 text-saffron-600" />
              </div>
              <h2 className="text-sm font-semibold text-dark-brown-800">Update Order Status</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-5">
              {ORDER_STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => { setOrderStatus(s); setSaved(false); }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all capitalize ${
                    orderStatus === s
                      ? 'bg-gradient-to-r from-saffron-600 to-temple-gold-500 text-white border-transparent shadow-md shadow-saffron-200'
                      : 'bg-white text-dark-brown-600 border-dark-brown-200 hover:border-saffron-300 hover:text-saffron-600 hover:bg-saffron-50'
                  }`}
                >
                  <span className={orderStatus === s ? 'text-white' : 'text-dark-brown-400'}>{STATUS_ICONS[s]}</span>
                  {s}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-end border-t border-dark-brown-100 pt-5 mt-2">
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium text-green-600 transition-opacity ${saved ? 'opacity-100' : 'opacity-0'}`}>
                  Saved successfully!
                </span>
                <button
                  onClick={handleSave}
                  disabled={orderStatus === order.orderstatus}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-saffron-600 to-temple-gold-500 text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right — customer & delivery info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-dark-brown-100 bg-dark-brown-50/50">
              <h2 className="text-sm font-semibold text-dark-brown-800">Customer Details</h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-sm font-bold text-dark-brown-900">{address.firstname} {address.lastname}</p>
                <p className="text-sm text-dark-brown-500 mt-1">{address.phone}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-dark-brown-100 bg-dark-brown-50/50">
              <h2 className="text-sm font-semibold text-dark-brown-800">Shipping Address</h2>
            </div>
            <div className="p-5 flex gap-3">
              <MapPin className="h-4 w-4 text-saffron-500 shrink-0 mt-0.5" />
              <p className="text-sm text-dark-brown-700 leading-relaxed">
                {address.addressline1}<br />
                {address.addressline2 && <>{address.addressline2}<br /></>}
                {address.city}, {address.state} - {address.pincode}<br />
                {address.country}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-dark-brown-100 bg-dark-brown-50/50">
              <h2 className="text-sm font-semibold text-dark-brown-800">Payment Information</h2>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-dark-brown-500">Method</span>
                <span className="font-medium text-dark-brown-900">Razorpay</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-dark-brown-500">Status</span>
                <StatusBadge status={order.paymentstatus === 'paid' ? 'Paid' : 'Pending'} />
              </div>
              {order.razorpayorderid && (
                <div className="pt-3 border-t border-dark-brown-50">
                  <p className="text-xs text-dark-brown-400 mb-1">Transaction ID</p>
                  <p className="text-sm font-mono text-dark-brown-800 truncate" title={order.razorpayorderid}>{order.razorpayorderid}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
