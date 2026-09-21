import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Receipt,
  FileText,
  Users,
  MessageSquare,
  Package,
  Truck,
  ShieldCheck,
  Newspaper,
  GraduationCap,
  Gift,
  Bot,
  Megaphone,
  BarChart3,
  CreditCard,
  Settings,
  ShieldAlert,
  ChevronRight,
  LogOut,
  Sparkles,
  Compass,
} from 'lucide-react';
import { BusinessTenant } from '../../types';

export type AppView =
  | 'dashboard'
  | 'sales'
  | 'expenses'
  | 'invoices'
  | 'customers'
  | 'whatsapp'
  | 'inventory'
  | 'suppliers'
  | 'compliance'
  | 'hub'
  | 'news'
  | 'training'
  | 'opportunities'
  | 'ai'
  | 'marketing'
  | 'score'
  | 'analytics'
  | 'billing'
  | 'admin';

interface AppSidebarProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  tenant: BusinessTenant;
  onExitToWebsite: () => void;
  isAdmin?: boolean;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentView,
  onSelectView,
  tenant,
  onExitToWebsite,
  isAdmin = false,
}) => {
  const mainNavItems: { id: AppView; label: string; icon: any; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sales', label: 'Sales', icon: TrendingUp },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'customers', label: 'Customers CRM', icon: Users },
    { id: 'whatsapp', label: 'WhatsApp CRM', icon: MessageSquare, badge: 'API' },
    { id: 'inventory', label: 'Inventory & Stock', icon: Package },
    { id: 'suppliers', label: 'Suppliers', icon: Truck },
    { id: 'compliance', label: 'Compliance Centre', icon: ShieldCheck, badge: 'KRA' },
    { id: 'hub', label: 'Business Hub', icon: Compass, badge: 'Gov' },
    { id: 'score', label: 'My Business Score', icon: BarChart3, badge: `${tenant.score}%` },
    { id: 'ai', label: 'Ask BizHub AI', icon: Bot, badge: 'AI' },
    { id: 'marketing', label: 'Marketing Centre', icon: Megaphone },
    { id: 'news', label: 'Business News', icon: Newspaper },
    { id: 'training', label: 'BizHub Academy', icon: GraduationCap },
    { id: 'opportunities', label: 'Opportunities Hub', icon: Gift },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'billing', label: 'Subscription & Plans', icon: CreditCard },
  ];

  return (
    <aside className="w-64 bg-[#0B2440] text-slate-300 flex flex-col shrink-0 border-r border-slate-800 h-screen sticky top-0 overflow-y-auto">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div
          onClick={onExitToWebsite}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="Return to Public Website"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0F7A4C] to-[#0b5e3a] p-2 flex items-center justify-center border border-[#18985e]/40 shadow">
            <TrendingUp className="w-5 h-5 text-[#F5B400]" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-white tracking-tight">
                BizHub<span className="text-[#F5B400]">KE</span>
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#0F7A4C] text-white">
                SME
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Digital Business Partner</p>
          </div>
        </div>
      </div>

      {/* Tenant Indicator Box */}
      <div className="p-3 mx-3 mt-3 rounded-xl bg-slate-900/90 border border-slate-700/60">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-[#F5B400] tracking-wider">
            {tenant.isDemo ? 'Demo Workspace' : 'Active Account'}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-semibold">
            {tenant.plan}
          </span>
        </div>
        <h4 className="text-xs font-bold text-white truncate mt-0.5">{tenant.name}</h4>
        <p className="text-[10px] text-slate-400 truncate">
          {tenant.county} • Till: {tenant.mpesaTill || 'Not set'}
        </p>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 text-xs">
        <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Operations
        </div>
        {mainNavItems.slice(0, 10).map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}`}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
                isActive
                  ? 'bg-[#0F7A4C] text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#F5B400]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-black/25 text-[#F5B400]'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="px-2 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Growth & AI Tools
        </div>
        {mainNavItems.slice(10).map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}`}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
                isActive
                  ? 'bg-[#0F7A4C] text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#F5B400]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-black/25 text-[#F5B400]'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Admin Section (§30) */}
        <div className="px-2 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Platform Admin
        </div>
        <button
          id="sidebar-nav-admin"
          onClick={() => onSelectView('admin')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
            currentView === 'admin'
              ? 'bg-amber-600 text-white font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-[#F5B400]" />
            <span>Admin Dashboard</span>
          </div>
          <span className="text-[9px] bg-amber-900/60 text-amber-300 px-1.5 py-0.5 rounded font-bold">
            HQ
          </span>
        </button>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        <button
          onClick={onExitToWebsite}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Exit to Public Website
        </button>
      </div>
    </aside>
  );
};
