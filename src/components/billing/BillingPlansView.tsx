import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Phone,
  Sparkles,
  Smartphone,
  ShieldCheck,
  Zap,
  ArrowRight,
  X,
} from 'lucide-react';
import { BusinessTenant } from '../../types';
import { formatKsh } from '../../services/api';

interface BillingPlansViewProps {
  tenant: BusinessTenant;
  onUpgradePlan: (plan: BusinessTenant['plan']) => void;
}

export const BillingPlansView: React.FC<BillingPlansViewProps> = ({
  tenant,
  onUpgradePlan,
}) => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<{
    name: BusinessTenant['plan'];
    price: number;
  } | null>(null);

  // M-Pesa STK push simulation state
  const [mpesaPhone, setMpesaPhone] = useState(tenant.phone || '+254 7');
  const [stkStatus, setStkStatus] = useState<'idle' | 'prompting' | 'success'>('idle');

  const plans: {
    name: BusinessTenant['plan'];
    monthlyPrice: number;
    annualPrice: number;
    description: string;
    features: string[];
    recommended?: boolean;
  }[] = [
    {
      name: 'Starter',
      monthlyPrice: 499,
      annualPrice: 4790,
      description: 'Basic finance tracking, sales, expenses, and mobile dashboard for growing shops.',
      features: [
        'Unlimited sales & expense logging',
        'Mobile-first responsive access',
        'Cash flow balance warnings',
        'Standard export to Excel / CSV',
        'WhatsApp direct customer chat',
      ],
    },
    {
      name: 'Business',
      monthlyPrice: 999,
      annualPrice: 9590,
      description: 'Everything in Starter + invoices, customers, inventory, and KRA compliance.',
      recommended: true,
      features: [
        'Everything in Starter',
        'eTIMS 16% VAT Tax Invoices with PDF/WhatsApp',
        'Real-time Inventory & Low-Stock Alerts',
        'Customer CRM & Deni Book ledger',
        'WhatsApp CRM with all 8 business templates',
        'KRA eTIMS compliance calendar',
        'My Business Score & diagnostic analysis',
      ],
    },
    {
      name: 'Professional',
      monthlyPrice: 1999,
      annualPrice: 19190,
      description: 'Everything in Business + advanced analytics, multi-user, and full AI Agents Suite.',
      features: [
        'Everything in Business',
        'Advanced Analytics & P&L Profit Trends',
        'Full AI Agents Suite (Biashara, Finance, Marketing, Compliance)',
        'AI Marketing Generator (Social, WhatsApp, SMS)',
        'Multi-user staff logins with roles',
        'Dead-stock & slow-moving item reports',
        'Priority Kenyan phone & WhatsApp support',
      ],
    },
    {
      name: 'Enterprise',
      monthlyPrice: 4999,
      annualPrice: 47990,
      description: 'Multiple businesses, custom integrations, dedicated support, and advanced permissions.',
      features: [
        'Everything in Professional',
        'Multiple businesses / branches management',
        'Dedicated onboarding account manager',
        'Custom POS & bank integration APIs',
        'Role-based permissions & audit logs',
        'Tailored team training workshops',
      ],
    },
  ];

  const handleTriggerStk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanForCheckout) return;

    setStkStatus('prompting');
    // Simulate Safaricom STK push delay
    setTimeout(() => {
      setStkStatus('success');
      setTimeout(() => {
        onUpgradePlan(selectedPlanForCheckout.name);
        setSelectedPlanForCheckout(null);
        setStkStatus('idle');
      }, 1500);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header & Plan Status (§28, §32) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#0F7A4C]" /> Subscription & Lipa Na M-Pesa Billing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Transparent pricing in Kenyan Shillings with instant automated M-Pesa STK checkout.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
            Current: {tenant.plan} Plan ({tenant.trialDaysLeft} Days Left in Trial)
          </span>
        </div>
      </div>

      {/* Annual / Monthly Toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className={`text-xs font-bold ${!isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
          Monthly Billing
        </span>
        <button
          onClick={() => setIsAnnual(!isAnnual)}
          className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
            isAnnual ? 'bg-[#0F7A4C]' : 'bg-slate-300'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform ${
              isAnnual ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
        <span className={`text-xs font-bold flex items-center gap-1.5 ${isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
          <span>Annual Billing</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
            Save 20%
          </span>
        </span>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {plans.map((p) => {
          const isCurrent = tenant.plan === p.name;
          const price = isAnnual ? p.annualPrice : p.monthlyPrice;

          return (
            <div
              key={p.name}
              className={`bg-white rounded-2xl border p-6 flex flex-col justify-between space-y-6 relative transition-all ${
                p.recommended
                  ? 'border-[#0F7A4C] shadow-lg ring-2 ring-[#0F7A4C]/20'
                  : 'border-slate-200 shadow-sm'
              }`}
            >
              {p.recommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black bg-[#F5B400] text-slate-950 uppercase tracking-wider shadow">
                  Most Popular for Kenyan SMEs
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">{p.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 min-h-[36px]">{p.description}</p>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">{formatKsh(price)}</span>
                    <span className="text-xs text-slate-500 font-semibold">
                      /{isAnnual ? 'year' : 'month'}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium">Billed via M-Pesa</span>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                  {p.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#0F7A4C] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedPlanForCheckout({ name: p.name, price })}
                className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm ${
                  isCurrent
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : p.recommended
                    ? 'bg-[#0F7A4C] hover:bg-[#0b5e3a] text-white'
                    : 'bg-[#0B2440] hover:bg-[#071728] text-white'
                }`}
              >
                {isCurrent ? 'Current Plan (Extend)' : `Choose ${p.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* M-Pesa Automated Checkout Modal (§32) */}
      {selectedPlanForCheckout && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Safaricom Green Top */}
            <div className="bg-[#0F7A4C] text-white p-6 text-center space-y-1 relative">
              <button
                onClick={() => {
                  setSelectedPlanForCheckout(null);
                  setStkStatus('idle');
                }}
                className="absolute top-4 right-4 p-1.5 text-emerald-100 hover:text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <Smartphone className="w-10 h-10 text-[#F5B400] mx-auto mb-2" />
              <h3 className="text-lg font-bold">Lipa Na M-Pesa STK Push</h3>
              <p className="text-xs text-emerald-100">
                Automated subscription payment for {selectedPlanForCheckout.name} Plan
              </p>
            </div>

            <div className="p-6 space-y-5">
              {stkStatus === 'idle' && (
                <form onSubmit={handleTriggerStk} className="space-y-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Plan:</span>
                      <span className="font-bold text-slate-800">{selectedPlanForCheckout.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Amount:</span>
                      <span className="font-black text-[#0F7A4C] text-sm">
                        {formatKsh(selectedPlanForCheckout.price)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Safaricom M-Pesa Phone Number *
                    </label>
                    <input
                      type="text"
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      placeholder="+254 7XX XXX XXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-[#0F7A4C] outline-none"
                      required
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      A prompt will appear directly on your phone requesting your M-Pesa PIN.
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-bold text-sm text-slate-950 bg-[#F5B400] hover:bg-[#d99f00] shadow transition-transform transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <span>Send M-Pesa Prompt</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {stkStatus === 'prompting' && (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 border-4 border-[#0F7A4C] border-t-transparent rounded-full animate-spin mx-auto" />
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Check Your Phone Now</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      M-Pesa STK Prompt sent to <strong>{mpesaPhone}</strong>. Enter your PIN to authorize payment.
                    </p>
                  </div>
                </div>
              )}

              {stkStatus === 'success' && (
                <div className="py-8 text-center space-y-3">
                  <div className="w-14 h-14 bg-[#E8F7EF] text-[#0F7A4C] rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Payment Confirmed! 🇰🇪</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Your business subscription has been updated to <strong>{selectedPlanForCheckout.name}</strong>.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
