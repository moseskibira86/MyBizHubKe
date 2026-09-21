import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  MessageSquare,
  Phone,
  Calendar,
  AlertCircle,
  Tag,
  DollarSign,
  X,
  Sparkles,
} from 'lucide-react';
import { Customer } from '../../types';
import { formatKsh, openWhatsAppChat } from '../../services/api';

interface CustomersViewProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
  onUpdateCustomer: (customer: Customer) => void;
  businessName: string;
  tillNumber: string;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  onAddCustomer,
  onUpdateCustomer,
  businessName,
  tillNumber,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState<string>('All');
  const [modalOpen, setModalOpen] = useState(false);

  // New customer state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+254 7');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [outstandingDeni, setOutstandingDeni] = useState('0');
  const [tag, setTag] = useState<'VIP' | 'Regular' | 'Occasional' | 'Deni'>('Regular');

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.notes && c.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const customerTags = c.tags || [c.tag || 'Regular'];
    const matchesTag = tagFilter === 'All' || customerTags.includes(tagFilter as any);
    return matchesSearch && matchesTag;
  });

  const totalDeniBook = customers.reduce((acc, c) => acc + (c.outstandingDeni || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name,
      phone,
      email: email || undefined,
      notes: notes || undefined,
      location: 'Nairobi',
      tag: tag === 'VIP' ? 'VIP' : 'Repeat Customer',
      tags: [tag],
      totalSpent: 0,
      totalOrders: 0,
      totalPurchases: 0,
      lastPurchaseDate: new Date().toISOString().split('T')[0],
      outstandingDeni: parseFloat(outstandingDeni) || 0,
    };

    onAddCustomer(newCustomer);
    setName('');
    setPhone('+254 7');
    setEmail('');
    setNotes('');
    setOutstandingDeni('0');
    setModalOpen(false);
  };

  const handleQuickWhatsApp = (c: Customer) => {
    let msg = `Habari ${c.name}! Asante sana for supporting ${businessName}. We appreciate your business and hope to serve you again soon!`;
    if (c.outstandingDeni && c.outstandingDeni > 0) {
      msg = `Habari ${c.name}. Friendly reminder from ${businessName} regarding your pending balance of ${formatKsh(c.outstandingDeni)}. Kindly settle via our M-Pesa Till: ${tillNumber}. Asante sana!`;
    }
    openWhatsAppChat(c.phone, msg);
  };

  return (
    <div className="space-y-6">
      {/* Header & Debtor Alert (§16) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-[#0F7A4C]" /> Customer CRM & "Deni" Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your client directory, purchase histories, VIP tiers, and credit balances.
          </p>
        </div>

        <button
          id="add-customer-btn"
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0F7A4C] hover:bg-[#0b5e3a] flex items-center gap-1.5 shadow transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New Customer
        </button>
      </div>

      {/* Deni Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Total Customer Count</span>
          <div className="text-xl font-extrabold text-slate-900 mt-1">
            {customers.length.toLocaleString()} clients
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Active contact database</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Outstanding "Deni" (Credit Book)</span>
          <div className="text-xl font-extrabold text-amber-700 mt-1">
            {formatKsh(totalDeniBook)}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            {customers.filter((c) => (c.outstandingDeni || 0) > 0).length} customer(s) with pending balance
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">VIP Loyalty Tier</span>
          <div className="text-xl font-extrabold text-[#0F7A4C] mt-1">
            {customers.filter((c) => (c.tags || [c.tag]).includes('VIP')).length} High-value VIPs
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Responsible for 65% of repeat sales</span>
        </div>
      </div>

      {/* Search & Tag Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, phone or notes..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F7A4C] outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs">
          {(['All', 'VIP', 'Regular', 'Deni', 'Occasional'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTagFilter(t)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                tagFilter === t
                  ? 'bg-[#0F7A4C] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Phone / WhatsApp</th>
                  <th className="py-3 px-4">Tag</th>
                  <th className="py-3 px-4">Total Purchases</th>
                  <th className="py-3 px-4 text-right">Deni (Owed)</th>
                  <th className="py-3 px-4">Last Visit</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{cust.name}</div>
                      {cust.notes && <div className="text-[11px] text-slate-400 truncate max-w-xs">{cust.notes}</div>}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">{cust.phone}</td>
                    <td className="py-3 px-4">
                      {(cust.tags || [cust.tag || 'Regular']).map((t: string) => (
                        <span
                          key={t}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            t === 'VIP'
                              ? 'bg-amber-100 text-amber-900'
                              : t === 'Deni'
                              ? 'bg-rose-100 text-rose-900 font-extrabold'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {formatKsh(cust.totalPurchases ?? cust.totalSpent ?? 0)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {cust.outstandingDeni && cust.outstandingDeni > 0 ? (
                        <span className="font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                          {formatKsh(cust.outstandingDeni)}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal">KSh 0</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{cust.lastPurchaseDate}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleQuickWhatsApp(cust)}
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors inline-flex items-center gap-1 font-bold text-[11px]"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No Customers Matched</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add your frequent clients to track contact information and send WhatsApp updates.
            </p>
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0B2440] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Add New Customer</h3>
                <p className="text-xs text-slate-400">Save to your business address book</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Samuel Mutua"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone (WhatsApp) *</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254 7XX XXX XXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="samuel@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Tag</label>
                  <select
                    value={tag}
                    onChange={(e) => setTag(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none bg-white font-medium"
                  >
                    <option value="Regular">Regular</option>
                    <option value="VIP">VIP Client</option>
                    <option value="Occasional">Occasional</option>
                    <option value="Deni">Deni / Debtor</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pending Deni (KSh)</label>
                  <input
                    type="number"
                    value={outstandingDeni}
                    onChange={(e) => setOutstandingDeni(e.target.value)}
                    placeholder="0"
                    min="0"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Prefers Crown Paints, pays on 5th of every month..."
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F7A4C] outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#0F7A4C] hover:bg-[#0b5e3a] shadow"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
