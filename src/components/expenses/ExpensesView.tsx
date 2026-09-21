import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Download,
  Trash2,
  Paperclip,
  CheckCircle2,
  DollarSign,
  PieChart,
  X,
  UploadCloud,
} from 'lucide-react';
import { Expense, ExpenseCategory } from '../../types';
import { formatKsh, exportToCsv } from '../../services/api';

interface ExpensesViewProps {
  expenses: Expense[];
  onAddExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
}

const CATEGORIES: ExpenseCategory[] = [
  'Rent',
  'Utilities',
  'Transport',
  'Salaries',
  'Marketing',
  'Stock',
  'Equipment',
  'Bank charges',
  'Taxes',
  'Other',
];

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  expenses,
  onAddExpense,
  onDeleteExpense,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [category, setCategory] = useState<ExpenseCategory>('Stock');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [vendor, setVendor] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'M-Pesa' | 'Cash' | 'Bank Transfer'>('M-Pesa');
  const [receiptAttached, setReceiptAttached] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.vendor && e.vendor.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalExpenseAmount = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);

  // Category breakdown
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });
  const allExpensesTotal = expenses.reduce((acc, e) => acc + e.amount, 0) || 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      category,
      description,
      amount: parseFloat(amount) || 0,
      vendor: vendor || undefined,
      paymentMethod,
      receiptAttached,
      date,
    };

    onAddExpense(newExpense);
    setDescription('');
    setAmount('');
    setVendor('');
    setReceiptAttached(false);
    setModalOpen(false);
  };

  const handleExport = () => {
    const rows = filteredExpenses.map((e) => ({
      ID: e.id,
      Category: e.category,
      Description: e.description,
      Vendor: e.vendor || 'N/A',
      Amount_KSh: e.amount,
      Payment_Method: e.paymentMethod,
      Receipt_Attached: e.receiptAttached ? 'Yes' : 'No',
      Date: e.date,
    }));
    exportToCsv('BizHubKE_Expenses_Export', rows);
  };

  return (
    <div className="space-y-6">
      {/* Header & Export (§13) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-rose-600" /> Expense Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Log and categorize business overheads, supplier stock payments, utilities, and rent.
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
            id="add-new-expense-btn"
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 flex items-center gap-1.5 shadow transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Expense
          </button>
        </div>
      </div>

      {/* Category Breakdown Grid (§13) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-slate-600" /> Spending by Category Breakdown
          </h3>
          <span className="text-xs font-extrabold text-slate-900">
            Total: {formatKsh(allExpensesTotal)}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES.map((cat) => {
            const sum = categoryTotals[cat] || 0;
            const pct = Math.round((sum / allExpensesTotal) * 100);
            return (
              <div
                key={cat}
                onClick={() => setCategoryFilter(categoryFilter === cat ? 'All' : cat)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  categoryFilter === cat
                    ? 'border-rose-500 bg-rose-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 truncate">{cat}</span>
                  <span className="font-bold text-rose-600">{pct}%</span>
                </div>
                <div className="text-xs font-extrabold text-slate-900">{formatKsh(sum)}</div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search description or vendor..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <span className="text-slate-500 font-medium">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold outline-none"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expense List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredExpenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Description / Vendor</th>
                  <th className="py-3 px-4">Receipt</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500">{exp.date}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{exp.description}</div>
                      {exp.vendor && (
                        <div className="text-[11px] text-slate-500">Paid to: {exp.vendor}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {exp.receiptAttached ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Attached
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No receipt</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{exp.paymentMethod}</td>
                    <td className="py-3 px-4 text-right font-extrabold text-rose-600">
                      {formatKsh(exp.amount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onDeleteExpense(exp.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                        title="Delete expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No Expenses Recorded</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Track your outgoing payments to calculate accurate net profit and protect cash reserves.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700"
            >
              + Add Expense
            </button>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0B2440] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Add Business Expense</h3>
                <p className="text-xs text-slate-400">Keep receipts organized for KRA eTIMS deductions</p>
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
                <label className="block font-semibold text-slate-700 mb-1">Expense Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 outline-none bg-white font-medium"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description *</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Shop monthly rent or KPLC electricity"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
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
                    placeholder="e.g. 14500"
                    min="1"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 outline-none font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 outline-none bg-white font-medium"
                  >
                    <option value="M-Pesa">Lipa Na M-Pesa</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vendor / Payee</label>
                <input
                  type="text"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  placeholder="e.g. Kenya Power, Landlord, Shell Gas Station"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>

              {/* Receipt upload simulated toggle */}
              <div
                onClick={() => setReceiptAttached(!receiptAttached)}
                className={`p-3 rounded-xl border border-dashed cursor-pointer flex items-center justify-between transition-colors ${
                  receiptAttached
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : 'border-slate-300 bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <UploadCloud className="w-4 h-4" />
                  <span className="font-semibold">
                    {receiptAttached ? 'Receipt photo attached' : 'Click to attach receipt / photo'}
                  </span>
                </div>
                <span className="text-[10px] font-bold underline">
                  {receiptAttached ? 'Remove' : 'Upload'}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
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
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-700 shadow"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
