import React, { useState } from 'react';
import {
  TrendingUp,
  Receipt,
  MessageSquare,
  Package,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  Clock,
  DollarSign,
  AlertTriangle,
  FileSpreadsheet,
  Zap,
  BarChart3,
  Users,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { formatKsh } from '../../services/api';
import { FeatureDetailPage, FeatureSlug } from './FeatureDetailPage';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onOpenDemo }) => {
  const [selectedFeatureSlug, setSelectedFeatureSlug] = useState<FeatureSlug | null>(null);
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'finance' | 'crm' | 'inventory' | 'tax'>('finance');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const pricingPlans = [
    {
      name: 'Free',
      price: 0,
      period: 'forever',
      description: 'Ideal for micro-hustlers and dukas starting their digital record-keeping journey.',
      features: [
        'Basic sales & expense logging',
        'Up to 25 customers & products',
        'Daily summary report',
        'Kenyan business news access',
        'Selected BizHubKE Academy lessons',
      ],
      popular: false,
      ctaText: 'Start Free',
      planId: 'Free',
    },
    {
      name: 'Starter',
      price: 499,
      period: '/ month',
      description: 'Perfect for small retailers, salons, and sole proprietors needing clean accounts.',
      features: [
        'Everything in Free',
        'Unlimited sales & expense tracking',
        'Mobile-first responsive access',
        'Cash flow balance warnings',
        'Standard export to Excel / CSV',
        'WhatsApp direct customer chat',
      ],
      popular: false,
      ctaText: 'Start 7-Day Free Trial',
      planId: 'Starter',
    },
    {
      name: 'Business',
      price: 999,
      period: '/ month',
      description: 'Our most popular plan for hardware shops, wholesalers, boutiques & growing SMEs.',
      features: [
        'Everything in Starter',
        'Professional KRA-friendly Invoicing',
        'Real-time Inventory & Low-Stock Alerts',
        'Customer CRM & Purchase History',
        'WhatsApp Business message templates',
        'KRA eTIMS compliance calendar',
        'My Business Score & diagnostic analysis',
      ],
      popular: true,
      badge: 'Most Popular',
      ctaText: 'Start 7-Day Free Trial',
      planId: 'Business',
    },
    {
      name: 'Professional',
      price: 1999,
      period: '/ month',
      description: 'For busy contractors, multi-staff shops, and high-volume merchant traders.',
      features: [
        'Everything in Business',
        'Advanced Analytics & Profit Trends',
        'Ask BizHub AI strategic advisor',
        'AI Marketing Generator (WhatsApp/Social)',
        'Multi-user staff logins with roles',
        'Dead-stock & slow-moving item reports',
        'Priority Kenyan phone & WhatsApp support',
      ],
      popular: false,
      ctaText: 'Start 7-Day Free Trial',
      planId: 'Professional',
    },
    {
      name: 'Enterprise',
      price: 4999,
      period: '/ month',
      description: 'Custom setups for multi-branch retailers, manufacturers & distributors.',
      features: [
        'Multiple businesses / branch management',
        'Dedicated onboarding account manager',
        'Custom POS & bank integration APIs',
        'Role-based permissions & audit logs',
        'Tailored team training workshops',
      ],
      popular: false,
      ctaText: 'Contact Sales',
      planId: 'Enterprise',
    },
  ];

  if (selectedFeatureSlug) {
    return (
      <FeatureDetailPage
        slug={selectedFeatureSlug}
        onBack={() => setSelectedFeatureSlug(null)}
        onStartTrial={() => onOpenAuth('signup')}
        onOpenDemo={onOpenDemo}
      />
    );
  }

  return (
    <div className="w-full bg-white text-slate-900">
      {/* 1. HERO SECTION (§6) */}
      <section id="hero" className="relative bg-gradient-to-b from-[#0B2440] via-[#07192d] to-[#0B2440] text-white pt-12 pb-24 overflow-hidden">
        {/* Ambient subtle glow background */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0F7A4C]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#F5B400]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Kenyan Badge (§6) */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5B400]/15 text-[#F5B400] border border-[#F5B400]/30 text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#F5B400] animate-pulse"></span>
                Built for Kenyan Businesses • Built for Growth 🇰🇪
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                The Digital Business Partner for <span className="text-[#F5B400]">Kenyan SMEs</span>
              </h1>

              {/* Subheadline (§6) */}
              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Run your business. Understand your numbers. Get more customers. Stay compliant. Grow.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  id="hero-start-trial-btn"
                  onClick={() => onOpenAuth('signup')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base text-slate-950 bg-[#F5B400] hover:bg-[#d99f00] shadow-lg shadow-[#F5B400]/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  id="hero-watch-demo-btn"
                  onClick={onOpenDemo}
                  className="w-full sm:w-auto px-7 py-4 rounded-xl font-semibold text-base text-white bg-white/10 hover:bg-white/15 border border-white/20 flex items-center justify-center gap-2 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[#F5B400]" />
                  Watch Live Demo
                </button>
              </div>

              {/* Trust Subtext */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0F7A4C]" /> 7-Day Free Trial (No Card Needed)
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0F7A4C]" /> Lipa Na M-Pesa Integrated
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0F7A4C]" /> KRA eTIMS Ready
                </span>
              </div>
            </div>

            {/* Right: Interactive Graphic Mockup (§6) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Visual Dashboard Mockup Card */}
                <div className="rounded-2xl bg-slate-900/90 border border-slate-700/80 p-5 shadow-2xl backdrop-blur space-y-4">
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#0F7A4C] flex items-center justify-center text-white font-bold text-xs">
                        MN
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Mama Njeri Supplies</h4>
                        <p className="text-[10px] text-slate-400">Nairobi, Kenya • Retail & Hardware</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0F7A4C]/30 text-emerald-300 border border-[#0F7A4C]/50">
                      Active
                    </span>
                  </div>

                  {/* Quick Stat Pill Preview */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                      <span className="text-[11px] text-slate-400 block">Monthly Sales</span>
                      <span className="text-lg font-extrabold text-white">KSh 482,500</span>
                      <span className="text-[10px] text-emerald-400 block mt-0.5">↑ 14% vs last month</span>
                    </div>
                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                      <span className="text-[11px] text-slate-400 block">Net Profit</span>
                      <span className="text-lg font-extrabold text-[#F5B400]">KSh 128,430</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Margin: 26.6%</span>
                    </div>
                  </div>

                  {/* Business Score Preview Box */}
                  <div className="bg-[#0B2440] p-3.5 rounded-xl border border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-[#F5B400]" /> My Business Score
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">Financial & operational health</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-emerald-400">72</span>
                      <span className="text-xs text-slate-400"> / 100</span>
                    </div>
                  </div>

                  {/* Recent Activity List */}
                  <div className="space-y-2 pt-1 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50">
                      <span className="text-slate-300">Sale: Juma Omondi (Apex Plumbers)</span>
                      <span className="font-bold text-emerald-400">+ KSh 19,800</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50">
                      <span className="text-slate-300">KRA eTIMS VAT Reconciliation</span>
                      <span className="text-[10px] font-semibold text-[#F5B400]">Due in 29 days</span>
                    </div>
                  </div>

                  <button
                    onClick={onOpenDemo}
                    className="w-full py-2.5 text-xs font-bold text-center text-slate-900 bg-[#F5B400] hover:bg-[#d99f00] rounded-xl transition-colors shadow"
                  >
                    Open Live Interactive Dashboard →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Five Quick-Feature Strip Beneath Hero (§6) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-800/80">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { icon: Receipt, label: 'Finance & Invoicing', desc: 'Track sales, expenses, cash flow', slug: 'cash-flow-finance' as FeatureSlug },
              { icon: MessageSquare, label: 'Customers & WhatsApp CRM', desc: 'Chat, reminders, templates', slug: 'customers-whatsapp-crm' as FeatureSlug },
              { icon: Package, label: 'Inventory & Operations', desc: 'Stock alerts, products, suppliers', slug: 'inventory-operations' as FeatureSlug },
              { icon: ShieldCheck, label: 'Compliance & Tax', desc: 'eTIMS, KRA calendar & tips', slug: 'tax-compliance' as FeatureSlug },
              { icon: GraduationCap, label: 'Business Intelligence & Score', desc: 'Health score & insights', slug: 'business-intelligence-growth' as FeatureSlug },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedFeatureSlug(item.slug)}
                  className="bg-white/5 hover:bg-white/10 p-3.5 rounded-xl border border-white/10 transition-colors flex flex-col gap-1.5 text-left cursor-pointer group"
                >
                  <Icon className="w-5 h-5 text-[#F5B400] group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white group-hover:text-[#F5B400] transition-colors">{item.label}</span>
                  <span className="text-[11px] text-slate-400 leading-tight">{item.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. PROBLEM SECTION — "Solve Your Biggest Business Challenges" (§6) */}
      <section id="solutions" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F7A4C] mb-2">Built For Reality</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Solve Your Biggest Business Challenges
            </h3>
            <p className="text-base text-slate-600 mt-3">
              Most Kenyan business owners juggle notebooks, paper receipts, and WhatsApp chats. BizHubKE brings your entire operation together into one calm, organized system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: Cash Flow & Finance */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#E8F7EF] text-[#0F7A4C] flex items-center justify-center mb-5 font-bold">
                  <Receipt className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">1. Cash Flow & Finance</h4>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Know your daily sales, true expenses, and real net profit. Track who owes you money ("deni") and get automated warnings before your cash balance drops too low for rent or restock.
                </p>
              </div>
              <button
                onClick={() => setSelectedFeatureSlug('cash-flow-finance')}
                className="text-sm font-semibold text-[#0F7A4C] hover:text-[#0b5e3a] flex items-center gap-1 mt-2 cursor-pointer"
              >
                Deep Dive & Details <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 2: Tax & Compliance */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EAF3FB] text-sky-700 flex items-center justify-center mb-5 font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">2. Tax & Compliance</h4>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  Stay ahead of KRA deadlines (VAT 20th, PAYE 9th), eTIMS electronic invoicing workflows, and County Single Business Permits without confusion or stress.
                </p>
                <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-[11px] text-slate-500 italic mb-4">
                  "BizHubKE provides business information and workflow tools and does not replace professional tax or legal advice."
                </div>
              </div>
              <button
                onClick={() => setSelectedFeatureSlug('tax-compliance')}
                className="text-sm font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
              >
                Deep Dive & Details <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 3: Inventory & Operations */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FDF1E4] text-amber-700 flex items-center justify-center mb-5 font-bold">
                  <Package className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">3. Inventory & Operations</h4>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Stop running out of fast-selling goods while cash is tied up in dead stock. Automatic low-stock notifications (🔴 Critical / 🟡 Low / 🟢 Healthy) and quick adjustment logs.
                </p>
              </div>
              <button
                onClick={() => setSelectedFeatureSlug('inventory-operations')}
                className="text-sm font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 mt-2 cursor-pointer"
              >
                Deep Dive & Details <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 4: Customers & WhatsApp CRM */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#E8F7EF] text-[#0F7A4C] flex items-center justify-center mb-5 font-bold">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">4. Customers & WhatsApp CRM</h4>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Kenya runs on WhatsApp. Store your customer contacts, purchase history, order follow-ups, and send polite payment reminders and payday promotions with one tap.
                </p>
              </div>
              <button
                onClick={() => setSelectedFeatureSlug('customers-whatsapp-crm')}
                className="text-sm font-semibold text-[#0F7A4C] hover:text-[#0b5e3a] flex items-center gap-1 mt-2 cursor-pointer"
              >
                Deep Dive & Details <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 5: Business Intelligence & Growth */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between md:col-span-2 lg:col-span-2">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FBEAF1] text-rose-700 flex items-center justify-center mb-5 font-bold">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">5. Business Intelligence & Growth (My Business Score)</h4>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Get a comprehensive Business Health Score (0-100) across 5 core dimensions: Financial Health, Customer Management, Operations, Marketing, and Compliance. Receive plain-language recommendations to spot hidden profit leakages and expand.
                </p>
              </div>
              <button
                onClick={() => setSelectedFeatureSlug('business-intelligence-growth')}
                className="text-sm font-semibold text-rose-700 hover:text-rose-800 flex items-center gap-1 mt-2 cursor-pointer"
              >
                Deep Dive & Details <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SHOWCASE PANEL — "Everything You Need in One Platform" (§6) */}
      <section id="features" className="py-20 bg-[#0B2440] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F5B400]">Feature Showcase</span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Everything You Need in One Platform
            </h3>
            <p className="text-slate-300 text-sm sm:text-base mt-3">
              Crafted specifically for the nuances of trading, contracting, retail, and manufacturing in Kenya.
            </p>

            {/* Showcase Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              {[
                { id: 'finance', label: 'Finance & Invoicing' },
                { id: 'crm', label: 'WhatsApp & Customers' },
                { id: 'inventory', label: 'Inventory & Stock' },
                { id: 'tax', label: 'Tax & Compliance' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveShowcaseTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeShowcaseTab === tab.id
                      ? 'bg-[#F5B400] text-slate-950 shadow-md font-bold'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content Panels */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-700 p-6 sm:p-8 lg:p-10 shadow-2xl">
            {activeShowcaseTab === 'finance' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#0F7A4C]/30 text-emerald-300 border border-[#0F7A4C]/50">
                    Smart Kenyan Bookkeeping
                  </span>
                  <h4 className="text-2xl sm:text-3xl font-bold text-white">
                    Professional Invoicing & M-Pesa Sales Tracking
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Generate polished invoices with your logo, business details, KRA PIN, and Lipa Na M-Pesa Till number. Print or send via WhatsApp with one click.
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#F5B400]" />
                      Auto 16% VAT calculation for tax invoices
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#F5B400]" />
                      Tracks Paid, Unpaid, and Overdue customer debt
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#F5B400]" />
                      Expense category tracker with receipt attachment
                    </li>
                  </ul>
                  <button
                    onClick={onOpenDemo}
                    className="mt-4 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-[#F5B400] hover:bg-[#d99f00] transition-colors inline-flex items-center gap-2"
                  >
                    Test Invoice Generator in Demo <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-[#061628] rounded-xl border border-slate-800 p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono text-slate-400">SAMPLE INVOICE PREVIEW</span>
                    <span className="text-xs font-bold text-emerald-400">INV-2026-0042</span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-1">
                    <p className="font-semibold text-white">Billed to: Greenwood Heights Site B</p>
                    <p className="text-slate-400">Total: KSh 88,450 (Incl. 16% VAT)</p>
                    <p className="text-[#F5B400]">Payment: Lipa Na M-Pesa Till 892104</p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-400 font-mono">
                    ✓ Deformed Steel Bars Y16 x 25 = KSh 46,250<br/>
                    ✓ Ordinary Portland Cement 50kg x 40 = KSh 30,000<br/>
                    ------------------------------------------<br/>
                    Subtotal: KSh 76,250 | VAT (16%): KSh 12,200
                  </div>
                </div>
              </div>
            )}

            {activeShowcaseTab === 'crm' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#0F7A4C]/30 text-emerald-300 border border-[#0F7A4C]/50">
                    Customer Retention
                  </span>
                  <h4 className="text-2xl sm:text-3xl font-bold text-white">
                    Supercharge Repeat Orders with WhatsApp CRM
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Build a durable customer directory with purchase history, lifetime spend, and custom tags (VIP, Wholesale, Repeat, Inactive). Tap to message clients directly on WhatsApp.
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#F5B400]" />
                      Pre-written Kenyan templates: polite payment reminders, order dispatch, payday specials
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#F5B400]" />
                      Ready for WhatsApp Business Cloud API connection
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#F5B400]" />
                      Automatic inactive customer detection to prevent churn
                    </li>
                  </ul>
                </div>
                <div className="bg-[#061628] rounded-xl border border-slate-800 p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-white">WhatsApp Message Template</span>
                    <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded">Payment Reminder</span>
                  </div>
                  <div className="bg-emerald-950/40 border border-emerald-800/40 p-3 rounded-lg text-xs text-emerald-100 font-sans leading-relaxed">
                    "Jambo Juma Omondi, warm greetings from Mama Njeri Supplies. This is a gentle reminder regarding Invoice INV-2026-0041 for KSh 25,288. Kindly settle via Lipa Na M-Pesa Till: 892104. Asante sana!"
                  </div>
                </div>
              </div>
            )}

            {activeShowcaseTab === 'inventory' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Stock & Supply Chain
                  </span>
                  <h4 className="text-2xl sm:text-3xl font-bold text-white">
                    Real-Time Stock Counts & Supplier Balances
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Track every item from warehouse to counter. Easily record incoming shipments from suppliers like Devki, Crown Paints, or Bamburi, and monitor supplier credit terms.
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#F5B400]" />
                      Color-coded inventory alerts (🔴 Critical, 🟡 Low, 🟢 Healthy)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#F5B400]" />
                      Dead-stock reports to identify slow-moving capital
                    </li>
                  </ul>
                </div>
                <div className="bg-[#061628] rounded-xl border border-slate-800 p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-800/50 border border-rose-900/40">
                    <span className="text-slate-200 font-medium">Dulux White 20L</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[10px]">
                      4 in stock (Critical &lt; 8)
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-800/50 border border-amber-900/40">
                    <span className="text-slate-200 font-medium">Bamburi Cement 50kg</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                      45 in stock (Low &lt; 50)
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-800/50 border border-emerald-900/40">
                    <span className="text-slate-200 font-medium">Steel Bars Y12 (12m)</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                      110 in stock (Healthy)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeShowcaseTab === 'tax' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    KRA & County Compliance
                  </span>
                  <h4 className="text-2xl sm:text-3xl font-bold text-white">
                    Compliance Calendar & eTIMS Invoicing Guidance
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Never get caught off-guard by KRA filing penalties. Countdown timers for VAT (20th), PAYE and Housing Levy (9th), NSSF, and County Business Permits.
                  </p>
                  <p className="text-xs text-slate-400 italic">
                    Always consult KRA or certified professionals for statutory filings; BizHubKE keeps your books organized for rapid submission.
                  </p>
                </div>
                <div className="bg-[#061628] rounded-xl border border-slate-800 p-4 space-y-2 text-xs">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-700 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white">KRA Monthly VAT Return</p>
                      <p className="text-[11px] text-slate-400">Due: 20th Oct 2026</p>
                    </div>
                    <span className="text-xs font-bold text-[#F5B400]">29 Days Left</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-700 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white">PAYE & Housing Levy</p>
                      <p className="text-[11px] text-slate-400">Due: 9th Oct 2026</p>
                    </div>
                    <span className="text-xs font-bold text-amber-400">18 Days Left</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. NEWS & TRAINING PREVIEW (§6, §21, §23) */}
      <section id="news" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F7A4C]">Continuous Knowledge</span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
              Stay Informed. Keep Learning. Grow Faster.
            </h3>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Curated Kenyan business news with practical "What This Means For Your Business" breakdowns and bite-sized Academy courses.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* News Feature Card */}
            <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F7A4C]">Kenya Business News</span>
                <span className="text-xs text-slate-500">Updated Daily</span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                KRA Updates eTIMS Exemption Guidelines for Micro-Traders Under KSh 5M
              </h4>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                KRA clarified that micro-businesses can utilize eTIMS Lite via USSD (*222#) and mobile apps without buying dedicated electronic signature hardware.
              </p>
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 mb-4">
                <p className="text-xs font-bold text-[#0B2440]">💡 WHAT THIS MEANS FOR YOUR BUSINESS:</p>
                <p className="text-xs text-slate-600">
                  You can issue compliant electronic invoices directly without buying expensive hardware. All B2B corporate buyers now demand valid eTIMS invoices for deduction.
                </p>
              </div>
              <button
                onClick={onOpenDemo}
                className="text-xs font-bold text-[#0F7A4C] hover:underline flex items-center gap-1"
              >
                Read More News in Platform →
              </button>
            </div>

            {/* Training Academy Feature Card */}
            <div id="training" className="bg-[#E8F7EF] p-6 sm:p-8 rounded-2xl border border-[#0F7A4C]/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F7A4C]">BizHubKE Academy</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#0F7A4C] text-white">Free Access</span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                Mastering Cash Flow & Working Capital for Kenyan SMEs
              </h4>
              <p className="text-sm text-slate-700 mb-4 leading-relaxed">
                4 practical lessons: Why cash flow matters more than paper profit, managing customer "deni", separating personal Safaricom from business tills, and 30-day projections.
              </p>
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#0F7A4C]" /> Lesson 1: The Working Capital Formula (8 mins)
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#0F7A4C]" /> Lesson 2: Controlling Customer Credit & Deni (10 mins)
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#0F7A4C]" /> Includes Interactive Knowledge Quiz
                </div>
              </div>
              <button
                onClick={onOpenDemo}
                className="text-xs font-bold text-white bg-[#0F7A4C] hover:bg-[#0b5e3a] px-4 py-2.5 rounded-xl transition-colors inline-flex items-center gap-1"
              >
                Take Course in Academy →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRUST STRIP (§6) */}
      <section className="py-12 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#F5B400]">47</span>
              <p className="text-xs text-slate-300 font-medium">Kenyan Counties Supported</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100%</span>
              <p className="text-xs text-slate-300 font-medium">Lipa Na M-Pesa Friendly</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#F5B400]">5 Mins</span>
              <p className="text-xs text-slate-300 font-medium">Time to First Value / Setup</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">Local</span>
              <p className="text-xs text-slate-300 font-medium">Nairobi Dedicated Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRICING SECTION (§28) */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F7A4C]">Transparent Kenyan Pricing</span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
              Affordable Plans Tailored for Local Hustles
            </h3>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Transparent Kenyan Shilling (KES) rates with instant Lipa Na M-Pesa checkout. 7-day full access free trial on all plans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-stretch">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl p-5 border flex flex-col justify-between transition-all relative ${
                  plan.popular
                    ? 'border-[#0F7A4C] shadow-lg ring-2 ring-[#0F7A4C]/20 transform -translate-y-1'
                    : 'border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#0F7A4C] text-white text-[10px] uppercase tracking-wider font-extrabold px-3 py-0.5 rounded-full shadow">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h4 className="text-base font-bold text-slate-900">{plan.name}</h4>
                  <div className="mt-3 mb-2 flex items-baseline">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                      {plan.price === 0 ? 'Free' : formatKsh(plan.price)}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">{plan.period}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4 min-h-[36px]">
                    {plan.description}
                  </p>

                  <div className="border-t border-slate-100 pt-4 space-y-2 mb-6">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0F7A4C] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  id={`pricing-btn-${plan.name.toLowerCase()}`}
                  onClick={() => onOpenAuth('signup')}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                    plan.popular
                      ? 'bg-[#F5B400] hover:bg-[#d99f00] text-slate-950 shadow-md'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {plan.ctaText}
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-slate-500 mt-8">
            * 7-day free trial on all paid plans. Pay easily via M-Pesa Buy Goods or Paybill. No credit card required.
          </p>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS (§37) */}
      <section id="about" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F7A4C]">Got Questions?</span>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What is BizHubKE and who is it designed for?',
                a: 'BizHubKE is an all-in-one digital business partner created specifically for Kenyan SMEs, dukas, hardware shops, wholesalers, boutiques, salons, and contractors. It combines sales and expense bookkeeping, professional invoicing, inventory with low-stock warnings, WhatsApp CRM, KRA compliance trackers, and an AI business assistant.',
              },
              {
                q: 'Does BizHubKE replace an accountant or file my taxes directly?',
                a: 'No. BizHubKE organizes your records, tracks deadlines, and computes standard figures (like 16% VAT and gross margins) so you or your bookkeeper can file accurately on KRA iTax. It does not replace certified legal or CPA counsel.',
              },
              {
                q: 'How do I pay for my subscription?',
                a: 'We accept Lipa Na M-Pesa (Buy Goods Till and Paybill) as well as major debit/credit cards. You can start with our 7-day free trial without making any payment upfront.',
              },
              {
                q: 'Can I use BizHubKE on my smartphone or tablet?',
                a: 'Yes! BizHubKE is fully responsive and optimized for mobile browsers. You can record sales, check stock levels, and send invoices right from your shop floor or vehicle.',
              },
              {
                q: 'How does WhatsApp integration work?',
                a: 'BizHubKE provides customer profiles, message templates (orders, payment reminders, promotions), and quick WhatsApp click-to-chat links. Our architecture also prepares your account for official WhatsApp Business Cloud API connectivity.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#0F7A4C]" /> {faq.q}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL SITE-WIDE CTA (§46) */}
      <section id="contact" className="py-20 bg-gradient-to-r from-[#0B2440] via-[#0b2b4d] to-[#07192d] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F5B400] bg-[#F5B400]/10 px-4 py-1.5 rounded-full border border-[#F5B400]/20">
            Start Your Journey Today
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Your Business. One Powerful Platform.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Stop managing your business from scattered notebooks, spreadsheets and WhatsApp chats. Bring your business together with BizHubKE.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              id="final-cta-signup-btn"
              onClick={() => onOpenAuth('signup')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-slate-950 bg-[#F5B400] hover:bg-[#d99f00] text-base shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              Start Free Today (7-Day Trial)
            </button>
            <button
              id="final-cta-demo-btn"
              onClick={onOpenDemo}
              className="w-full sm:w-auto px-7 py-4 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 text-base transition-colors"
            >
              Explore Features Demo
            </button>
          </div>
          <p className="text-xs text-slate-400 pt-2">
            No credit card needed • Setup takes less than 5 minutes • Dedicated Kenyan support
          </p>
        </div>
      </section>
    </div>
  );
};
