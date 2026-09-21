import React, { useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Info,
  TrendingUp,
  ShieldCheck,
  Users,
  Package,
} from 'lucide-react';
import { AppView } from '../layout/AppSidebar';

interface BusinessScoreViewProps {
  score: number;
  onNavigate: (view: AppView) => void;
  onUpdateScore: (newScore: number) => void;
}

export const BusinessScoreView: React.FC<BusinessScoreViewProps> = ({
  score,
  onNavigate,
  onUpdateScore,
}) => {
  // 5 Assessment Dimensions (§21)
  const [financeAnswer, setFinanceAnswer] = useState(4); // 1 to 5
  const [customerAnswer, setCustomerAnswer] = useState(4);
  const [opsAnswer, setOpsAnswer] = useState(3);
  const [mktgAnswer, setMktgAnswer] = useState(3);
  const [legalAnswer, setLegalAnswer] = useState(4);

  const calculateDynamicScore = () => {
    const raw = (financeAnswer + customerAnswer + opsAnswer + mktgAnswer + legalAnswer) * 4;
    return Math.min(100, Math.max(30, raw));
  };

  const currentScore = calculateDynamicScore();

  return (
    <div className="space-y-6">
      {/* Header (§21) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#0F7A4C]" /> My Business Score & Growth Diagnostics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Self-assessment framework to pinpoint operational weaknesses, cash leakages, and revenue upside.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-bold text-slate-400 uppercase">Composite Index</span>
            <div className="text-2xl font-black text-[#0F7A4C]">{currentScore} / 100</div>
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimer (§21) */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="block mb-0.5">Mandatory Regulatory Notice:</strong>
          <p className="leading-relaxed">
            "This score is an internal business-management indicator based on the information you provide. It is not a bank credit rating or financial assessment."
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive 5-Pillar Questionnaire */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Pillar Assessment Checklist
          </h3>

          {/* 1. Financial Health */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900">1. Financial Discipline & Separation</span>
              <span className="text-slate-500 font-medium">Level {financeAnswer} of 5</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Do you keep your personal money completely separate from the business M-Pesa till and bank account?
            </p>
            <input
              type="range"
              min="1"
              max="5"
              value={financeAnswer}
              onChange={(e) => setFinanceAnswer(parseInt(e.target.value))}
              className="w-full accent-[#0F7A4C]"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Mixed accounts (Weak)</span>
              <span>Strict bookkeeping (Strong)</span>
            </div>
          </div>

          {/* 2. Customer Retention */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900">2. Customer Retention & WhatsApp Follow-ups</span>
              <span className="text-slate-500 font-medium">Level {customerAnswer} of 5</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Do you log customer contacts and follow up periodically with restock notices or promotions?
            </p>
            <input
              type="range"
              min="1"
              max="5"
              value={customerAnswer}
              onChange={(e) => setCustomerAnswer(parseInt(e.target.value))}
              className="w-full accent-[#0F7A4C]"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>No contact saved</span>
              <span>Active WhatsApp CRM</span>
            </div>
          </div>

          {/* 3. Operations & Inventory */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900">3. Stock Control & Supplier Credit</span>
              <span className="text-slate-500 font-medium">Level {opsAnswer} of 5</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Do you know your exact stock value and receive low-inventory alerts before items run out?
            </p>
            <input
              type="range"
              min="1"
              max="5"
              value={opsAnswer}
              onChange={(e) => setOpsAnswer(parseInt(e.target.value))}
              className="w-full accent-[#0F7A4C]"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Frequent stockouts</span>
              <span>Real-time digital catalog</span>
            </div>
          </div>

          {/* 4. Marketing */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900">4. Marketing & Digital Presence</span>
              <span className="text-slate-500 font-medium">Level {mktgAnswer} of 5</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Do you run weekly social promotions, Google Maps local listing, or targeted discounts?
            </p>
            <input
              type="range"
              min="1"
              max="5"
              value={mktgAnswer}
              onChange={(e) => setMktgAnswer(parseInt(e.target.value))}
              className="w-full accent-[#0F7A4C]"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Only walk-ins</span>
              <span>Consistent omni-channel</span>
            </div>
          </div>

          {/* 5. Legal & Compliance */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900">5. KRA & County Statutory Compliance</span>
              <span className="text-slate-500 font-medium">Level {legalAnswer} of 5</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Are your single business permit, eTIMS VAT invoices, and statutory employee returns up-to-date?
            </p>
            <input
              type="range"
              min="1"
              max="5"
              value={legalAnswer}
              onChange={(e) => setLegalAnswer(parseInt(e.target.value))}
              className="w-full accent-[#0F7A4C]"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Pending penalties</span>
              <span>100% compliant & eTIMS active</span>
            </div>
          </div>
        </div>

        {/* Right Column: Tailored Recommendations (§21) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#F5B400]" />
              <h3 className="text-base font-bold text-slate-900">Actionable Growth Next-Steps</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>Accelerate Deni Collection</span>
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded">High Priority</span>
                </div>
                <p className="text-slate-600">
                  Automate polite WhatsApp reminders with direct Lipa Na M-Pesa Buy Goods details to reclaim cash stuck in debtor accounts.
                </p>
                <button
                  onClick={() => onNavigate('whatsapp')}
                  className="text-xs font-bold text-[#0F7A4C] hover:underline flex items-center gap-1"
                >
                  Open WhatsApp CRM →
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>Establish Reorder Safeguards</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Medium Priority</span>
                </div>
                <p className="text-slate-600">
                  Set safety threshold alert levels on fast-moving wholesale items to avoid turning away walk-in customers.
                </p>
                <button
                  onClick={() => onNavigate('inventory')}
                  className="text-xs font-bold text-[#0F7A4C] hover:underline flex items-center gap-1"
                >
                  Manage Stock Reorders →
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>Verify eTIMS Sync Status</span>
                  <span className="text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded">Compliance</span>
                </div>
                <p className="text-slate-600">
                  Confirm all monthly invoice items include valid 16% VAT details to ensure supplier expense deductibility.
                </p>
                <button
                  onClick={() => onNavigate('compliance')}
                  className="text-xs font-bold text-[#0F7A4C] hover:underline flex items-center gap-1"
                >
                  View Compliance Calendar →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
