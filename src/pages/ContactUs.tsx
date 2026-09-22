import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Eye, X, AlertTriangle, Reply } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import type { Column } from '../components/DataTable';
import { authService } from '../services/api';

interface ContactInquiry {
  contactid: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export const ContactUs: React.FC = () => {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [viewItem, setViewItem] = useState<ContactInquiry | null>(null);
  const [deleteItem, setDeleteItem] = useState<ContactInquiry | null>(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const res = await authService.getContacts();
      if (res.data) {
        setInquiries(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch contacts", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const confirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await authService.deleteContact(deleteItem.contactid);
      setInquiries(prev => prev.filter(i => i.contactid !== deleteItem.contactid));
    } catch (error) {
      console.error("Failed to delete contact", error);
      alert("Failed to delete contact");
    } finally {
      setDeleteItem(null);
    }
  };

  const filtered = inquiries.filter((i) => {
    const term = search.toLowerCase();
    return (
      i.name.toLowerCase().includes(term) ||
      i.email.toLowerCase().includes(term) ||
      i.subject.toLowerCase().includes(term)
    );
  });

  const columns: Column<ContactInquiry>[] = [
    {
      key: 'name', header: 'Customer',
      render: (row) => (
        <div>
          <div className="font-medium text-dark-brown-900">{row.name}</div>
          <div className="text-xs text-dark-brown-500 flex items-center gap-1 mt-0.5">
            <Mail className="h-3 w-3" /> {row.email}
          </div>
        </div>
      )
    },
    { key: 'subject', header: 'Subject', render: (row) => <div className="font-medium text-dark-brown-800">{row.subject}</div> },
    { key: 'message', header: 'Message Snippet', render: (row) => <div className="text-sm text-dark-brown-600 max-w-[250px] truncate" title={row.message}>{row.message}</div> },
    { key: 'createdAt', header: 'Date', render: (row) => <span className="text-xs text-dark-brown-500">{new Date(row.createdAt).toLocaleDateString()}</span> },
    { key: 'actions', header: 'Actions', render: (row) => (
      <div className="flex gap-3">
        <button onClick={() => setViewItem(row)} className="text-dark-brown-400 hover:text-temple-gold-600 transition-colors" title="View"><Eye className="h-4 w-4" /></button>
        <button className="text-dark-brown-400 hover:text-temple-gold-600 transition-colors" title="Reply"><Reply className="h-4 w-4" /></button>
        <button onClick={() => setDeleteItem(row)} className="text-dark-brown-400 hover:text-saffron-700 transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
      </div>
    ) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-heading font-bold text-dark-brown-900">Contact Us Inquiries</h1>
      </div>

      <div className="bg-white rounded-2xl border border-dark-brown-100 shadow-[0_4px_20px_rgba(58,43,37,0.04)] transition-all duration-300 overflow-hidden">
        <div className="p-4 border-b border-dark-brown-100 flex flex-col sm:flex-row flex-wrap gap-4">
          <input 
            type="text" 
            placeholder="Search inquiries..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] border border-dark-brown-200 rounded-md px-3 py-2 text-sm text-dark-brown-900 placeholder-dark-brown-400 focus:outline-none focus:ring-1 focus:ring-temple-gold-500 focus:border-temple-gold-500" 
          />
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center text-dark-brown-500">Loading inquiries...</div>
        ) : (
          <DataTable columns={columns} data={filtered} keyExtractor={(item) => item.contactid} />
        )}
      </div>

      {/* View Drawer */}
      {viewItem && (
        <>
          <div className="fixed inset-0 z-40 bg-dark-brown-900/30 backdrop-blur-sm" onClick={() => setViewItem(null)} />
          <div className="fixed top-0 right-0 h-full z-50 w-96 bg-white border-l border-dark-brown-100 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-dark-brown-100">
              <span className="text-sm font-semibold text-dark-brown-800">Inquiry Detail</span>
              <button onClick={() => setViewItem(null)} className="p-1.5 rounded-lg text-dark-brown-400 hover:bg-dark-brown-50 hover:text-dark-brown-700 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-saffron-400 to-temple-gold-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {viewItem.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-base font-heading font-bold text-dark-brown-900">{viewItem.name}</h2>
                  <p className="text-xs text-dark-brown-400">{viewItem.email}</p>
                </div>
              </div>
              <div className="rounded-xl border border-dark-brown-100 overflow-hidden divide-y divide-dark-brown-50">
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-dark-brown-400">Date</span>
                  <span className="text-xs text-dark-brown-700">{new Date(viewItem.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-dark-brown-400">Phone</span>
                  <span className="text-xs text-dark-brown-700">{viewItem.phone || "-"}</span>
                </div>
              </div>
              <div className="rounded-xl border border-dark-brown-100 p-4 space-y-2">
                <p className="text-xs font-semibold text-dark-brown-700">{viewItem.subject}</p>
                <p className="text-sm text-dark-brown-600 leading-relaxed whitespace-pre-wrap">{viewItem.message}</p>
              </div>
              <a href={`mailto:${viewItem.email}?subject=Re: ${viewItem.subject}`} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-saffron-600 to-temple-gold-500 text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity">
                <Reply className="h-4 w-4" /> Reply via Email
              </a>
            </div>
          </div>
        </>
      )}

      {/* Delete Dialog */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-brown-900/40 backdrop-blur-sm" onClick={() => setDeleteItem(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-dark-brown-100">
            <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-saffron-50 border border-saffron-100 mx-auto mb-4">
              <AlertTriangle className="h-7 w-7 text-saffron-600" />
            </div>
            <h3 className="text-base font-heading font-bold text-dark-brown-900 text-center">Delete Inquiry?</h3>
            <p className="text-sm text-dark-brown-500 text-center mt-2 leading-relaxed">
              Are you sure you want to delete the inquiry from <span className="font-semibold text-dark-brown-800">"{deleteItem.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setDeleteItem(null)} className="flex-1 py-2.5 rounded-xl border border-dark-brown-200 text-dark-brown-700 text-sm font-medium hover:bg-dark-brown-50 transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-saffron-600 to-saffron-700 text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
