import React, { useState } from 'react';
import {
  Megaphone,
  Sparkles,
  Send,
  Copy,
  Check,
  Share2,
  Tag,
  MessageSquare,
  Smartphone,
  Facebook,
  Instagram,
} from 'lucide-react';
import { generateMarketingContent, openWhatsAppChat } from '../../services/api';
import { BusinessTenant } from '../../types';

interface MarketingCentreViewProps {
  tenant: BusinessTenant;
}

export const MarketingCentreView: React.FC<MarketingCentreViewProps> = ({ tenant }) => {
  const [platform, setPlatform] = useState<'WhatsApp' | 'Facebook' | 'Instagram' | 'SMS'>('WhatsApp');
  const [topic, setTopic] = useState('Weekend flash clearance on building materials and paint');
  const [targetAudience, setTargetAudience] = useState('Home builders and local contractors');
  const [tone, setTone] = useState<'Sheng' | 'Professional' | 'Urgent' | 'Festive'>('Sheng');
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>(
    `Habari wakuu! 🔥 Massive Weekend Deal at ${tenant.name}!\n\nBei imeshuka! Tunawaletea top quality products with crazy discounts up to 20% off. Usipitwe kabisa.\n\n📍 Visit our store in ${tenant.county} County\n📲 Lipa Na M-Pesa Buy Goods Till: *${tenant.mpesaTill || '892104'}*\n📞 Piga simu / WhatsApp: ${tenant.phone}\n\nKaribuni sana tuchape biashara! 🇰🇪`
  );
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || loading) return;

    setLoading(true);
    try {
      const res = await generateMarketingContent(
        platform,
        topic,
        targetAudience,
        tone,
        tenant.name,
        tenant.county
      );
      setGeneratedContent(res.content);
    } catch (err) {
      // Fallback generator
      setGeneratedContent(
        `Habari! Special offer at ${tenant.name} (${tenant.county})! Enjoy unbeatable rates today. Settle conveniently via M-Pesa Till: ${tenant.mpesaTill || '892104'}. Contact us on ${tenant.phone}. Karibu sana!`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    openWhatsAppChat('+254700000000', generatedContent);
  };

  return (
    <div className="space-y-6">
      {/* Header (§25) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-[#0F7A4C]" /> Marketing Centre & Content Creator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Generate high-converting Kenyan social captions, WhatsApp promo blasts, and SMS campaigns in seconds.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Settings */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px]">
            Campaign Configuration
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4 text-xs">
            {/* Platform */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Channel</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['WhatsApp', 'Facebook', 'Instagram', 'SMS'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlatform(p)}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all text-center ${
                      platform === p
                        ? 'border-[#0F7A4C] bg-[#E8F7EF] text-[#0F7A4C]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selector */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Copywriting Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium outline-none bg-white"
              >
                <option value="Sheng">Kenyan Sheng / Swahili-English Blend (High Engagement)</option>
                <option value="Professional">Polished Corporate / B2B</option>
                <option value="Urgent">Flash Sale / FOMO (Hurry While Stocks Last)</option>
                <option value="Festive">Holiday Greeting & Celebration</option>
              </select>
            </div>

            {/* Topic / Promotion */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Product / Promotion Focus *</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. End of month paint sale, buy 3 get 1 roller free"
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none"
                required
              />
            </div>

            {/* Target Audience */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Local plumbers, homeowners, boda boda operators"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none"
              />
            </div>

            <button
              id="generate-copy-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-[#F5B400] hover:bg-[#d99f00] flex items-center justify-center gap-2 shadow transition-transform transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? 'Crafting Viral Kenyan Copy...' : 'Generate Marketing Copy'}
            </button>
          </form>
        </div>

        {/* Right Column: Output & Actions */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Generated Ad / Social Copy</h3>
              <p className="text-[11px] text-slate-500">Channel: {platform} • Tone: {tone}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 flex items-center gap-1 shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 min-h-[220px]">
            <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed font-sans">
              {generatedContent}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#E8F7EF] border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
            <span>💡 Pro Tip: Post this to your WhatsApp Status at 8:00 AM or 5:30 PM for maximum views in Kenya.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
