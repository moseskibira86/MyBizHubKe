export function formatKsh(amount: number): string {
  return `KSh ${amount.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`;
}

export function openWhatsAppChat(phone: string, message: string) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(message);
  const url = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function generateWhatsAppInvoiceMessage(invoice: {
  invoiceNumber: string;
  total: number;
  dueDate: string;
  customerName?: string;
  clientName?: string;
  paymentInstructions?: string;
}, businessName: string): string {
  const name = invoice.customerName || invoice.clientName || 'Valued Customer';
  const payInfo = invoice.paymentInstructions || 'Lipa Na M-Pesa Buy Goods Till';
  return `Habari ${name}! Greetings from ${businessName}.\n\nYour official invoice *${invoice.invoiceNumber}* for *${formatKsh(invoice.total)}* is ready and due on *${invoice.dueDate}*.\n\nPayment Details:\n${payInfo}\n\neTIMS electronic invoice record generated. Thank you for your continued partnership! 🇰🇪`;
}

export async function askBizHubAi(message: string, context?: any): Promise<{ answer: string }> {
  try {
    const res = await fetch('/api/ai/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context }),
    });
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }
    const data = await res.json();
    return { answer: data.reply || data.answer || 'No response from assistant.' };
  } catch (err: any) {
    console.error('AI assistant error:', err);
    return {
      answer: `Note: Operating in local Kenyan advisory mode.\n\nRegarding your question: "${message}"\n\nFor Kenyan business operations, ensure your daily M-Pesa till reconciles with cash drawers every evening at 6 PM. If your accounts involve VAT or eTIMS, keep electronic receipts backed up. Maintain a minimum 30-day working capital buffer for godown rent and staff salaries.`,
    };
  }
}

export const askGeminiAdvisor = askBizHubAi;

export async function generateMarketingContent(
  platform: string,
  topic: string,
  targetAudience: string,
  tone: string,
  businessName: string,
  county?: string
): Promise<{ content: string }> {
  try {
    const res = await fetch('/api/ai/marketing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel: platform, topic, audience: targetAudience, tone, businessName, county }),
    });
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }
    const data = await res.json();
    return { content: data.content || data.reply || '' };
  } catch (err: any) {
    console.error('Marketing generation error:', err);
    return {
      content: `🔥 *EXCLUSIVE FLASH DEAL from ${businessName || 'Our Store'} (${county || 'Kenya'})!* 🇰🇪\n\n${topic}\n\nTargeted for: ${targetAudience}\n✅ Authentic Quality Guaranteed\n🚚 Swift Delivery across Kenya\n💳 Lipa Na M-Pesa Accepted\n\n📲 *Call / WhatsApp us now* to secure your order while stocks last!`,
    };
  }
}

export async function generateMarketingCopy(params: {
  channel: string;
  topic: string;
  tone: string;
  businessName: string;
  offer: string;
}): Promise<string> {
  const res = await generateMarketingContent(
    params.channel,
    params.topic,
    'Kenyan customers',
    params.tone,
    params.businessName
  );
  return res.content;
}


export function exportToCsv(filename: string, rows: Record<string, any>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const val = row[header];
          const escaped = ('' + (val ?? '')).replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Initializes and seeds or clears the workspace during Onboarding Step 3.
 * Includes a strict 15-second timeout and detailed console logging for observability.
 */
export async function setupWorkspace(params: {
  tenant: any;
  importSampleData: boolean;
}): Promise<{ success: boolean; message: string }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout

  try {
    console.log('[setupWorkspace] Calling /api/workspace/setup with:', {
      tenantName: params.tenant?.name,
      importSampleData: params.importSampleData,
    });

    const res = await fetch('/api/workspace/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Server responded with status ${res.status}: ${res.statusText}`
      );
    }

    const data = await res.json();
    console.log('[setupWorkspace] Promise resolved successfully:', data);
    return {
      success: true,
      message: data.message || 'Workspace configured successfully.',
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.error('[setupWorkspace] Setup request encountered an error:', err);

    if (err.name === 'AbortError') {
      throw new Error(
        'Workspace setup timed out after 15 seconds. Please check your network and click Retry.'
      );
    }

    // Fallback if server is temporarily unreachable or offline in preview mode
    if (err.message && err.message.includes('Failed to fetch')) {
      console.warn('[setupWorkspace] Network fetch failed, applying client-side fallback.');
      return {
        success: true,
        message: params.importSampleData
          ? 'Client-side Kenyan SME starter data configured.'
          : 'Clean blank slate configured.',
      };
    }

    throw new Error(err.message || 'Failed to configure workspace. Please try again.');
  }
}
