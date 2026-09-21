import React, { useState } from 'react';
import {
  Gift,
  Search,
  ExternalLink,
  Building2,
  Calendar,
  CheckCircle2,
  DollarSign,
  Tag,
  Briefcase,
} from 'lucide-react';
import { Opportunity } from '../../types';
import { formatKsh } from '../../services/api';

interface OpportunitiesViewProps {
  opportunities: Opportunity[];
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({ opportunities }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  const filteredOpportunities = opportunities.filter((op) => {
    const matchesSearch =
      op.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || op.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header (§26) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Gift className="w-6 h-6 text-[#F5B400]" /> Kenya Opportunities & Funding Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Verified tenders (AGPO), SME expansion grants, low-interest bank credit, and acceleration programs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
            {opportunities.length} Active Opportunities
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tenders, grants or loans..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F7A4C] outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs">
          {(['All', 'Tender', 'Grant', 'Loan', 'Program'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                typeFilter === t
                  ? 'bg-[#0B2440] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}s
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOpportunities.map((op) => (
          <div
            key={op.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#0F7A4C] transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    op.type === 'Grant'
                      ? 'bg-emerald-100 text-emerald-900'
                      : op.type === 'Tender'
                      ? 'bg-blue-100 text-blue-900'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {op.type}
                </span>
                <span className="text-slate-400 text-[11px] font-medium">Deadline: {op.deadline}</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{op.title}</h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">By: {op.organization}</p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{op.description}</p>

              {op.amount && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-[#0F7A4C]" />
                  <span>Value / Grant Size: {op.amount}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Verified by BizHubKE</span>
              <a
                href={op.link}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#0F7A4C] hover:bg-[#E8F7EF] flex items-center gap-1 transition-colors"
              >
                <span>Apply / View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
