import React, { useState } from 'react';
import {
  Bell,
  Search,
  Plus,
  TrendingUp,
  Receipt,
  FileText,
  Sparkles,
  Menu,
  ChevronDown,
  AlertTriangle,
  RotateCcw,
  CreditCard,
} from 'lucide-react';
import { BusinessTenant } from '../../types';
import { formatKsh } from '../../services/api';

interface AppHeaderProps {
  tenant: BusinessTenant;
  onResetDemo: () => void;
  onOpenQuickSale: () => void;
  onOpenQuickExpense: () => void;
  onOpenQuickInvoice: () => void;
  onOpenBilling: () => void;
  onToggleMobileMenu: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  tenant,
  onResetDemo,
  onOpenQuickSale,
  onOpenQuickExpense,
  onOpenQuickInvoice,
  onOpenBilling,
  onToggleMobileMenu,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    {
      id: 'notif-1',
      title: 'Low Stock Alert: Dulux Paint 20L',
      detail: 'Only 4 left in godown (Min threshold: 8). Supplier: Crown Paints.',
      urgent: true,
      time: '10m ago',
    },
    {
      id: 'notif-2',
      title: 'KRA Monthly VAT Return Reminder',
      detail: 'Filing & eTIMS reconciliation due in 29 days (20th October).',
      urgent: false,
      time: '1h ago',
    },
    {
      id: 'notif-3',
      title: 'Overdue Invoice: Apex Plumbers',
      detail: 'INV-2026-0041 for KSh 25,288 is 2 days overdue.',
      urgent: true,
      time: 'Yesterday',
    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left: Mobile Toggle & Tenant Name */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">{tenant.name}</span>
              {tenant.isDemo && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F7EF] text-[#0F7A4C] border border-[#0F7A4C]/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Demo Tenant
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-500">
              {tenant.county} County • {tenant.category}
            </span>
          </div>
        </div>
      </div>

      {/* Center/Right: Quick Actions & Alerts */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Reset Demo button if on demo tenant */}
        {tenant.isDemo && (
          <button
            onClick={onResetDemo}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            title="Reset to original demo figures"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Demo Data
          </button>
        )}

        {/* Quick Action Buttons */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            id="quick-action-sale"
            onClick={onOpenQuickSale}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#0F7A4C] hover:bg-[#0b5e3a] rounded-xl shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Sale</span>
          </button>
          <button
            id="quick-action-expense"
            onClick={onOpenQuickExpense}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <Receipt className="w-3.5 h-3.5 text-slate-500" />
            <span>Expense</span>
          </button>
          <button
            id="quick-action-invoice"
            onClick={onOpenQuickInvoice}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Invoice</span>
          </button>
        </div>

        {/* Subscription / M-Pesa Status Pill */}
        <div
          onClick={onOpenBilling}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium cursor-pointer hover:bg-amber-100 transition-colors"
          title="Click to manage subscription & M-Pesa billing"
        >
          <CreditCard className="w-3.5 h-3.5 text-amber-700" />
          <span className="hidden sm:inline font-bold">Business Plan</span>
          <span className="text-[11px] text-amber-700 font-semibold">({tenant.trialDaysLeft}d trial)</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            id="header-notifications-btn"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 space-y-3 z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Notifications & Alerts
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  {notifications.length} Active
                </span>
              </div>

              <div className="space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl text-xs space-y-1 border ${
                      n.urgent
                        ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600">{n.detail}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setNotificationsOpen(false)}
                className="w-full py-1.5 text-center text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Close Alerts
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
