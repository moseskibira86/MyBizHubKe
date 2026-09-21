import React, { useState } from 'react';
import {
  TrendingUp,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Calendar,
  DollarSign,
  Phone,
  User,
  X,
} from 'lucide-react';
import { Sale } from '../../types';
import { formatKsh, exportToCsv } from '../../services/api';

interface SalesViewProps {
  sales: Sale[];
  onAddSale: (sale: Sale) => void;
}

export const SalesView: React.FC<SalesViewProps> = ({ sales, onAddSale }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'All' | 'M-Pesa' | 'Cash' | 'Bank Transfer'>('All');
  const [modalOpen, setModalOpen] = useState(false);

  // New Sale Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [itemsSummary, setItemsSummary] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'M-Pesa' | 'Cash' | 'Bank Transfer'>('M-Pesa');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredSales = sales.filter((s) => {
    const matchesSearch =
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.itemsSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.customerPhone && s.customerPhone.includes(searchTerm));
    const matchesPayment = paymentFilter === 'All' || s.paymentMethod === paymentFilter;
    return matchesSearch && matchesPayment;
  });

  const totalFilteredAmount = filteredSales.reduce((acc, s) => acc + s.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !amount) return;

    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      customerName,
      customerPhone: customerPhone || undefined,
      itemsSummary: itemsSummary || 'General goods',
      amount: parseFloat(amount) || 0,
      paymentMethod,
      date,
      status: 'Completed',
    };

    onAddSale(newSale);
    setCustomerName('');
    setCustomerPhone('');
    setItemsSummary('');
    setAmount('');
    setModalOpen(false);
  };

  const handleExport = () => {
    const rows = filteredSales.map((s) => ({
      ID: s.id,
      Customer: s.customerName,
      Phone: s.customerPhone || 'N/A',
      Items: s.itemsSummary,
      Amount_KSh: s.amount,
      Payment_Method: s.paymentMethod,
      Date: s.date,
      Status: s.status,
    }));
    exportToCsv('BizHubKE_Sales_Export', rows);
  };

  return (
    <div className="space-y-6">
      {/* Header & Export (§12) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#0F7A4C]" /> Sales Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Record, filter, and analyze all counter sales, M-Pesa transactions, and client invoices.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExport}
            className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export CSV
          </button>
          <button
            id="add-new-sale-btn"
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0F7A4C] hover:bg-[#0b5e3a] flex items-center gap-1.5 shadow transition-colors"
          >
            <Plus className="w-4 h-4" /> Record New Sale
          </button>
        </div>
      </div>

      {/* Summary Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Filtered Sales Total</span>
          <div className="text-xl font-extrabold text-[#0F7A4C] mt-1">
            {formatKsh(totalFilteredAmount)}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            {filteredSales.length} transaction(s) shown
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">M-Pesa Collections</span>
          <div className="text-xl font-extrabold text-slate-900 mt-1">
            {formatKsh(
              filteredSales.filter((s) => s.paymentMethod === 'M-Pesa').reduce((acc, s) => acc + s.amount, 0)
            )}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Direct Till & Paybill settlements</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Average Sale Value</span>
          <div className="text-xl font-extrabold text-slate-900 mt-1">
            {filteredSales.length > 0
              ? formatKsh(Math.round(totalFilteredAmount / filteredSales.length))
              : 'KSh 0'}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Per ticket basket size</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer, items or phone..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F7A4C] outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs">
          <span className="text-slate-500 font-medium mr-1">Payment:</span>
          {(['All', 'M-Pesa', 'Cash', 'Bank Transfer'] as const).map((method) => (
            <button
              key={method}
              onClick={() => setPaymentFilter(method)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                paymentFilter === method
                  ? 'bg-[#0F7A4C] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredSales.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items / Description</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSales.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500">{s.date}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{s.customerName}</div>
                      {s.customerPhone && (
                        <div className="text-[11px] text-slate-400">{s.customerPhone}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs">{s.itemsSummary}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-50 text-[#0F7A4C] border border-emerald-200">
                        {s.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                      {formatKsh(s.amount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State (§42) */
          <div className="p-12 text-center space-y-3">
            <TrendingUp className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No Sales Records Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Record your first transaction to track revenue and update your inventory automatically.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0F7A4C] hover:bg-[#0b5e3a]"
            >
              + Record Sale
            </button>
          </div>
        )}
      </div>

      {/* Record Sale Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0B2440] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Record Customer Sale</h3>
                <p className="text-xs text-slate-400">Add transaction to your daily ledger</p>
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
                <label className="block font-semibold text-slate-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Juma Omondi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Phone (WhatsApp)</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+254 7XX XXX XXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Items Sold / Summary *</label>
                <input
                  type="text"
                  value={itemsSummary}
                  onChange={(e) => setItemsSummary(e.target.value)}
                  placeholder="e.g. Bamburi Cement 50kg (10 bags)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (KSh) *</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 7800"
                    min="1"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none bg-white font-medium"
                  >
                    <option value="M-Pesa">Lipa Na M-Pesa</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none"
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
                  Save Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
