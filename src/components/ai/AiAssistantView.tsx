import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Copy,
  Check,
  HelpCircle,
  Lightbulb,
  ShieldAlert,
} from 'lucide-react';
import { askBizHubAi } from '../../services/api';
import { BusinessTenant } from '../../types';

interface AiAssistantViewProps {
  tenant: BusinessTenant;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const SAMPLE_QUERIES = [
  'How does KRA Turnover Tax (TOT) compare to VAT for a shop doing KSh 300,000/month?',
  'What are the best strategies to collect overdue customer Deni without losing customers?',
  'How do I onboard my small hardware shop onto KRA eTIMS?',
  'Tips for negotiating 30-day supplier credit with wholesale distributors in Nairobi',
  'How to run a high-converting WhatsApp flash sale for my retail boutique',
];

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({ tenant }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'assistant',
      text: `Habari ${tenant.ownerName}! I am your BizHubKE AI Business Advisor. I can answer questions on Kenyan tax compliance (eTIMS, VAT, TOT), M-Pesa till reconciliation, debt collection, marketing, and SME expansion across Kenya's 47 counties. How can I assist ${tenant.name} today?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSend = async (queryToSend?: string) => {
    const text = queryToSend || inputText;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryToSend) setInputText('');
    setLoading(true);

    try {
      const response = await askBizHubAi(
        text,
        `Business Name: ${tenant.name}, County: ${tenant.county}, Category: ${tenant.category}, Monthly Sales: ${tenant.monthlySalesRange}`
      );

      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Samahani, I encountered a temporary connection glitch. Please check your network or try asking again.',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header (§24) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Bot className="w-6 h-6 text-[#0F7A4C]" /> Ask BizHub AI Business Advisor
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kenyan regulatory intelligence, financial guidance, and growth strategies for your SME.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#0F7A4C] text-xs font-bold border border-emerald-200 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#F5B400]" /> Gemini 2.5 Active
          </span>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-[#F5B400]" /> Quick Questions Kenyan Business Owners Ask:
        </span>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-50 hover:bg-[#E8F7EF] hover:text-[#0F7A4C] text-slate-700 border border-slate-200 transition-colors text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Conversation Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[520px]">
        {/* Messages Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser ? 'bg-[#0B2440] text-white' : 'bg-[#0F7A4C] text-[#F5B400]'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm space-y-2 leading-relaxed ${
                    isUser
                      ? 'bg-[#0B2440] text-white rounded-tr-none'
                      : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  <p>{m.text}</p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                    <span>{m.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(m.id, m.text)}
                        className="hover:text-slate-700 flex items-center gap-1 font-semibold"
                      >
                        {copiedId === m.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3 text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl max-w-sm">
              <Bot className="w-4 h-4 text-[#0F7A4C] animate-spin" />
              <span>Analyzing Kenyan tax code & SME database...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything (e.g. 'How do I register an eTIMS account on KRA?')..."
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none bg-white"
            />
            <button
              id="ai-send-btn"
              type="submit"
              disabled={loading || !inputText.trim()}
              className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-[#F5B400] hover:bg-[#d99f00] disabled:opacity-50 flex items-center gap-1.5 shadow"
            >
              <Send className="w-4 h-4" />
              <span>Ask</span>
            </button>
          </form>
          <p className="text-[10px] text-slate-400 mt-2 text-center">
            AI advice is for general guidance. Always consult a certified Kenyan tax agent or CPA for statutory filings.
          </p>
        </div>
      </div>
    </div>
  );
};
