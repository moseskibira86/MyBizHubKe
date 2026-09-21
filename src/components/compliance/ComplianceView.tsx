import React, { useState } from 'react';
import {
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
  Info,
  Building2,
  FileCheck,
  Check,
  Bot,
  Send,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { ComplianceTask } from '../../types';
import { askGeminiAdvisor } from '../../services/api';

interface ComplianceViewProps {
  tasks: ComplianceTask[];
  onToggleTask: (id: string) => void;
}

export const ComplianceView: React.FC<ComplianceViewProps> = ({ tasks, onToggleTask }) => {
  const [authorityFilter, setAuthorityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Completed'>('All');

  // Compliance Assistant AI Agent State (§25)
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const compliancePresets = [
    'Explain eTIMS requirements for my duka or retail shop',
    'When is KRA VAT due and what is the penalty for late filing?',
    'What is Turnover Tax (TOT) rate in Kenya and who qualifies?',
    'What statutory deductions are due on the 9th of every month?',
  ];

  const handleAskCompliance = async (queryText?: string) => {
    const q = queryText || aiQuestion;
    if (!q.trim()) return;

    setAiLoading(true);
    setAiResponse(null);
    try {
      const prompt = `You are the BizHubKE Compliance Assistant, specialized in Kenyan business compliance, taxation, and statutory laws.
Question: "${q}"

Provide practical, clear, structured guidance for a Kenyan business owner.
Include:
1. Short direct answer.
2. Official rule / law (e.g. Finance Act, VAT Act, Employment Act).
3. Relevant deadline or penalty.
4. Official portal where action is taken (e.g. itax.kra.go.ke, etims.kra.go.ke).
Always end with this exact disclaimer: "Note: BizHubKE provides informational compliance tools. This does not constitute legal or licensed CPA-K tax advice. Verify obligations with KRA directly."`;

      const res = await askGeminiAdvisor(prompt);
      setAiResponse(res.answer);
    } catch (e) {
      setAiResponse(
        'In Kenya, VAT is due on the 20th of every month via iTax, while PAYE, NSSF, and SHA/SHIF are due on the 9th. All commercial invoices must comply with KRA eTIMS guidelines. Please verify filings directly at itax.kra.go.ke.\n\nNote: BizHubKE provides informational compliance tools. This does not constitute legal or licensed CPA-K tax advice.'
      );
    } finally {
      setAiLoading(false);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesAuth = authorityFilter === 'All' || t.authority.includes(authorityFilter);
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Completed' && t.status === 'Completed') ||
      (statusFilter === 'Pending' && t.status !== 'Completed');
    return matchesAuth && matchesStatus;
  });

  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="space-y-6">
      {/* Header & Overall Status (§20) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#0F7A4C]" /> Kenya Compliance Centre & Deadlines
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Never miss KRA VAT, eTIMS, PAYE, NSSF, SHA, or County Business Permit deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-[#0F7A4C] border border-[#0F7A4C]/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>{completedCount} / {tasks.length} Completed</span>
          </span>
        </div>
      </div>

      {/* Mandatory Disclaimer Callout (§20) */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">Important Regulatory Advisory:</span>
          <p className="leading-relaxed">
            "BizHubKE provides compliance tracking, reminders, and educational information for business management purposes. It is not an authorized tax agent, legal advisor, or government body. Consult a qualified certified public accountant (CPA-K) or visit the relevant authority portal (e.g. itax.kra.go.ke) for binding statutory guidance."
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs">
          <span className="text-slate-500 font-semibold mr-1">Status:</span>
          {(['All', 'Pending', 'Completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-[#0B2440] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs">
          <span className="text-slate-500 font-semibold mr-1">Authority:</span>
          {['All', 'KRA', 'NSSF', 'SHA', 'County'].map((auth) => (
            <button
              key={auth}
              onClick={() => setAuthorityFilter(auth)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                authorityFilter === auth
                  ? 'bg-[#0F7A4C] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {auth}
            </button>
          ))}
        </div>
      </div>

      {/* Compliance Task Cards */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const isDone = task.status === 'Completed';
          return (
            <div
              key={task.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDone
                  ? 'bg-slate-50/70 border-slate-200 opacity-80'
                  : task.dueInDays < 20
                  ? 'bg-white border-amber-300 shadow-sm'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0B2440] text-white">
                    {task.authority}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">Due: {task.dueDate}</span>
                  {!isDone && (
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        task.dueInDays < 15
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {task.dueInDays} days left
                    </span>
                  )}
                </div>

                <h3 className={`text-base font-bold ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                  {task.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{task.description}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => onToggleTask(task.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isDone
                      ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      : 'bg-[#0F7A4C] text-white hover:bg-[#0b5e3a] shadow-sm'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{isDone ? 'Mark Pending' : 'Mark as Filed'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compliance Assistant AI Agent (§25) */}
      <div className="bg-gradient-to-br from-[#0B2440] to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0F7A4C] flex items-center justify-center text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white">AI Compliance Assistant</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F5B400] text-slate-950">
                  Gemini Grounded
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Ask specific questions regarding KRA tax codes, eTIMS rules, or statutory filing requirements.
              </p>
            </div>
          </div>
        </div>

        {/* Preset Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {compliancePresets.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                setAiQuestion(chip);
                handleAskCompliance(chip);
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-slate-200 transition-colors text-left"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskCompliance();
          }}
          className="flex gap-2 pt-2"
        >
          <input
            type="text"
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            placeholder="e.g., How do I register for eTIMS if I don't have a desktop computer?"
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#0F7A4C]"
          />
          <button
            type="submit"
            disabled={aiLoading || !aiQuestion.trim()}
            className="px-5 py-2.5 rounded-xl bg-[#0F7A4C] hover:bg-[#0b5e3a] disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 shrink-0"
          >
            {aiLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" /> Ask Assistant
              </>
            )}
          </button>
        </form>

        {/* AI Answer Display */}
        {aiResponse && (
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-slate-200 space-y-2 whitespace-pre-line animate-fadeIn">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Compliance Advisor Guidance:
            </div>
            <div className="leading-relaxed text-slate-200">{aiResponse}</div>
          </div>
        )}
      </div>

      {/* Guide Links */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Official Kenya Government Portals
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <a
            href="https://itax.kra.go.ke"
            target="_blank"
            rel="noreferrer"
            className="p-3 bg-white rounded-xl border border-slate-200 hover:border-[#0F7A4C] text-slate-800 font-semibold flex items-center justify-between"
          >
            <span>KRA iTax & eTIMS Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
          <a
            href="https://www.nssf.or.ke"
            target="_blank"
            rel="noreferrer"
            className="p-3 bg-white rounded-xl border border-slate-200 hover:border-[#0F7A4C] text-slate-800 font-semibold flex items-center justify-between"
          >
            <span>NSSF Employer Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
          <a
            href="https://sha.go.ke"
            target="_blank"
            rel="noreferrer"
            className="p-3 bg-white rounded-xl border border-slate-200 hover:border-[#0F7A4C] text-slate-800 font-semibold flex items-center justify-between"
          >
            <span>Social Health Authority (SHA)</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
