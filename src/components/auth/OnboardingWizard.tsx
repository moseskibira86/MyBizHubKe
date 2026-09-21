import React, { useState } from 'react';
import {
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  MapPin,
  Users,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  FileCheck,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { BusinessTenant, County, BusinessCategory } from '../../types';
import { setupWorkspace } from '../../services/api';

interface OnboardingWizardProps {
  onComplete: (tenantData: BusinessTenant, importSampleData: boolean) => void;
  onCancel: () => void;
}

const COUNTIES: County[] = [
  'Nairobi',
  'Mombasa',
  'Kiambu',
  'Nakuru',
  'Kisumu',
  'Uasin Gishu',
  'Machakos',
  'Kajiado',
  'Meru',
  'Kilifi',
  'Nyeri',
  'Kakamega',
  'Other',
];

const CATEGORIES: BusinessCategory[] = [
  'Retail / Duka',
  'Restaurant / Cafe',
  'Wholesale & Distribution',
  'Hardware & Building',
  'Boutique & Apparel',
  'Beauty & Salon',
  'Professional Services',
  'Construction',
  'Transport & Logistics',
  'E-commerce',
  'Agribusiness',
  'Manufacturing',
  'Other',
];

const CHALLENGES = [
  { id: 'cash-flow', label: 'Cash flow & managing delayed customer payments ("Deni")' },
  { id: 'customers', label: 'Getting new customers & marketing consistently' },
  { id: 'stock', label: 'Managing stock & preventing stockouts / dead inventory' },
  { id: 'compliance', label: 'KRA tax compliance, eTIMS & statutory filing deadlines' },
  { id: 'retention', label: 'Customer retention & repeat purchases via WhatsApp' },
  { id: 'planning', label: 'Separating personal money from business accounts' },
  { id: 'understanding', label: 'Understanding true net profit & expense leakage' },
];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [businessName, setBusinessName] = useState('Mama Njeri Supplies');
  const [ownerName, setOwnerName] = useState('Mary Njeri');
  const [email, setEmail] = useState('njeri@mamanjeri.co.ke');
  const [phone, setPhone] = useState('+254 722 890 123');
  const [county, setCounty] = useState<County>('Nairobi');
  const [category, setCategory] = useState<BusinessCategory>('Retail / Duka');
  const [employeeCount, setEmployeeCount] = useState('1 - 4');
  const [monthlySalesRange, setMonthlySalesRange] = useState('KSh 100,000 - 500,000');
  const [kraPin, setKraPin] = useState('P051289341Z');
  const [mpesaTill, setMpesaTill] = useState('892104');

  // Step 2: Challenges
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([
    'cash-flow',
    'compliance',
    'stock',
    'retention',
  ]);

  // Step 3: Data Import preference & async workspace configuration state
  const [importSampleData, setImportSampleData] = useState<boolean>(true);
  const [isSettingUpWorkspace, setIsSettingUpWorkspace] = useState<boolean>(false);
  const [setupError, setSetupError] = useState<string | null>(null);

  const toggleChallenge = (id: string) => {
    if (selectedChallenges.includes(id)) {
      setSelectedChallenges(selectedChallenges.filter((c) => c !== id));
    } else {
      setSelectedChallenges([...selectedChallenges, id]);
    }
  };

  const handleSetupStep3 = async () => {
    setIsSettingUpWorkspace(true);
    setSetupError(null);

    const tempTenant: BusinessTenant = {
      id: `tenant-${Date.now()}`,
      name: businessName || 'My Kenyan Business',
      ownerName: ownerName || 'Business Owner',
      email: email || 'owner@bizhubke.com',
      phone: phone || '+254 700 000 000',
      county,
      category,
      employeeCount,
      monthlySalesRange,
      kraPin: kraPin || undefined,
      mpesaTill: mpesaTill || undefined,
      plan: 'Business',
      isTrial: true,
      trialDaysLeft: 7,
      currency: 'KSh',
      isDemo: false,
      score: 75,
    };

    console.log('[Onboarding Step 3] Initiating workspace setup...', {
      importSampleData,
      businessName: tempTenant.name,
      county: tempTenant.county,
    });

    try {
      // Calls async setup endpoint with timeout and resilience
      const res = await setupWorkspace({
        tenant: tempTenant,
        importSampleData,
      });
      console.log('[Onboarding Step 3] Setup resolved successfully. Transitioning to Step 4:', res);
      // Reliably navigate to Step 4
      setStep(4);
    } catch (err: any) {
      console.error('[Onboarding Step 3] Setup error encountered:', err);
      setSetupError(err?.message || 'Configuration request failed or timed out. Please retry.');
    } finally {
      // Guarantee loading state is always reset
      setIsSettingUpWorkspace(false);
    }
  };

  const handleFinish = () => {
    const tenant: BusinessTenant = {
      id: `tenant-${Date.now()}`,
      name: businessName || 'My Kenyan Business',
      ownerName: ownerName || 'Business Owner',
      email: email || 'owner@bizhubke.com',
      phone: phone || '+254 700 000 000',
      county,
      category,
      employeeCount,
      monthlySalesRange,
      kraPin: kraPin || undefined,
      mpesaTill: mpesaTill || undefined,
      plan: 'Business',
      isTrial: true,
      trialDaysLeft: 7,
      currency: 'KSh',
      isDemo: false,
      score: 75,
    };
    onComplete(tenant, importSampleData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Progress Header */}
        <div className="bg-[#0B2440] text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight">
                BizHub<span className="text-[#F5B400]">KE</span>
              </span>
              <span className="text-xs text-slate-300 font-medium">| Onboarding Wizard</span>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0F7A4C] text-emerald-100">
              Step {step} of 4
            </span>
          </div>

          {/* Stepper bar */}
          <div className="grid grid-cols-4 gap-2 mt-5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s <= step ? 'bg-[#F5B400]' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Tell us about your business (§8) */}
        {step === 1 && (
          <div className="p-6 sm:p-8 space-y-5">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Tell Us About Your Business 🇰🇪</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Enter your details to configure your localized Kenyan currency, taxes, and county settings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Mama Njeri Supplies"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Owner / Manager Name *
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Mary Njeri Waweru"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone (WhatsApp / M-Pesa) *
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254 722 000 000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Business Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@business.co.ke"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  County (Kenya) *
                </label>
                <select
                  value={county}
                  onChange={(e) => setCounty(e.target.value as County)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] focus:border-transparent outline-none bg-white"
                >
                  {COUNTIES.map((c) => (
                    <option key={c} value={c}>
                      {c} County
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Business Type / Industry *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as BusinessCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] focus:border-transparent outline-none bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  KRA PIN (Optional - for Invoices)
                </label>
                <input
                  type="text"
                  value={kraPin}
                  onChange={(e) => setKraPin(e.target.value)}
                  placeholder="P051234567Z"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  M-Pesa Buy Goods Till / Paybill
                </label>
                <input
                  type="text"
                  value={mpesaTill}
                  onChange={(e) => setMpesaTill(e.target.value)}
                  placeholder="e.g. 892104"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-[#F5B400] hover:bg-[#d99f00] flex items-center gap-2 shadow"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Biggest challenges (§8) */}
        {step === 2 && (
          <div className="p-6 sm:p-8 space-y-5">
            <div>
              <h3 className="text-xl font-bold text-slate-900">What Are Your Biggest Challenges?</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Select all that apply. BizHubKE will customize your dashboard shortcuts and alerts.
              </p>
            </div>

            <div className="space-y-2.5">
              {CHALLENGES.map((ch) => {
                const isSelected = selectedChallenges.includes(ch.id);
                return (
                  <div
                    key={ch.id}
                    onClick={() => toggleChallenge(ch.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#0F7A4C] bg-[#E8F7EF] text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-medium">{ch.label}</span>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        isSelected
                          ? 'bg-[#0F7A4C] border-[#0F7A4C] text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-200">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-[#F5B400] hover:bg-[#d99f00] flex items-center gap-2 shadow"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Connect / Import Data (§8) */}
        {step === 3 && (
          <div className="p-6 sm:p-8 space-y-5">
            <div>
              <h3 className="text-xl font-bold text-slate-900">How would you like to start?</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Choose how to configure your initial Kenyan business workspace.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                id="onboarding-option-sample-data"
                onClick={() => !isSettingUpWorkspace && setImportSampleData(true)}
                className={`p-5 rounded-2xl border-2 transition-all space-y-2 ${
                  isSettingUpWorkspace ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                } ${
                  importSampleData
                    ? 'border-[#0F7A4C] bg-[#E8F7EF]'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#0F7A4C] text-white">
                    Recommended
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      importSampleData ? 'border-[#0F7A4C] bg-[#0F7A4C] text-white' : 'border-slate-300'
                    }`}
                  >
                    {importSampleData && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
                <h4 className="text-sm font-bold text-slate-900">Load Kenyan SME Sample Data</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Includes realistic Kenyan sales (Crown Paints, Bamburi Cement, M-Pesa receipts), expense logs, eTIMS VAT invoices, supplier balances, and WhatsApp CRM message templates.
                </p>
              </div>

              <div
                id="onboarding-option-blank-workspace"
                onClick={() => !isSettingUpWorkspace && setImportSampleData(false)}
                className={`p-5 rounded-2xl border-2 transition-all space-y-2 ${
                  isSettingUpWorkspace ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                } ${
                  !importSampleData
                    ? 'border-[#0F7A4C] bg-[#E8F7EF]'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Fresh Slate</span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      !importSampleData ? 'border-[#0F7A4C] bg-[#0F7A4C] text-white' : 'border-slate-300'
                    }`}
                  >
                    {!importSampleData && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
                <h4 className="text-sm font-bold text-slate-900">Start with Clean Blank Workspace</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Start with clean 0 KSh figures and enter your own real products, customers, and expenses from scratch.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0F7A4C] shrink-0" />
              <span>You can reset or edit data at any time from your Business Settings.</span>
            </div>

            {/* Error & Timeout Resilience Banner */}
            {setupError && (
              <div
                id="onboarding-step3-error-banner"
                className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-2.5"
              >
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-rose-900">Configuration Notice</p>
                    <p className="text-rose-700 leading-relaxed">{setupError}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleSetupStep3}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Retry Setup
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSetupError(null);
                      setStep(4);
                    }}
                    className="px-3.5 py-1.5 bg-white border border-rose-300 text-rose-800 hover:bg-rose-100 font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Proceed to Step 4 anyway →
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between border-t border-slate-200">
              <button
                type="button"
                disabled={isSettingUpWorkspace}
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                id="onboarding-step3-cta-btn"
                type="button"
                disabled={isSettingUpWorkspace}
                onClick={handleSetupStep3}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 flex items-center gap-2 shadow transition-all ${
                  isSettingUpWorkspace
                    ? 'bg-[#F5B400]/70 cursor-wait'
                    : 'bg-[#F5B400] hover:bg-[#d99f00] cursor-pointer'
                }`}
              >
                {isSettingUpWorkspace ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                    <span>Configuring your workspace...</span>
                  </>
                ) : (
                  <>
                    <span>Configure & Continue to Step 4</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Ready confirmation (§8) */}
        {step === 4 && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#E8F7EF] text-[#0F7A4C] flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">
                Your BizHubKE Business Dashboard is Ready! 🚀
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Karibu sana! <strong>{businessName}</strong> ({county} County) has been provisioned with your 7-day full access trial.
              </p>
            </div>

            <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Business:</span>
                <span className="font-bold text-slate-800">{businessName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Owner:</span>
                <span className="font-medium text-slate-800">{ownerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Currency:</span>
                <span className="font-bold text-[#0F7A4C]">Kenyan Shillings (KSh)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">KRA eTIMS Calendar:</span>
                <span className="font-medium text-emerald-600">Active</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="onboarding-launch-dashboard-btn"
                type="button"
                onClick={handleFinish}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-[#F5B400] hover:bg-[#d99f00] shadow-md transition-transform transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Launch My Business Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
