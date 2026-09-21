import React from 'react';
import {
  Compass,
  ExternalLink,
  ShieldCheck,
  Building2,
  FileCheck2,
  Users2,
  HeartPulse,
  Landmark,
  Lightbulb,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { BusinessTenant } from '../../types';

interface BusinessHubViewProps {
  tenant: BusinessTenant;
  onNavigateView: (view: any) => void;
}

interface GovernmentPortal {
  id: string;
  name: string;
  authority: string;
  url: string;
  category: 'Tax & Compliance' | 'Business Permits' | 'Labour & Healthcare' | 'Corporate Registry';
  description: string;
  actionLabel: string;
  keyUse: string;
}

const GOVERNMENT_PORTALS: GovernmentPortal[] = [
  {
    id: 'itax',
    name: 'KRA iTax Portal',
    authority: 'Kenya Revenue Authority',
    url: 'https://itax.kra.go.ke',
    category: 'Tax & Compliance',
    description: 'File monthly VAT returns (20th), PAYE (9th), Turnover Tax (TOT), and obtain tax compliance certificates (TCC).',
    actionLabel: 'Open iTax Online',
    keyUse: 'Monthly returns & PIN management',
  },
  {
    id: 'etims',
    name: 'KRA eTIMS Portal',
    authority: 'KRA Electronic Tax Invoice Management',
    url: 'https://etims.kra.go.ke',
    category: 'Tax & Compliance',
    description: 'Manage virtual sales control units (VSCU), eTIMS client software, and verify supplier electronic invoices.',
    actionLabel: 'Open eTIMS Portal',
    keyUse: 'Electronic invoicing verification',
  },
  {
    id: 'ecitizen',
    name: 'eCitizen Business Gateway',
    authority: 'Government of Kenya',
    url: 'https://www.ecitizen.go.ke',
    category: 'Business Permits',
    description: 'Apply for and renew unified County Single Business Permits, fire safety clearances, and health certificates.',
    actionLabel: 'Open eCitizen Gateway',
    keyUse: 'County Single Business Permits',
  },
  {
    id: 'brs',
    name: 'Business Registration Service (BRS)',
    authority: 'Office of the Attorney General',
    url: 'https://brs.go.ke',
    category: 'Corporate Registry',
    description: 'Register business names, private limited companies, link CR12 ownership records, and file annual returns.',
    actionLabel: 'Open BRS Portal',
    keyUse: 'CR12 & Annual returns',
  },
  {
    id: 'nssf',
    name: 'NSSF Self-Service Portal',
    authority: 'National Social Security Fund',
    url: 'https://www.nssf.or.ke',
    category: 'Labour & Healthcare',
    description: 'Submit monthly statutory employee pension deductions (due by 9th of each month) to avoid 5% monthly penalties.',
    actionLabel: 'Open NSSF Portal',
    keyUse: 'Staff pension contributions',
  },
  {
    id: 'sha',
    name: 'Social Health Authority (SHA/SHIF)',
    authority: 'Ministry of Health',
    url: 'https://sha.go.ke',
    category: 'Labour & Healthcare',
    description: 'Register enterprise employees and submit the 2.75% gross salary contributions replacing former NHIF.',
    actionLabel: 'Open SHA Portal',
    keyUse: 'Employee healthcare remittances',
  },
];

export const BusinessHubView: React.FC<BusinessHubViewProps> = ({ tenant, onNavigateView }) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-[#0F7A4C]">
              Directory & Tooling
            </span>
            <span className="text-xs text-slate-400">• Official Kenyan Gateways</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Compass className="w-6 h-6 text-[#0F7A4C]" /> Kenyan SME Business Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fast, secure access to essential government portals, practical operational tips for {tenant.name}, and upcoming toolkits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateView('compliance')}
            className="px-4 py-2 text-xs font-bold text-[#0F7A4C] bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" /> View KRA Deadlines
          </button>
        </div>
      </div>

      {/* Practical Tips Grounded in Tenant Data */}
      <div className="bg-gradient-to-r from-[#0B2440] to-slate-900 text-white p-6 rounded-2xl shadow-md space-y-4">
        <div className="flex items-center gap-2 text-[#F5B400] text-xs font-bold uppercase tracking-wider">
          <Lightbulb className="w-4 h-4" /> Operational Best Practices for {tenant.county} County
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white/10 p-4 rounded-xl border border-white/10 space-y-1.5">
            <strong className="text-white block font-bold text-sm">1. M-Pesa Till Segregation</strong>
            <p className="text-slate-300 leading-relaxed">
              Never use your personal Safaricom line for customer receipts. Ensure all funds flow into your business Till ({tenant.mpesaTill || '892104'}) to simplify KRA audit reconciliation.
            </p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/10 space-y-1.5">
            <strong className="text-white block font-bold text-sm">2. eTIMS Supplier Receipts</strong>
            <p className="text-slate-300 leading-relaxed">
              Whenever purchasing stock above KSh 2,000, demand an eTIMS QR receipt from wholesalers. Expenses without valid eTIMS invoices are not tax-deductible under KRA §27 rules.
            </p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/10 space-y-1.5">
            <strong className="text-white block font-bold text-sm">3. Statutory Deadline Rule</strong>
            <p className="text-slate-300 leading-relaxed">
              Always submit PAYE & NSSF by the 9th, and VAT by the 20th. Even if sales were zero, file a "Nil Return" on iTax to prevent automated system penalties.
            </p>
          </div>
        </div>
      </div>

      {/* Verified Government Portals Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-[#0F7A4C]" /> Official Government Portals & Online Filing
          </h2>
          <span className="text-xs text-slate-400">All links open verified government portals in a new tab</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GOVERNMENT_PORTALS.map((portal) => (
            <div
              key={portal.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#0F7A4C]/50 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {portal.category}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    Official .go.ke
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-sm">{portal.name}</h3>
                <span className="text-[11px] font-medium text-slate-400 block mb-2">{portal.authority}</span>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{portal.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">{portal.keyUse}</span>
                <a
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0F7A4C] hover:text-[#0b5e3a] transition-colors"
                >
                  {portal.actionLabel} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Modules Roadmap Preview (§21a) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
              Product Roadmap
            </span>
            <h2 className="text-base font-extrabold text-slate-900 mt-1">Upcoming BizHubKE Ecosystem Integrations</h2>
          </div>
          <span className="text-xs text-slate-400">Expanding weekly for Kenyan SMEs</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Safaricom Daraja B2B</span>
              <span className="text-[10px] font-semibold bg-emerald-100 text-[#0F7A4C] px-2 py-0.5 rounded-full">In Beta</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Automatic M-Pesa webhook reconciliation so your sales record themselves the second a customer enters their PIN.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">KRA eTIMS VSCU Sync</span>
              <span className="text-[10px] font-semibold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">Q4 2026</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Direct API handshake transmitting compliant electronic invoices directly to KRA servers without manual re-entry.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">eCitizen Single Permit Renewal</span>
              <span className="text-[10px] font-semibold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">Planned</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              One-click County single business permit license application and renewal across Nairobi, Kiambu, and Mombasa counties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
