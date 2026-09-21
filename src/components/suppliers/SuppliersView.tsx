import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  Phone,
  Mail,
  DollarSign,
  CheckCircle2,
  X,
  CreditCard,
  Building2,
} from 'lucide-react';
import { Supplier } from '../../types';
import { formatKsh, openWhatsAppChat } from '../../services/api';

interface SuppliersViewProps {
  suppliers: Supplier[];
  onAddSupplier: (supplier: Supplier) => void;
  onRecordPayment: (id: string, amount: number) => void;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({
  suppliers,
  onAddSupplier,
  onRecordPayment,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [payModalSupplier, setPayModalSupplier] = useState<Supplier | null>(null);
  const [payAmount, setPayAmount] = useState('');

  // New Supplier Form
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('+254 7');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Hardware / Construction');
  const [creditTerms, setCreditTerms] = useState('Net 30');
  const [balanceOwed, setBalanceOwed] = useState('0');

  const filteredSuppliers = suppliers.filter((s) => {
    const contact = s.contactPerson || '';
    const cat = s.category || s.productsSupplied || '';
    return (
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalOwed = suppliers.reduce((acc, s) => acc + (s.balanceOwed ?? s.outstandingBalance ?? 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const newSupplier: Supplier = {
      id: `sup-${Date.now()}`,
      name,
      contactPerson: contactPerson || 'Account Rep',
      phone,
      email: email || '',
      category,
      creditTerms,
      balanceOwed: parseFloat(balanceOwed) || 0,
      outstandingBalance: parseFloat(balanceOwed) || 0,
      productsSupplied: category,
      totalPurchases: 0,
    };

    onAddSupplier(newSupplier);
    setName('');
    setContactPerson('');
    setPhone('+254 7');
    setEmail('');
    setBalanceOwed('0');
    setModalOpen(false);
  };

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payModalSupplier || !payAmount) return;
    onRecordPayment(payModalSupplier.id, parseFloat(payAmount) || 0);
    setPayModalSupplier(null);
    setPayAmount('');
  };

  return (
    <div className="space-y-6">
      {/* Header & New Supplier (§19) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-[#0F7A4C]" /> Supplier Directory & Accounts Payable
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage wholesale distributors, credit terms, purchase balances, and supplier settlements.
          </p>
        </div>

        <button
          id="add-supplier-btn"
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0F7A4C] hover:bg-[#0b5e3a] flex items-center gap-1.5 shadow transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New Supplier
        </button>
      </div>

      {/* Summary KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Total Suppliers</span>
          <div className="text-xl font-extrabold text-slate-900 mt-1">
            {suppliers.length} Partners
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Active trade relationships</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Outstanding Accounts Payable</span>
          <div className="text-xl font-extrabold text-amber-700 mt-1">
            {formatKsh(totalOwed)}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Credit extended under Net terms
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Credit Health</span>
          <div className="text-xl font-extrabold text-[#0F7A4C] mt-1">Good Standing</div>
          <span className="text-[11px] text-slate-400 font-medium">No accounts in legal default</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search suppliers by name or category..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F7A4C] outline-none"
          />
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map((sup) => (
          <div
            key={sup.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{sup.name}</h3>
                  <span className="text-[11px] font-medium text-slate-500">{sup.category || sup.productsSupplied || 'General Supplies'}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                  {sup.creditTerms || 'Net 30'}
                </span>
              </div>

              <div className="mt-3 space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Contact:</span>
                  <span className="font-semibold text-slate-800">{sup.contactPerson || 'Sales Desk'}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{sup.phone}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Balance Owed</span>
                <span className={`text-xs font-black ${(sup.balanceOwed ?? sup.outstandingBalance ?? 0) > 0 ? 'text-amber-700' : 'text-slate-700'}`}>
                  {formatKsh(sup.balanceOwed ?? sup.outstandingBalance ?? 0)}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openWhatsAppChat(sup.phone, `Habari ${sup.contactPerson || 'Team'}, inquiring on delivery status from ${sup.name}.`)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  WhatsApp
                </button>
                <button
                  onClick={() => {
                    setPayModalSupplier(sup);
                    setPayAmount(String(sup.balanceOwed ?? sup.outstandingBalance ?? 0));
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#0F7A4C] hover:bg-[#0b5e3a]"
                >
                  Pay Supplier
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pay Supplier Modal */}
      {payModalSupplier && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Record Payment to {payModalSupplier.name}
            </h3>
            <p className="text-xs text-slate-500">
              Current balance owed: <strong className="text-amber-800">{formatKsh(payModalSupplier.balanceOwed ?? payModalSupplier.outstandingBalance ?? 0)}</strong>
            </p>

            <form onSubmit={handleExecutePayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Amount (KSh)</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  min="1"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-[#0F7A4C] outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPayModalSupplier(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0F7A4C] hover:bg-[#0b5e3a]"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0B2440] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Add New Supplier</h3>
                <p className="text-xs text-slate-400">Save distributor details and credit terms</p>
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
                <label className="block font-semibold text-slate-700 mb-1">Company / Supplier Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mabati Rolling Mills"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. David Mutiso"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone *</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Steel & Iron"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Credit Terms</label>
                  <select
                    value={creditTerms}
                    onChange={(e) => setCreditTerms(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none bg-white"
                  >
                    <option value="Cash on Delivery">Cash on Delivery</option>
                    <option value="Net 7">Net 7 Days</option>
                    <option value="Net 14">Net 14 Days</option>
                    <option value="Net 30">Net 30 Days</option>
                    <option value="Net 60">Net 60 Days</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Starting Balance Owed (KSh)</label>
                <input
                  type="number"
                  value={balanceOwed}
                  onChange={(e) => setBalanceOwed(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none"
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
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
