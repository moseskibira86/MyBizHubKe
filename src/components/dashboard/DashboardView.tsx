import React, { useState } from 'react';
import {
  TrendingUp,
  Receipt,
  FileText,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  BarChart3,
  ShieldCheck,
  Plus,
  MessageSquare,
} from 'lucide-react';
import {
  BusinessTenant,
  Sale,
  Expense,
  Invoice,
  Customer,
  Product,
  ComplianceTask,
} from '../../types';
import { formatKsh } from '../../services/api';
import { AppView } from '../layout/AppSidebar';

interface DashboardViewProps {
  tenant: BusinessTenant;
  sales: Sale[];
  expenses: Expense[];
  invoices: Invoice[];
  customers: Customer[];
  products: Product[];
  complianceTasks: ComplianceTask[];
  onNavigate: (view: AppView) => void;
  onOpenQuickSale: () => void;
  onOpenQuickExpense: () => void;
  onOpenQuickInvoice: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tenant,
  sales,
  expenses,
  invoices,
  customers,
  products,
  complianceTasks,
  onNavigate,
  onOpenQuickSale,
  onOpenQuickExpense,
  onOpenQuickInvoice,
}) => {
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days' | '3months' | '12months'>('30days');

  // KPI Calculations based on real tenant data (§10)
  const totalSalesAmount = sales.reduce((acc, s) => acc + s.amount, 0) || (tenant.isDemo ? 482500 : 0);
  const totalExpensesAmount = expenses.reduce((acc, e) => acc + e.amount, 0) || (tenant.isDemo ? 354070 : 0);
  const netProfit = totalSalesAmount - totalExpensesAmount;
  const profitMargin = totalSalesAmount > 0 ? ((netProfit / totalSalesAmount) * 100).toFixed(1) : '0';

  const outstandingInvoicesAmount = invoices
    .filter((inv) => inv.status === 'Unpaid' || inv.status === 'Overdue')
    .reduce((acc, inv) => acc + inv.total, 0) || (tenant.isDemo ? 74000 : 0);

  const customerCount = customers.length || (tenant.isDemo ? 1284 : 0);
  const inventoryValue = products.reduce((acc, p) => acc + p.purchasePrice * p.quantity, 0) || (tenant.isDemo ? 860000 : 0);

  const lowStockCount = products.filter((p) => p.quantity <= p.minStockLevel).length;

  // Cash flow metrics (§14)
  const openingBalance = 150000;
  const cashReceived = totalSalesAmount;
  const cashSpent = totalExpensesAmount;
  const closingBalance = openingBalance + cashReceived - cashSpent;
  const lowBalanceThreshold = 80000;
  const isProjectedLowBalance = closingBalance < lowBalanceThreshold;

  return (
    <div className="space-y-6">
      {/* Top Banner & Date Filter (§10) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Habari, {tenant.ownerName}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Here is your financial and operational pulse for <strong className="text-slate-800">{tenant.name}</strong>.
          </p>
        </div>

        {/* Date-range Selector (§10) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-auto text-xs font-semibold">
          {[
            { id: 'today', label: 'Today' },
            { id: '7days', label: '7 Days' },
            { id: '30days', label: '30 Days' },
            { id: '3months', label: '3 Months' },
            { id: '12months', label: '12 Months' },
          ].map((range) => (
            <button
              key={range.id}
              onClick={() => setDateRange(range.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                dateRange === range.id
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cash Flow Warning (§14) if projected cash falls below threshold */}
      {isProjectedLowBalance && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs sm:text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">Working Capital Advisory:</span> Your projected cash balance ({formatKsh(closingBalance)}) is nearing your threshold ({formatKsh(lowBalanceThreshold)}). Consider accelerating invoice collections for overdue accounts.
          </div>
          <button
            onClick={() => onNavigate('invoices')}
            className="text-xs font-bold text-amber-800 hover:underline shrink-0"
          >
            Review Invoices →
          </button>
        </div>
      )}

      {/* 6 Core KPIs Cards (§10, §43) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Sales */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Sales</span>
            <TrendingUp className="w-4 h-4 text-[#0F7A4C]" />
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            {formatKsh(totalSalesAmount)}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2%</span>
            <span className="text-slate-400 font-normal">vs last mo</span>
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Expenses</span>
            <Receipt className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            {formatKsh(totalExpensesAmount)}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+8.1%</span>
            <span className="text-slate-400 font-normal">vs last mo</span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Net Profit</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
              {profitMargin}%
            </span>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-[#0F7A4C] tracking-tight">
            {formatKsh(netProfit)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {netProfit >= 0 ? 'Healthy Operating Margin' : 'Negative Margin'}
          </div>
        </div>

        {/* Outstanding Invoices */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Unpaid Invoices</span>
            <FileText className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-amber-700 tracking-tight">
            {formatKsh(outstandingInvoicesAmount)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {invoices.filter((i) => i.status === 'Overdue').length} overdue account(s)
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Customers</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            {customerCount.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18 new</span>
            <span className="text-slate-400 font-normal">this month</span>
          </div>
        </div>

        {/* Inventory Value */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Inventory Value</span>
            <Package className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            {formatKsh(inventoryValue)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {lowStockCount > 0 ? (
              <span className="text-rose-600 font-bold">{lowStockCount} items low stock</span>
            ) : (
              'All stock healthy'
            )}
          </div>
        </div>
      </div>

      {/* Main Row: My Business Score (§11) & Cash Flow Summary (§14) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: My Business Score (§11) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#E8F7EF] text-[#0F7A4C] flex items-center justify-center font-bold">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">My Business Score</h3>
                <p className="text-xs text-slate-500">Internal performance & management indicator</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-[#0F7A4C]">{tenant.score}</span>
              <span className="text-xs text-slate-400"> / 100</span>
            </div>
          </div>

          {/* Sub-scores breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-500 block">Finance</span>
              <span className="font-bold text-slate-800">78%</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-500 block">Customers</span>
              <span className="font-bold text-slate-800">75%</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-500 block">Operations</span>
              <span className="font-bold text-slate-800">68%</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-500 block">Marketing</span>
              <span className="font-bold text-amber-600">62%</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-500 block">Compliance</span>
              <span className="font-bold text-[#0F7A4C]">80%</span>
            </div>
          </div>

          {/* Biggest Opportunity Callout (§11) */}
          <div className="p-4 rounded-xl bg-[#FDF1E4] border border-[#F5B400]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-800">
              <strong className="text-amber-900 block mb-0.5">🌟 Biggest Opportunity for Growth:</strong>
              Customer retention has softened: 18% of your previous buyers have not purchased in over 60 days.
            </div>
            <button
              onClick={() => onNavigate('score')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-[#F5B400] hover:bg-[#d99f00] transition-colors shrink-0 shadow-sm"
            >
              See Recommendations
            </button>
          </div>

          {/* Mandatory Business Score Disclaimer (§11) */}
          <p className="text-[11px] text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            "This score is an internal business-management indicator based on the information you provide. It is not a bank credit rating or financial assessment."
          </p>
        </div>

        {/* Right: Cash Flow Summary (§14) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Cash Flow Position</h3>
            <span className="text-xs font-semibold text-slate-500">Working Capital</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500">Opening Balance (Bank & Till)</span>
              <span className="font-semibold text-slate-800">{formatKsh(openingBalance)}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500">Cash Received (Sales collected)</span>
              <span className="font-bold text-[#0F7A4C]">+{formatKsh(cashReceived)}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500">Cash Spent (Expenses paid)</span>
              <span className="font-bold text-rose-600">-{formatKsh(cashSpent)}</span>
            </div>
            <div className="flex justify-between items-center py-2 bg-slate-50 px-3 rounded-xl">
              <span className="font-bold text-slate-900">Net Closing Cash Balance</span>
              <span className="font-extrabold text-sm text-slate-900">{formatKsh(closingBalance)}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs">
            <span className="text-slate-500">Safety Threshold: {formatKsh(lowBalanceThreshold)}</span>
            <button
              onClick={() => onNavigate('sales')}
              className="text-[#0F7A4C] font-bold hover:underline"
            >
              View Full Cash Flow →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Sales & Compliance Tasks (§12, §20) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Sales Table (§12) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Recent Sales Records</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                {sales.length} logged
              </span>
            </div>
            <button
              onClick={onOpenQuickSale}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#0F7A4C] hover:bg-[#0b5e3a] flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Record Sale
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 uppercase font-semibold">
                  <th className="pb-2.5">Customer</th>
                  <th className="pb-2.5">Items Summary</th>
                  <th className="pb-2.5">Method</th>
                  <th className="pb-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sales.slice(0, 5).map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 font-medium text-slate-800">{s.customerName}</td>
                    <td className="py-2.5 text-slate-500 max-w-[180px] truncate">{s.itemsSummary}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {s.paymentMethod}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-bold text-slate-900">{formatKsh(s.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={() => onNavigate('sales')}
            className="w-full py-2 text-center text-xs font-bold text-[#0F7A4C] hover:underline"
          >
            View All Sales & Reports →
          </button>
        </div>

        {/* Compliance Tasks Countdown (§20) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0F7A4C]" />
              <h3 className="text-base font-bold text-slate-900">Compliance Deadlines</h3>
            </div>
            <button
              onClick={() => onNavigate('compliance')}
              className="text-xs font-bold text-[#0F7A4C] hover:underline"
            >
              Full Calendar →
            </button>
          </div>

          <div className="space-y-2.5">
            {complianceTasks.map((t) => (
              <div
                key={t.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-900">{t.title}</h4>
                  <p className="text-[11px] text-slate-500">
                    Authority: {t.authority} • Due: {t.dueDate}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`font-bold px-2 py-1 rounded text-[11px] ${
                      t.dueInDays < 20
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {t.dueInDays} days
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <p className="font-bold text-slate-700">KRA eTIMS Notice:</p>
            <p className="leading-relaxed">
              Ensure all your business purchase receipts feature a valid KRA eTIMS invoice number to claim deductible business expenses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
