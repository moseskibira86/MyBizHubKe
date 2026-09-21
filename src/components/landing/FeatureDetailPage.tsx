import React from 'react';
import {
  ArrowLeft,
  Receipt,
  ShieldCheck,
  Package,
  MessageSquare,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Lock,
  Zap,
  Clock,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export type FeatureSlug =
  | 'cash-flow-finance'
  | 'tax-compliance'
  | 'inventory-operations'
  | 'customers-whatsapp-crm'
  | 'business-intelligence-growth';

interface FeatureDetailPageProps {
  slug: FeatureSlug;
  onBack: () => void;
  onStartTrial: () => void;
  onOpenDemo: () => void;
}

interface FeatureContent {
  title: string;
  subtitle: string;
  badge: string;
  icon: any;
  colorScheme: {
    bgLight: string;
    text: string;
    border: string;
  };
  challenge: string;
  solution: string;
  capabilities: {
    title: string;
    description: string;
  }[];
  kenyanContext: string;
  stat: {
    value: string;
    label: string;
  };
  quote: {
    text: string;
    author: string;
    business: string;
    location: string;
  };
  disclaimer?: string;
}

const FEATURE_DATA: Record<FeatureSlug, FeatureContent> = {
  'cash-flow-finance': {
    title: 'Cash Flow, Sales & eTIMS Invoicing',
    subtitle:
      'Gain 100% visibility over daily sales, cash vs. Lipa Na M-Pesa receipts, customer credit ("deni"), and true operating profit.',
    badge: 'Finance & Invoicing',
    icon: Receipt,
    colorScheme: {
      bgLight: 'bg-[#E8F7EF]',
      text: 'text-[#0F7A4C]',
      border: 'border-[#0F7A4C]/30',
    },
    challenge:
      'Most Kenyan business owners mix personal and business M-Pesa accounts, sell goods on unrecorded credit ("daftari"), and struggle to know whether they actually made a profit at month-end.',
    solution:
      'BizHubKE automatically segregates payment channels, calculates gross and net margin per sale, tracks overdue customer balances with polite reminders, and generates 16% VAT-compliant KRA eTIMS invoices.',
    capabilities: [
      {
        title: 'Multi-Channel Sales Recording',
        description: 'Instantly record sales via M-Pesa Till/Paybill, Cash, Bank Transfer, or Credit/Deni in under 5 seconds.',
      },
      {
        title: 'eTIMS 16% VAT Tax Invoicing',
        description: 'Generate professional invoices featuring your KRA PIN, itemized tax rates, and instant PDF download or WhatsApp delivery.',
      },
      {
        title: 'Customer "Deni" Ledger',
        description: 'A structured digital debtors book tracking exact balances owed, payment terms, and automated repayment reminders.',
      },
      {
        title: 'Cash Flow Runaway & Low-Balance Alerts',
        description: 'Get proactive alerts before your working capital dips below rent, payroll, or stock replenishment requirements.',
      },
    ],
    kenyanContext:
      'Built specifically around the realities of Nairobi CBD, Gikomba, Kisumu, Nakuru, and Mombasa retail commerce where 70%+ of transactions occur via Safaricom M-Pesa.',
    stat: {
      value: 'KSh 42,000',
      label: 'Average uncollected credit recovered in the first 30 days',
    },
    quote: {
      text: 'I used to lose thousands every month because clients promised to send M-Pesa later. The Deni ledger and one-tap reminders paid for BizHubKE in our first week.',
      author: 'David Mwangi',
      business: 'Apex Plumbing & Hardware',
      location: 'Nakuru Town',
    },
  },
  'tax-compliance': {
    title: 'KRA Tax & Statutory Compliance Centre',
    subtitle:
      'Stay ahead of KRA VAT (20th), PAYE & NSSF (9th), eTIMS requirements, and County Single Business Permits.',
    badge: 'Compliance & Tax',
    icon: ShieldCheck,
    colorScheme: {
      bgLight: 'bg-[#EAF3FB]',
      text: 'text-sky-700',
      border: 'border-sky-300',
    },
    challenge:
      'KRA penalties for late VAT filing (KSh 10,000+) or missed PAYE/Housing levy deadlines cripple growing Kenyan businesses. Keeping up with eTIMS regulations feels overwhelming.',
    solution:
      'A dedicated compliance calendar with live countdowns, expense deductibility tags, automated VAT output calculations, and plain-language KRA guidance.',
    capabilities: [
      {
        title: 'Dynamic Statutory Calendar',
        description: 'Live countdowns to the 9th (PAYE, NSSF, Housing Levy) and 20th (VAT, Withholding Tax) of every month.',
      },
      {
        title: 'eTIMS Qualified Expense Tracking',
        description: 'Tag business expenses with receipt status to separate valid tax deductions from non-claimable cash outflows.',
      },
      {
        title: 'County Single Business Permit Reminders',
        description: 'Automated renewal alerts across all 47 counties (Nairobi, Kiambu, Mombasa, Nakuru, etc.) to prevent county askari closures.',
      },
      {
        title: 'Official Portal Quick Access',
        description: 'Verified direct links to KRA iTax, eTIMS portal, eCitizen, and BRS without navigating phishing or outdated sites.',
      },
    ],
    kenyanContext:
      'Aligned with the Finance Act 2024 / 2025 regulatory guidelines and KRA electronic Tax Invoice Management System mandates.',
    stat: {
      value: '0 Penalties',
      label: 'Maintained across all active BizHubKE compliant subscribers',
    },
    quote: {
      text: 'Before BizHubKE, our county business permit expired and we were shut down for two days. Now the calendar warns me 60 days in advance.',
      author: 'Amina Hassan',
      business: 'Coastview Chemist & Healthcare',
      location: 'Mombasa Old Town',
    },
    disclaimer:
      'BizHubKE provides business information and workflow management tools and does not replace professional tax, accounting, or legal advice. Verify all filings with KRA or a certified CPA-K.',
  },
  'inventory-operations': {
    title: 'Smart Stock & Inventory Operations',
    subtitle:
      'Eliminate stockouts of your bestsellers and stop tying up cash in slow-moving or dead stock.',
    badge: 'Inventory & Stock',
    icon: Package,
    colorScheme: {
      bgLight: 'bg-[#FDF1E4]',
      text: 'text-amber-800',
      border: 'border-amber-300',
    },
    challenge:
      'Kenyan shops often discover an item is out of stock only when a customer is standing at the counter with M-Pesa open, losing sales to neighbouring dukas.',
    solution:
      'Real-time inventory levels, automated 🔴 Critical / 🟡 Low / 🟢 Healthy stock alerts, supplier restock ordering, and stock valuation in KSh.',
    capabilities: [
      {
        title: 'Low Stock & Critical Reorder Alerts',
        description: 'Set custom thresholds for every product so you get notified days before high-margin items sell out.',
      },
      {
        title: 'Stock Adjustment & Shrinkage Logs',
        description: 'Track breakages, expiration, and stock audits with transparent audit trails for storekeepers and cashiers.',
      },
      {
        title: 'Inventory Valuation & Margin Analytics',
        description: 'Know the total wholesale cost value and potential retail return of everything sitting on your shelves.',
      },
      {
        title: 'Integrated Supplier Directory',
        description: 'Link products directly to Nairobi Industrial Area, Eldoret, or Mombasa suppliers with credit terms and balance owed.',
      },
    ],
    kenyanContext:
      'Tested with fast-moving consumer goods (FMCG), electrical appliances, hardware, agricultural feeds, and fashion retail.',
    stat: {
      value: '98.4%',
      label: 'Inventory accuracy reported by BizHubKE retail merchants',
    },
    quote: {
      text: 'Our cement and iron sheets stock used to have constant discrepancies. BizHubKE stock alerts let us order from suppliers right on time.',
      author: 'Peter Kamau',
      business: 'Kamau Hardware & Electricals',
      location: 'Nairobi CBD / River Road',
    },
  },
  'customers-whatsapp-crm': {
    title: 'Customer CRM & WhatsApp Business Hub',
    subtitle:
      'Turn one-off walk-in buyers into loyal repeat customers using professional WhatsApp chat templates.',
    badge: 'Customers & WhatsApp',
    icon: MessageSquare,
    colorScheme: {
      bgLight: 'bg-[#E8F7EF]',
      text: 'text-[#0F7A4C]',
      border: 'border-[#0F7A4C]/30',
    },
    challenge:
      'Most businesses store customer numbers in personal phones, lose contact when staff leave, and fail to send follow-ups or promotional announcements.',
    solution:
      'Centralized customer directory with total spend history, VIP loyalty tagging, and 8 pre-approved WhatsApp message templates with pre-filled wa.me links.',
    capabilities: [
      {
        title: '8 Ready-to-Send WhatsApp Templates',
        description: 'Enquiries, order confirmations, payment reminders, thank-yous, review requests, repeat purchases, promotions, and holiday greetings.',
      },
      {
        title: 'Direct wa.me Instant Links',
        description: 'Open pre-filled WhatsApp conversations with customer names and invoice amounts in a single tap without manual typing.',
      },
      {
        title: 'VIP & Customer Segmentation',
        description: 'Identify your top 20% of customers driving 80% of revenue and reward them with exclusive deals.',
      },
      {
        title: 'Official Cloud API Architecture',
        description: 'Built to scale from simple manual wa.me links to full verified WhatsApp Business Platform API automation.',
      },
    ],
    kenyanContext:
      '96% of Kenyan internet users rely on WhatsApp daily. BizHubKE meets your customers on their preferred channel.',
    stat: {
      value: '3.4x',
      label: 'Faster payment collection via personalized WhatsApp reminders',
    },
    quote: {
      text: 'Sending a polite WhatsApp message with our M-Pesa Till number immediately after a sale increased our repeat customer rate by 35%.',
      author: 'Faith Wanjiku',
      business: 'Chic Boutique & Beauty Bar',
      location: 'Eldoret Town',
    },
  },
  'business-intelligence-growth': {
    title: 'Business Intelligence & My Business Score',
    subtitle:
      'Know your numbers at a glance and discover exactly where your business can unlock more profit.',
    badge: 'Business Intelligence',
    icon: TrendingUp,
    colorScheme: {
      bgLight: 'bg-[#FBEAF1]',
      text: 'text-rose-800',
      border: 'border-rose-300',
    },
    challenge:
      'Kenyan entrepreneurs work 12-hour days but often cannot answer basic questions: "Which product makes me the most money?" or "Is my business healthy enough for a loan?"',
    solution:
      'Executive dashboard with My Business Score (0-100), visual trend charts for sales vs expenses, product margin ranking, and server-side Gemini AI advisory.',
    capabilities: [
      {
        title: 'My Business Score Diagnostic',
        description: 'Holistic health score evaluating Financial Health, Customer Retention, Operations, Compliance, and Marketing.',
      },
      {
        title: 'Ask BizHub AI Advisor',
        description: 'Server-side Gemini AI trained on Kenyan tax laws, M-Pesa reconciliation, and local market SME growth strategies.',
      },
      {
        title: 'Visual Revenue & Expense Trends',
        description: 'Intuitive charts powered by Recharts revealing seasonal surges and cost leaks over 7 days, 30 days, or 12 months.',
      },
      {
        title: 'Bank & SACCO Readiness Insights',
        description: 'Understand your borrowing power and financial cleanliness before applying for Hustler Fund MSME or commercial bank credit.',
      },
    ],
    kenyanContext:
      'Customized recommendations taking into account Kenyan inflation, supplier credit terms, and county tax schedules.',
    stat: {
      value: '78 / 100',
      label: 'Average Business Health Score of active BizHubKE users',
    },
    quote: {
      text: 'The AI advisor showed me that transport costs were eating 22% of my gross profit. Switching to consolidated deliveries saved us KSh 60,000 a month.',
      author: 'Kevin Ochieng',
      business: 'Lakeside Agro-Vet Supplies',
      location: 'Kisumu City',
    },
    disclaimer:
      'My Business Score is an internal management diagnostic indicator based on self-reported data. It is not an official bank credit rating or credit-bureau score.',
  },
};

export const FeatureDetailPage: React.FC<FeatureDetailPageProps> = ({
  slug,
  onBack,
  onStartTrial,
  onOpenDemo,
}) => {
  const content = FEATURE_DATA[slug];
  const Icon = content.icon;

  return (
    <div className="min-h-screen bg-white">
      {/* Top Breadcrumb Header */}
      <div className="bg-[#0B2440] text-white py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white mb-6 transition-colors bg-white/10 px-3 py-1.5 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Features
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F5B400] text-slate-950">
                <Icon className="w-3.5 h-3.5" />
                {content.badge}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                {content.title}
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                {content.subtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={onStartTrial}
                className="px-6 py-3.5 rounded-xl font-extrabold text-sm text-slate-950 bg-[#F5B400] hover:bg-[#d99f00] shadow-lg transition-all text-center"
              >
                Start 7-Day Free Trial
              </button>
              <button
                onClick={onOpenDemo}
                className="px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-center"
              >
                Explore Live Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Challenge vs Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-rose-50/50 p-8 rounded-2xl border border-rose-200 space-y-4">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600" /> The Kenyan SME Challenge
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">What keeps owners awake at night:</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{content.challenge}</p>
          </div>

          <div className="bg-emerald-50/50 p-8 rounded-2xl border border-emerald-200 space-y-4">
            <div className="flex items-center gap-2 text-[#0F7A4C] font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-[#0F7A4C]" /> The BizHubKE Solution
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">How we solve it practically:</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{content.solution}</p>
          </div>
        </div>

        {/* Core Capabilities */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F7A4C] mb-2">Capabilities</h2>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">Built for Kenyan Daily Operations</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.capabilities.map((cap, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-[#0F7A4C]/50 transition-colors space-y-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#E8F7EF] text-[#0F7A4C] flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-base">{cap.title}</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed pl-11">{cap.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Local Metric & Testimonial Card */}
        <div className="bg-gradient-to-br from-slate-900 to-[#0B2440] text-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F5B400]">Real Business Impact</span>
            <blockquote className="text-lg sm:text-xl font-medium text-slate-100 italic">
              "{content.quote.text}"
            </blockquote>
            <div className="pt-2">
              <strong className="text-white block font-bold">{content.quote.author}</strong>
              <span className="text-sm text-slate-400">
                {content.quote.business} • {content.quote.location}
              </span>
            </div>
          </div>

          <div className="bg-white/10 border border-white/20 p-6 rounded-2xl text-center shrink-0 w-full sm:w-64">
            <span className="text-3xl sm:text-4xl font-black text-[#F5B400] block">{content.stat.value}</span>
            <span className="text-xs text-slate-300 mt-1 block font-medium">{content.stat.label}</span>
          </div>
        </div>

        {/* Statutory Disclaimer if present */}
        {content.disclaimer && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Mandatory Advisory Notice:</strong> {content.disclaimer}
            </p>
          </div>
        )}

        {/* Final CTA Bar */}
        <div className="border-t border-slate-200 pt-10 text-center space-y-5">
          <h3 className="text-2xl font-black text-slate-900">
            Ready to upgrade your business operations?
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Get instant access to this feature with our 7-day free trial. Setup takes under 5 minutes with no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onStartTrial}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-extrabold text-sm text-slate-950 bg-[#F5B400] hover:bg-[#d99f00] shadow-md transition-all"
            >
              Start 7-Day Free Trial
            </button>
            <button
              onClick={onBack}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
