import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  LogIn,
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenDemo: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenDemo,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', id: 'hero' },
    { label: 'Features', id: 'features' },
    { label: 'Solutions', id: 'solutions' },
    { label: 'News', id: 'news' },
    { label: 'Training', id: 'training' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B2440] text-white border-b border-slate-800/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with Kenyan motif */}
          <div
            id="brand-logo-btn"
            onClick={() => onNavigateSection('hero')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F7A4C] to-[#0b5e3a] p-2 flex items-center justify-center shadow-md relative overflow-hidden border border-[#18985e]/40">
              <TrendingUp className="w-6 h-6 text-[#F5B400] transition-transform group-hover:scale-110" />
              {/* Subtle Kenyan flag strip accent at top of logo badge */}
              <div className="absolute top-0 left-0 right-0 h-1 flex">
                <div className="flex-1 bg-black"></div>
                <div className="flex-1 bg-red-600"></div>
                <div className="flex-1 bg-[#0F7A4C]"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold tracking-tight text-white">
                  BizHub<span className="text-[#F5B400]">KE</span>
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#0F7A4C]/40 text-emerald-300 border border-[#0F7A4C]/60 tracking-wider">
                  Kenya
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Grow • Manage • Succeed
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1.5 text-sm font-medium text-slate-200">
            {navLinks.map((link) => (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => onNavigateSection(link.id)}
                className="px-3.5 py-2 rounded-lg hover:text-[#F5B400] hover:bg-white/5 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              id="header-login-btn"
              onClick={() => onOpenAuth('login')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-200 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <LogIn className="w-4 h-4 text-slate-300" />
              Login
            </button>
            <button
              id="header-demo-btn"
              onClick={onOpenDemo}
              className="px-4 py-2 text-sm font-medium text-emerald-300 bg-[#0F7A4C]/25 border border-[#0F7A4C]/50 hover:bg-[#0F7A4C]/40 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F5B400]" />
              Live Demo
            </button>
            <button
              id="header-get-started-btn"
              onClick={() => onOpenAuth('signup')}
              className="px-5 py-2.5 text-sm font-bold text-slate-950 bg-[#F5B400] hover:bg-[#d99f00] rounded-xl shadow-md transition-all transform hover:-translate-y-0.5"
            >
              Get Started Free
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              id="mobile-demo-btn"
              onClick={onOpenDemo}
              className="px-2.5 py-1.5 text-xs font-semibold text-emerald-300 bg-[#0F7A4C]/30 rounded-lg border border-[#0F7A4C]/50"
            >
              Demo
            </button>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#061628] px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigateSection(link.id);
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-sm font-medium text-slate-300 hover:text-[#F5B400] rounded-lg hover:bg-white/5"
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2.5">
            <button
              onClick={() => {
                onOpenAuth('login');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-sm font-semibold text-slate-200 border border-slate-700 rounded-xl hover:bg-white/5"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                onOpenAuth('signup');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-sm font-bold text-slate-950 bg-[#F5B400] rounded-xl text-center"
            >
              Start Free Trial (7 Days)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export const Footer: React.FC<{ onNavigateSection: (id: string) => void; onOpenDemo: () => void }> = ({
  onNavigateSection,
  onOpenDemo,
}) => {
  return (
    <footer className="bg-[#0B2440] text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F7A4C] to-[#0b5e3a] p-2 flex items-center justify-center border border-[#18985e]/40">
                <TrendingUp className="w-6 h-6 text-[#F5B400]" />
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight text-white">
                  BizHub<span className="text-[#F5B400]">KE</span>
                </span>
                <p className="text-xs text-slate-400">The Digital Business Partner for Kenyan SMEs</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Run your business. Understand your numbers. Get more customers. Stay compliant. Grow. Tailored specifically for Kenyan retail, wholesale, contractors, dukas, and growing enterprises.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#0F7A4C]/25 text-emerald-300 border border-[#0F7A4C]/50">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F5B400]" />
                Kenyan SME Compliant
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-300">
                Lipa Na M-Pesa Ready
              </span>
            </div>
          </div>

          {/* Col 2: Platform */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><button onClick={() => onNavigateSection('features')} className="hover:text-[#F5B400] transition-colors">Finance & Invoicing</button></li>
              <li><button onClick={() => onNavigateSection('features')} className="hover:text-[#F5B400] transition-colors">WhatsApp CRM</button></li>
              <li><button onClick={() => onNavigateSection('features')} className="hover:text-[#F5B400] transition-colors">Inventory Management</button></li>
              <li><button onClick={() => onNavigateSection('features')} className="hover:text-[#F5B400] transition-colors">eTIMS & Tax Compliance</button></li>
              <li><button onClick={onOpenDemo} className="text-emerald-400 hover:underline">Interactive Demo</button></li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Knowledge</h4>
            <ul className="space-y-2.5 text-sm">
              <li><button onClick={() => onNavigateSection('news')} className="hover:text-[#F5B400] transition-colors">Kenya Business News</button></li>
              <li><button onClick={() => onNavigateSection('training')} className="hover:text-[#F5B400] transition-colors">BizHubKE Academy</button></li>
              <li><button onClick={() => onNavigateSection('solutions')} className="hover:text-[#F5B400] transition-colors">Opportunities & Grants</button></li>
              <li><button onClick={() => onNavigateSection('pricing')} className="hover:text-[#F5B400] transition-colors">Pricing & Plans</button></li>
            </ul>
          </div>

          {/* Col 4: Contact & Local Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Support</h4>
            <p className="text-sm text-slate-400 mb-2">Dedicated Kenyan business support:</p>
            <a
              href="mailto:support@bizhubke.online"
              className="text-sm font-semibold text-white hover:text-[#F5B400] transition-colors block"
            >
              support@bizhubke.online
            </a>
            <a
              href="https://wa.me/254740807650?text=Habari%20BizHubKE%20Support!%20I%20need%20help%20with%20my%20business%20account."
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors block mt-1 font-semibold"
            >
              WhatsApp: +254 740 807 650
            </a>
            <p className="text-xs text-slate-400 mt-2">Nairobi CBD, Kenya</p>
          </div>
        </div>

        {/* Legal & Regulatory Mandatory Disclaimer (§6, §20) */}
        <div className="pt-8 text-xs text-slate-400 space-y-2">
          <p className="bg-white/5 p-3.5 rounded-xl border border-white/10 text-slate-300">
            <strong className="text-white">Legal & Tax Disclaimer:</strong> BizHubKE provides business information, automated bookkeeping workflows, and administrative productivity tools. BizHubKE does not provide licensed tax, legal, or certified public accounting advice. Please verify specific tax liabilities and filing obligations directly with the Kenya Revenue Authority (KRA), County Governments, or certified professionals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} BizHubKE Technologies Ltd. All rights reserved. Made with ❤️ for Kenyan SMEs.</p>
            <div className="flex items-center gap-4">
              <span className="hover:underline cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">eTIMS Compliance Notice</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
