import React from 'react';

type StatusType = 
  | 'Pending' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered' 
  | 'Cancelled' | 'Returned' | 'Refunded'
  | 'Active' | 'Inactive' | 'Out of Stock' | 'Low Stock' | 'In Stock';

interface StatusBadgeProps {
  status: StatusType | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-800';

  switch (status) {
    case 'Delivered':
    case 'Active':
    case 'In Stock':
    case 'Confirmed':
      bgColor = 'bg-temple-gold-50';
      textColor = 'text-temple-gold-700';
      break;
    case 'Pending':
      bgColor = 'bg-ivory-300';
      textColor = 'text-dark-brown-700';
      break;
    case 'Packed':
    case 'Shipped':
      bgColor = 'bg-saffron-50';
      textColor = 'text-saffron-700';
      break;
    case 'Cancelled':
    case 'Returned':
    case 'Refunded':
    case 'Inactive':
    case 'Out of Stock':
      bgColor = 'bg-dark-brown-100';
      textColor = 'text-dark-brown-800';
      break;
    case 'Low Stock':
      bgColor = 'bg-saffron-100';
      textColor = 'text-saffron-800';
      break;
    default:
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};
