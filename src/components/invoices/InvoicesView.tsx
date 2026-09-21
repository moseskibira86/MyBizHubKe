import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Share2,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Trash2,
  Send,
  Building2,
  Phone,
  Sparkles,
  DollarSign,
} from 'lucide-react';
import { Invoice, InvoiceItem, BusinessTenant } from '../../types';
import { formatKsh, generateWhatsAppInvoiceMessage, openWhatsAppChat } from '../../services/api';

interface InvoicesViewProps {
  invoices: Invoice[];
  tenant: BusinessTenant;
  onAddInvoice: (invoice: Invoice) => void;
  onUpdateStatus: (id: string, status: Invoice['status']) => void;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  invoices,
  tenant,
  onAddInvoice,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [activePreviewInvoice, setActivePreviewInvoice] = useState<Invoice | null>(null);

  // New Invoice Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('+254 7');
  const [clientEmail, setClientEmail] = useState('');
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [applyVat, setApplyVat] = useState(true);
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Bamburi Power Plus Cement 50kg', quantity: 20, unitPrice: 780, taxable: true, total: 15600 },
  ]);
  const [notes, setNotes] = useState('Payment via M-Pesa Buy Goods Till or Equity Bank transfer.');

  const filteredInvoices = invoices.filter((inv) => {
    const name = inv.customerName || inv.clientName || '';
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const subtotal = items.reduce((acc, item) => acc + (item.total ?? (item.quantity * item.unitPrice)), 0);
  const vatAmount = applyVat ? subtotal * 0.16 : 0;
  const grandTotal = subtotal + vatAmount;

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: String(Date.now()),
        description: '',
        quantity: 1,
        unitPrice: 0,
        taxable: true,
        total: 0,
      },
    ]);
  };

  const handleUpdateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      const q = field === 'quantity' ? parseFloat(value) || 0 : item.quantity;
      const p = field === 'unitPrice' ? parseFloat(value) || 0 : item.unitPrice;
      item.total = q * p;
    }
    updated[index] = item;
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || items.length === 0) return;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${String(invoices.length + 101).padStart(4, '0')}`,
      customerName: clientName,
      clientName,
      customerPhone: clientPhone || undefined,
      clientPhone: clientPhone || undefined,
      customerEmail: clientEmail || undefined,
      clientEmail: clientEmail || undefined,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate,
      items,
      subtotal,
      vatRate: applyVat ? 16 : 0,
      vatAmount,
      vat: vatAmount,
      total: grandTotal,
      status: 'Unpaid',
      paymentInstructions: `Lipa Na M-Pesa Buy Goods Till: ${tenant.mpesaTill || '892104'}`,
      notes,
    };

    onAddInvoice(newInvoice);
    setClientName('');
    setClientPhone('+254 7');
    setClientEmail('');
    setItems([{ id: '1', description: '', quantity: 1, unitPrice: 0, taxable: true, total: 0 }]);
    setModalOpen(false);
  };

  const handleShareWhatsApp = (invoice: Invoice) => {
    const text = generateWhatsAppInvoiceMessage(
      invoice,
      tenant.name
    );
    openWhatsAppChat(invoice.customerPhone || invoice.clientPhone || '+254700000000', text);
  };

  return (
    <div className="space-y-6">
      {/* Header & New Invoice (§15) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#0F7A4C]" /> Invoices & KRA eTIMS Billing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Issue 16% VAT compliant tax invoices with direct M-Pesa payment reminders via WhatsApp.
          </p>
        </div>

        <button
          id="create-new-invoice-btn"
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0F7A4C] hover:bg-[#0b5e3a] flex items-center gap-1.5 shadow transition-colors"
        >
          <Plus className="w-4 h-4" /> Create New Invoice
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by invoice # or client name..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F7A4C] outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs">
          {(['All', 'Paid', 'Unpaid', 'Overdue'] as const).map((st) => (
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
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Subtotal</th>
                  <th className="py-3 px-4 text-right">16% VAT</th>
                  <th className="py-3 px-4 text-right">Total (KSh)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{inv.customerName || inv.clientName || 'Customer'}</div>
                      {(inv.customerPhone || inv.clientPhone) && (
                        <div className="text-[11px] text-slate-400">{inv.customerPhone || inv.clientPhone}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{inv.dueDate}</td>
                    <td className="py-3 px-4 text-right text-slate-600">{formatKsh(inv.subtotal)}</td>
                    <td className="py-3 px-4 text-right text-slate-500 font-mono">
                      {formatKsh(inv.vat ?? inv.vatAmount ?? 0)}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-slate-900">
                      {formatKsh(inv.total)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.status === 'Overdue'
                            ? 'bg-rose-100 text-rose-800 animate-pulse'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* WhatsApp Share Button (§15) */}
                        <button
                          onClick={() => handleShareWhatsApp(inv)}
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          title="Share via WhatsApp"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        {/* Preview Print */}
                        <button
                          onClick={() => setActivePreviewInvoice(inv)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                          title="Preview & Print"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        {/* Toggle Paid */}
                        {inv.status !== 'Paid' && (
                          <button
                            onClick={() => onUpdateStatus(inv.id, 'Paid')}
                            className="px-2 py-1 rounded-lg text-[10px] font-bold bg-[#0F7A4C] text-white hover:bg-[#0b5e3a]"
                            title="Mark as Paid"
                          >
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No Invoices Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create an invoice for your wholesale buyers or contract clients to streamline payments.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0F7A4C] hover:bg-[#0b5e3a]"
            >
              + Create Invoice
            </button>
          </div>
        )}
      </div>

      {/* Invoice Preview Modal (Simulating Print / eTIMS Format) */}
      {activePreviewInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-5">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    {tenant.name}
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {tenant.county} County, Kenya • Phone: {tenant.phone}
                  </p>
                  <p className="text-xs text-slate-600">
                    KRA PIN: <strong>{tenant.kraPin || 'P051289341Z'}</strong> • eTIMS Ready
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-mono font-bold text-[#0F7A4C] block">
                    {activePreviewInvoice.invoiceNumber}
                  </span>
                  <span className="text-xs text-slate-500">
                    Issued: {activePreviewInvoice.issueDate}
                  </span>
                  <span className="text-xs text-rose-600 font-semibold block">
                    Due: {activePreviewInvoice.dueDate}
                  </span>
                </div>
              </div>

              {/* Billed To */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    Billed To:
                  </span>
                  <p className="text-sm font-bold text-slate-900">
                    {activePreviewInvoice.customerName || activePreviewInvoice.clientName || 'Customer'}
                  </p>
                  <p className="text-slate-600">{activePreviewInvoice.customerPhone || activePreviewInvoice.clientPhone || 'No phone'}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    Payment Channel:
                  </span>
                  <p className="text-slate-700">Lipa Na M-Pesa Buy Goods: <strong>{tenant.mpesaTill || '892104'}</strong></p>
                  <p className="text-slate-700">Account: {activePreviewInvoice.invoiceNumber}</p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activePreviewInvoice.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-medium text-slate-800">{it.description}</td>
                      <td className="py-2.5 px-3 text-center">{it.quantity}</td>
                      <td className="py-2.5 px-3 text-right">{formatKsh(it.unitPrice)}</td>
                      <td className="py-2.5 px-3 text-right font-bold">{formatKsh(it.total ?? (it.quantity * it.unitPrice))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end text-xs">
                <div className="w-64 space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span>{formatKsh(activePreviewInvoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>16% VAT:</span>
                    <span className="font-mono">{formatKsh(activePreviewInvoice.vat ?? activePreviewInvoice.vatAmount ?? 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200 pt-2">
                    <span>Grand Total:</span>
                    <span className="text-[#0F7A4C]">{formatKsh(activePreviewInvoice.total)}</span>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActivePreviewInvoice(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Close Preview
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleShareWhatsApp(activePreviewInvoice)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 shadow"
                  >
                    <Share2 className="w-4 h-4" /> Share on WhatsApp
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" /> Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create New Invoice Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-[#0B2440] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">New Tax Invoice (16% VAT / eTIMS)</h3>
                <p className="text-xs text-slate-400">Issued by {tenant.name}</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Client / Business Name *</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Apex Plumbers & Hardware Ltd"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">WhatsApp / Phone Number</label>
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 mt-5">
                  <span className="font-semibold text-slate-800">Apply Standard 16% VAT</span>
                  <input
                    type="checkbox"
                    checked={applyVat}
                    onChange={(e) => setApplyVat(e.target.checked)}
                    className="w-4 h-4 text-[#0F7A4C] rounded"
                  />
                </div>
              </div>

              {/* Dynamic Line Items (§15) */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Invoice Line Items
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-[#0F7A4C] font-bold text-xs hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Row
                  </button>
                </div>

                {items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div className="col-span-6">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleUpdateItem(idx, 'description', e.target.value)}
                        placeholder="Item description"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(idx, 'quantity', e.target.value)}
                        placeholder="Qty"
                        min="1"
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-center"
                        required
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => handleUpdateItem(idx, 'unitPrice', e.target.value)}
                        placeholder="Price"
                        min="0"
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-right font-medium"
                        required
                      />
                    </div>
                    <div className="col-span-1 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-slate-400 hover:text-rose-600"
                        title="Remove row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Calculations Box */}
              <div className="p-3 rounded-xl bg-slate-100 text-right space-y-1">
                <div className="text-slate-600">Subtotal: {formatKsh(subtotal)}</div>
                {applyVat && <div className="text-slate-600">16% VAT: {formatKsh(vatAmount)}</div>}
                <div className="text-sm font-black text-slate-900">
                  Total Payable: {formatKsh(grandTotal)}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#0F7A4C] hover:bg-[#0b5e3a] shadow"
                >
                  Create & Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
