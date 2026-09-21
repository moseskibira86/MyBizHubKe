import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  DollarSign,
  TrendingUp,
  Receipt,
  FileCheck,
  PieChart,
  Bot,
  Sparkles,
  Send,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Sale, Expense, Invoice } from '../../types';
import { formatKsh, exportToCsv, askGeminiAdvisor } from '../../services/api';

interface AnalyticsReportsViewProps {
  sales: Sale[];
  expenses: Expense[];
  invoices: Invoice[];
  businessName: string;
}

export const AnalyticsReportsView: React.FC<AnalyticsReportsViewProps> = ({
  sales,
  expenses,
  invoices,
  businessName,
}) => {
  const [reportPeriod, setReportPeriod] = useState<'this-month' | 'last-quarter' | 'year-to-date'>('this-month');

  // Financial Insights Agent State (§25)
  const [financeQuestion, setFinanceQuestion] = useState('');
  const [financeAnswer, setFinanceAnswer] = useState<string | null>(null);
  const [financeLoading, setFinanceLoading] = useState(false);

  const totalSales = sales.reduce((acc, s) => acc + s.amount, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netProfit = totalSales - totalExpenses;
  const grossMarginPct = totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(1) : '0';

  // Payment Breakdown
  const mpesaSales = sales.filter((s) => s.paymentMethod === 'M-Pesa').reduce((acc, s) => acc + s.amount, 0);
  const cashSales = sales.filter((s) => s.paymentMethod === 'Cash').reduce((acc, s) => acc + s.amount, 0);
  const bankSales = sales.filter((s) => s.paymentMethod === 'Bank Transfer').reduce((acc, s) => acc + s.amount, 0);

  // KRA eTIMS Tax Readiness (§27)
  const eTimsClaimableExpenses = expenses
    .filter((e) => e.receiptAttached)
    .reduce((acc, e) => acc + e.amount, 0);
  const nonClaimableExpenses = totalExpenses - eTimsClaimableExpenses;
  const vatCollected = invoices.reduce((acc, inv) => acc + (inv.vat ?? inv.vatAmount ?? 0), 0);

  const financePresets = [
    'Analyze my current gross profit margin and profitability',
    'What are my largest expense leaks and how do I reduce them?',
    'Is my business ready to apply for a bank or SACCO credit facility?',
    'How many days of cash buffer do I have based on current burn rate?',
  ];

  const handleAskFinance = async (queryText?: string) => {
    const q = queryText || financeQuestion;
    if (!q.trim()) return;

    setFinanceLoading(true);
    setFinanceAnswer(null);

    const context = `Business Financial Context for ${businessName}:
- Total Gross Sales: KSh ${totalSales}
- Total Operating Expenses: KSh ${totalExpenses}
- Net Operating Profit: KSh ${netProfit}
- Profit Margin: ${grossMarginPct}%
- M-Pesa Sales: KSh ${mpesaSales} (${totalSales > 0 ? Math.round((mpesaSales / totalSales) * 100) : 0}%)
- Cash Sales: KSh ${cashSales}
- eTIMS Claimable Expenses: KSh ${eTimsClaimableExpenses}
- Unreceipted Overheads: KSh ${nonClaimableExpenses}
- Outgoing 16% VAT Collected: KSh ${vatCollected}
${netProfit < 0 ? 'WARNING: The business is currently running at a negative margin / operating loss. Focus on immediate cost-cutting and cash preservation.' : 'The business is generating positive operating income.'}`;

    try {
      const prompt = `You are the BizHubKE Financial Insights Agent, specialized in SME financial analysis, cash flow management, and loan/SACCO readiness in Kenya.
${context}

User Question: "${q}"

Provide rigorous, data-driven financial advice tailored to this Kenyan business:
1. Direct evaluation referencing their actual figures above.
2. If margin is negative or low (<15%), prioritize cost reduction, renegotiating supplier terms in Industrial Area, and tightening customer credit ("deni").
3. Assessment of working capital and M-Pesa cash velocity.
4. Actionable next step for the coming 30 days.

End with: "Disclaimer: This analysis is generated for internal management decision-making and does not constitute certified financial or accounting audit opinions."`;

      const res = await askGeminiAdvisor(prompt);
      setFinanceAnswer(res.answer);
    } catch (e) {
      setFinanceAnswer(
        `Based on your current recorded gross sales of ${formatKsh(totalSales)} and operating expenses of ${formatKsh(totalExpenses)}, your net profit stands at ${formatKsh(netProfit)} (${grossMarginPct}% margin). Maintain at least 30 to 45 days of operating expenses as a buffer in your business bank or till account.\n\nDisclaimer: This analysis is for internal management decision-making only.`
      );
    } finally {
      setFinanceLoading(false);
    }
  };

  const handleExportPL = () => {
    const rows = [
      { Metric: 'Total Gross Sales', Amount_KSh: totalSales },
      { Metric: 'Total Operating Overheads', Amount_KSh: totalExpenses },
      { Metric: 'Net Operating Profit', Amount_KSh: netProfit },
      { Metric: 'Profit Margin', Amount_KSh: `${grossMarginPct}%` },
      { Metric: 'eTIMS Claimable Expenses', Amount_KSh: eTimsClaimableExpenses },
      { Metric: 'VAT Output Liability', Amount_KSh: vatCollected },
    ];
    exportToCsv(`${businessName}_PL_Report`, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions (§27) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#0F7A4C]" /> Analytics, P&L & KRA Tax Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Audit-ready financial statements, payment channel breakdowns, and eTIMS tax deduction summaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPL}
            className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-slate-500" /> Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#0F7A4C] hover:bg-[#0b5e3a] flex items-center gap-1.5 shadow"
          >
            <Printer className="w-4 h-4" /> Print Report
          </button>
        </div>
      </div>

      {/* 1. Monthly Profit & Loss Statement (§27) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Profit & Loss Statement (P&L)</h3>
            <p className="text-xs text-slate-500">For {businessName} • Current Accounting Cycle</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900">
            Net Margin: {grossMarginPct}%
          </span>
        </div>

        <div className="space-y-3 text-xs sm:text-sm">
          {/* Revenue */}
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="font-bold text-slate-900">Total Operating Revenue (Sales)</span>
            <span className="font-extrabold text-[#0F7A4C]">{formatKsh(totalSales)}</span>
          </div>

          {/* Operating Overheads */}
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="font-bold text-slate-900">Total Operating Expenses</span>
            <span className="font-extrabold text-rose-600">-{formatKsh(totalExpenses)}</span>
          </div>

          {/* Net Profit Summary */}
          <div className="flex justify-between items-center py-3 bg-slate-50 px-4 rounded-xl text-sm sm:text-base">
            <span className="font-black text-slate-900">Net Business Profit</span>
            <span className="font-black text-[#0F7A4C]">{formatKsh(netProfit)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2. Sales by Payment Channel (§27) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#0F7A4C]" /> Revenue by Payment Method
          </h3>

          <div className="space-y-3 text-xs">
            {/* M-Pesa */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-700">
                <span className="font-semibold">Lipa Na M-Pesa (Buy Goods & Paybill)</span>
                <span className="font-bold">{formatKsh(mpesaSales)}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#0F7A4C] h-full"
                  style={{ width: `${totalSales > 0 ? (mpesaSales / totalSales) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Cash */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-700">
                <span className="font-semibold">Counter Cash</span>
                <span className="font-bold">{formatKsh(cashSales)}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full"
                  style={{ width: `${totalSales > 0 ? (cashSales / totalSales) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Bank */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-700">
                <span className="font-semibold">Bank Transfers (EFT / RTGS)</span>
                <span className="font-bold">{formatKsh(bankSales)}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full"
                  style={{ width: `${totalSales > 0 ? (bankSales / totalSales) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. KRA Tax Deductions & eTIMS Summary (§27) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-600" /> KRA Tax Deduction & eTIMS Position
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-600">Claimable Deductible Expenses (with receipt):</span>
              <span className="font-extrabold text-[#0F7A4C]">{formatKsh(eTimsClaimableExpenses)}</span>
            </div>

            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-600">Non-Receipted Overheads (At risk under eTIMS):</span>
              <span className="font-bold text-rose-600">{formatKsh(nonClaimableExpenses)}</span>
            </div>

            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-600">16% VAT Collected on Outgoing Invoices:</span>
              <span className="font-extrabold text-slate-900">{formatKsh(vatCollected)}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic bg-amber-50 p-2.5 rounded-xl border border-amber-200">
            Tip: Under Section 23A of the Tax Procedures Act, business expenses must be supported by an eTIMS electronic tax invoice to be deductible.
          </p>
        </div>
      </div>

      {/* Financial Insights Agent (§25) */}
      <div className="bg-gradient-to-br from-[#0B2440] to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F5B400] text-slate-950 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white">Financial Insights Agent</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Data-Grounded
                </span>
              </div>
              <p className="text-xs text-slate-300">
                AI analysis of your real sales, expenses, and margins for bank/SACCO readiness and cash flow optimization.
              </p>
            </div>
          </div>
        </div>

        {/* Preset Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {financePresets.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                setFinanceQuestion(chip);
                handleAskFinance(chip);
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-slate-200 transition-colors text-left"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskFinance();
          }}
          className="flex gap-2 pt-2"
        >
          <input
            type="text"
            value={financeQuestion}
            onChange={(e) => setFinanceQuestion(e.target.value)}
            placeholder="e.g. If my sales drop 15% next month, how long can I cover fixed rent and wages?"
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#F5B400]"
          />
          <button
            type="submit"
            disabled={financeLoading || !financeQuestion.trim()}
            className="px-5 py-2.5 rounded-xl bg-[#F5B400] hover:bg-[#d99f00] disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 shrink-0"
          >
            {financeLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <>
                <Send className="w-4 h-4" /> Analyze Finances
              </>
            )}
          </button>
        </form>

        {/* AI Answer Display */}
        {financeAnswer && (
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-slate-200 space-y-2 whitespace-pre-line animate-fadeIn">
            <div className="flex items-center gap-1.5 text-[#F5B400] font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Financial Insights Assessment:
            </div>
            <div className="leading-relaxed text-slate-200">{financeAnswer}</div>
          </div>
        )}
      </div>
    </div>
  );
};
