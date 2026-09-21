import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Users,
  Copy,
  Check,
  Phone,
  Store,
  CreditCard,
  Tag,
} from 'lucide-react';
import { Customer, BusinessTenant } from '../../types';
import { openWhatsAppChat, formatKsh } from '../../services/api';

interface WhatsAppCrmViewProps {
  customers: Customer[];
  tenant: BusinessTenant;
}

interface Template {
  id: string;
  name: string;
  category: 'Enquiry' | 'Order' | 'Payment' | 'ThankYou' | 'Review' | 'Repeat' | 'Promo' | 'Birthday';
  templateText: string;
}

const TEMPLATES: Template[] = [
  {
    id: 't-enquiry',
    name: '1. New Enquiry Response',
    category: 'Enquiry',
    templateText: `Habari {CustomerName}! 👋\n\nThank you for reaching out to *{BusinessName}*! We received your enquiry. How can we assist you with our catalog and wholesale pricing today?\n\n📍 Location: {County} County\n📲 M-Pesa Till: {TillNumber}`,
  },
  {
    id: 't-order-confirm',
    name: '2. Order Confirmation',
    category: 'Order',
    templateText: `Habari {CustomerName}! ✅\n\nYour order with *{BusinessName}* has been confirmed and packed! Total amount: *{Amount}*.\n\nKindly pay via M-Pesa Buy Goods Till: *{TillNumber}*.\n\nWe will dispatch your package immediately upon payment. Asante sana!`,
  },
  {
    id: 't-payment',
    name: '3. Polite Payment Reminder ("Deni / Invoice")',
    category: 'Payment',
    templateText: `Habari {CustomerName},\n\nThis is a friendly reminder from *{BusinessName}* regarding your pending balance of *{Amount}*.\n\nKindly settle via our Lipa Na M-Pesa Buy Goods Till: *{TillNumber}*.\n\nThank you for your continued partnership!`,
  },
  {
    id: 't-thanks',
    name: '4. Post-Purchase Thank You Note',
    category: 'ThankYou',
    templateText: `Habari {CustomerName}! 🙏\n\nThank you for shopping with *{BusinessName}* today. We truly appreciate your patronage. Please let us know if everything met your expectations. Looking forward to serving you again soon!`,
  },
  {
    id: 't-review',
    name: '5. Customer Review / Feedback Request',
    category: 'Review',
    templateText: `Habari {CustomerName}! ⭐\n\nWe hope you are enjoying your recent purchase from *{BusinessName}*! How was your experience with our team? Your feedback helps us serve you even better. Reply to this chat with any comments or questions.\n\nAsante sana!`,
  },
  {
    id: 't-repeat',
    name: '6. Repeat-Purchase Restock Reminder',
    category: 'Repeat',
    templateText: `Habari {CustomerName}! 🔄\n\nChecking in from *{BusinessName}*! It has been a little while since your last order. Are you running low on supplies? We have fresh stock ready with fast delivery to your premises.\n\nKaribu sana!`,
  },
  {
    id: 't-promo',
    name: '7. Promotion & Weekend Special Offer',
    category: 'Promo',
    templateText: `Habari {CustomerName}! 🎉\n\nExclusive Special Offer at *{BusinessName}*! Enjoy special discounted pricing on selected inventory this week.\n\nPay conveniently with M-Pesa Till *{TillNumber}*. Don't miss out!\n\nAsante sana!`,
  },
  {
    id: 't-birthday',
    name: '8. Birthday & Special Greeting',
    category: 'Birthday',
    templateText: `Heri ya Siku ya Kuzaliwa {CustomerName}! 🎂🎉\n\nEveryone at *{BusinessName}* wishes you joy, health, and great prosperity today! As our valued customer, enjoy an exclusive 10% discount on your next purchase this month.\n\nWarm regards,\n*{BusinessName} Team*`,
  },
];

export const WhatsAppCrmView: React.FC<WhatsAppCrmViewProps> = ({ customers, tenant }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(TEMPLATES[0]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    customers.length > 0 ? customers[0] : null
  );
  const [customPhone, setCustomPhone] = useState('+254 722 000 000');
  const [customAmount, setCustomAmount] = useState('KSh 15,000');
  const [copied, setCopied] = useState(false);

  // Variable replacement
  const customerName = selectedCustomer ? selectedCustomer.name : 'Esteemed Customer';
  const customerPhone = selectedCustomer ? selectedCustomer.phone : customPhone;

  const generatedMessage = selectedTemplate.templateText
    .replace(/{CustomerName}/g, customerName)
    .replace(/{BusinessName}/g, tenant.name)
    .replace(/{TillNumber}/g, tenant.mpesaTill || '892104')
    .replace(/{Amount}/g, selectedCustomer && selectedCustomer.outstandingDeni ? formatKsh(selectedCustomer.outstandingDeni) : customAmount)
    .replace(/{County}/g, tenant.county);

  const handleSend = () => {
    openWhatsAppChat(customerPhone, generatedMessage);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header (§17) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-600" /> WhatsApp CRM & Campaigns
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Turn WhatsApp into your primary Kenyan sales and repeat-order conversion machine.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            ● WhatsApp Web & Mobile Ready
          </span>
        </div>
      </div>

      {/* Plan Gating Advisory Notice (§17) */}
      {(tenant.plan === 'Free' || tenant.plan === 'Starter') && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="space-y-0.5">
            <strong className="font-bold flex items-center gap-1.5 text-amber-950">
              <Sparkles className="w-4 h-4 text-amber-600" /> Plan Notice: WhatsApp CRM Automated Broadcasts
            </strong>
            <p className="text-amber-800">
              Full WhatsApp CRM campaigns & broadcast templates require the <strong>Business Plan (KSh 999/mo)</strong> or above. On the {tenant.plan} tier, you can test individual single-customer wa.me deep links.
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-200/80 text-amber-950 font-bold rounded-lg shrink-0 text-center">
            {tenant.plan} Tier Active
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Template Selection */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              1. Choose Pre-Built SME Template
            </h3>

            <div className="space-y-2">
              {TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedTemplate.id === tpl.id
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{tpl.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                      {tpl.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {tpl.templateText.slice(0, 75)}...
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recipient Selection */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              2. Select Recipient Customer
            </h3>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Pick from CRM directory:</label>
              <select
                value={selectedCustomer?.id || ''}
                onChange={(e) => {
                  const found = customers.find((c) => c.id === e.target.value);
                  setSelectedCustomer(found || null);
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium outline-none"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone}) - {(c.tags || [c.tag || 'Regular']).join(', ')}
                  </option>
                ))}
              </select>
            </div>

            {selectedTemplate.id === 't-payment' && (
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Amount to remind:</label>
                <input
                  type="text"
                  value={
                    selectedCustomer && selectedCustomer.outstandingDeni
                      ? formatKsh(selectedCustomer.outstandingDeni)
                      : customAmount
                  }
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-800"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Message Preview */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">WhatsApp Message Preview</h3>
                <p className="text-[11px] text-slate-500">To: {customerName} ({customerPhone})</p>
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>

          {/* WhatsApp Chat Bubble Graphic */}
          <div className="p-6 rounded-2xl bg-[#EFEAE2] min-h-[260px] flex flex-col justify-end border border-slate-300">
            <div className="max-w-md bg-white p-4 rounded-2xl rounded-tr-none shadow text-xs sm:text-sm text-slate-800 space-y-2 whitespace-pre-line self-end border border-emerald-100">
              {generatedMessage}
              <div className="text-[10px] text-slate-400 text-right pt-1">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
              </div>
            </div>
          </div>

          {/* Trigger CTA Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500">
              Clicking will open WhatsApp with your client's number and pre-typed message.
            </span>
            <button
              id="send-whatsapp-btn"
              onClick={handleSend}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#0F7A4C] hover:bg-[#0b5e3a] flex items-center justify-center gap-2 shadow-md transition-transform transform hover:-translate-y-0.5"
            >
              <Send className="w-4 h-4" />
              Open in WhatsApp & Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
