import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  DollarSign,
  FileCheck,
  Server,
  Activity,
  MapPin,
  Building2,
  TrendingUp,
  CheckCircle2,
  Send,
  Sparkles,
} from 'lucide-react';
import { formatKsh } from '../../services/api';

export const AdminDashboardView: React.FC = () => {
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const stats = [
    { label: 'Registered Kenyan SMEs', value: '14,280', change: '+240 this week', icon: Users },
    { label: 'Monthly Recurring Revenue (MRR)', value: 'KSh 41,200,000', change: '+18.4% MoM', icon: DollarSign },
    { label: 'Active Paid Subscriptions', value: '11,840', change: '82.9% conversion', icon: TrendingUp },
    { label: 'eTIMS Invoices Synced', value: '842,000+', change: 'KRA Realtime', icon: FileCheck },
  ];

  const counties = [
    { name: 'Nairobi', count: 5997, pct: 42 },
    { name: 'Kiambu', count: 2570, pct: 18 },
    { name: 'Mombasa', count: 1713, pct: 12 },
    { name: 'Nakuru', count: 1285, pct: 9 },
    { name: 'Kisumu & Western', count: 1428, pct: 10 },
    { name: 'Other Counties', count: 1287, pct: 9 },
  ];

  const recentTenants = [
    { id: '1', name: 'Baraka Super Duka', county: 'Nakuru', plan: 'Business', date: '10m ago' },
    { id: '2', name: 'Kilifi Coast Agrovets', county: 'Kilifi', plan: 'Starter', date: '35m ago' },
    { id: '3', name: 'Muthaiga Auto Spares', county: 'Nairobi', plan: 'Business', date: '1h ago' },
    { id: '4', name: 'Eldoret Grain Millers', county: 'Uasin Gishu', plan: 'Enterprise', date: '2h ago' },
  ];

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastMsg('');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header (§30) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0B2440] text-white p-5 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">BizHubKE Platform Admin</span>
            <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded uppercase">
              Super Admin
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Realtime multi-tenant monitoring, revenue metrics, and KRA eTIMS gateway status across Kenya.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            All Systems Healthy
          </span>
        </div>
      </div>

      {/* 4 Core Platform Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>{s.label}</span>
                <Icon className="w-4 h-4 text-[#0F7A4C]" />
              </div>
              <div className="text-xl font-extrabold text-slate-900">{s.value}</div>
              <div className="text-[11px] text-emerald-600 font-semibold">{s.change}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: County Breakdown (§30) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#0F7A4C]" /> SME Distribution Across Kenya's 47 Counties
          </h3>

          <div className="space-y-3">
            {counties.map((c) => (
              <div key={c.name} className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span className="font-semibold">{c.name} County</span>
                  <span className="font-bold">
                    {c.count.toLocaleString()} SMEs ({c.pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#0F7A4C] h-full" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Infrastructure Status & Broadcast */}
        <div className="lg:col-span-6 space-y-6">
          {/* Service Integrations Health */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-slate-600" /> Gateway Connections
            </h3>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Safaricom Daraja</span>
                <span className="font-bold text-emerald-600">99.98% Up</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">KRA eTIMS API</span>
                <span className="font-bold text-emerald-600">Connected</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">WhatsApp Cloud</span>
                <span className="font-bold text-emerald-600">Active</span>
              </div>
            </div>
          </div>

          {/* Broadcast to all tenants */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-[#0F7A4C]" /> Broadcast In-App Notice to All Businesses
            </h3>

            <form onSubmit={handleBroadcast} className="space-y-3 text-xs">
              <input
                type="text"
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                placeholder="e.g. KRA system maintenance scheduled tonight from 11 PM to 2 AM..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none"
              />
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400">Pushes to 14,280 active tenant dashboards</span>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0F7A4C] hover:bg-[#0b5e3a]"
                >
                  {broadcastSent ? 'Broadcast Dispatched!' : 'Send Broadcast'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Recent Business Signups */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900">Recent Kenyan SME Signups</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="pb-2">Business Name</th>
                <th className="pb-2">County</th>
                <th className="pb-2">Subscribed Plan</th>
                <th className="pb-2">Time</th>
                <th className="pb-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTenants.map((t) => (
                <tr key={t.id}>
                  <td className="py-2.5 font-bold text-slate-800">{t.name}</td>
                  <td className="py-2.5 text-slate-600">{t.county} County</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F7EF] text-[#0F7A4C]">
                      {t.plan}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-400">{t.date}</td>
                  <td className="py-2.5 text-right font-semibold text-emerald-600">Active (Trial)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
