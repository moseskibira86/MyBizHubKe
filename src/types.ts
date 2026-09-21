export type County = 
  | 'Nairobi' | 'Mombasa' | 'Kiambu' | 'Nakuru' | 'Kisumu' | 'Uasin Gishu' 
  | 'Machakos' | 'Kajiado' | 'Meru' | 'Kilifi' | 'Nyeri' | 'Kakamega' | 'Other';

export type BusinessCategory = 
  | 'Retail / Duka'
  | 'Restaurant / Cafe'
  | 'Wholesale & Distribution'
  | 'Hardware & Building'
  | 'Boutique & Apparel'
  | 'Beauty & Salon'
  | 'Professional Services'
  | 'Construction'
  | 'Transport & Logistics'
  | 'E-commerce'
  | 'Agribusiness'
  | 'Manufacturing'
  | 'Other';

export interface BusinessTenant {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  county: County;
  category: BusinessCategory;
  employeeCount: string;
  monthlySalesRange: string;
  kraPin?: string;
  mpesaTill?: string;
  plan: 'Free' | 'Starter' | 'Business' | 'Professional' | 'Enterprise' | 'Solo';
  isTrial: boolean;
  trialDaysLeft: number;
  currency: 'KSh';
  isDemo: boolean;
  score: number;
}

export interface Sale {
  id: string;
  invoiceNumber?: string;
  customerName: string;
  customerPhone?: string;
  itemsSummary: string;
  amount: number;
  paymentMethod: 'M-Pesa' | 'Cash' | 'Bank Transfer' | 'Credit';
  date: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
}

export type ExpenseCategory =
  | 'Rent'
  | 'Utilities'
  | 'Transport'
  | 'Salaries'
  | 'Marketing'
  | 'Stock'
  | 'Equipment'
  | 'Bank charges'
  | 'Taxes'
  | 'Other';

export interface Expense {
  id: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
  paymentMethod: 'M-Pesa' | 'Cash' | 'Bank Transfer';
  receiptAttached?: boolean;
  vendor?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxable?: boolean;
  total?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  clientName?: string;
  customerEmail?: string;
  clientEmail?: string;
  customerPhone?: string;
  clientPhone?: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  vatRate: number; // e.g. 16 for 16% VAT
  vatAmount: number;
  vat?: number;
  total: number;
  status: 'Paid' | 'Unpaid' | 'Overdue' | 'Sent';
  paymentInstructions: string;
  notes?: string;
}


export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  location: string;
  tag: 'VIP' | 'New' | 'Repeat Customer' | 'Inactive' | 'Lead' | 'Wholesale';
  tags?: string[];
  totalSpent: number;
  totalPurchases?: number;
  outstandingDeni?: number;
  lastPurchaseDate: string;
  totalOrders: number;
  notes?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  minStockLevel: number;
  supplier: string;
  supplierName?: string;
  location: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  category?: string;
  creditTerms?: string;
  balanceOwed?: number;
  phone: string;
  email?: string;
  productsSupplied?: string;
  totalPurchases?: number;
  outstandingBalance?: number;
  notes?: string;
}

export interface ComplianceTask {
  id: string;
  title: string;
  authority: 'KRA' | 'County Government' | 'NSSF' | 'NHIF/SHA' | 'NEMA' | 'Business Reg' | string;
  dueDate: string;
  dueInDays: number;
  description: string;
  status: 'Pending' | 'Completed' | 'Urgent' | string;
  actionUrl?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: 'Kenya Business' | 'Tax & KRA' | 'Finance & Banking' | 'SMEs' | 'Technology' | 'Funding' | string;
  date: string;
  summary: string;
  fullText?: string;
  source: string;
  originalUrl?: string;
  whatItMeans?: {
    whatHappened: string;
    whoIsAffected: string;
    whatShouldYouDo: string;
    deadline?: string;
  };
}

export type BusinessNewsItem = NewsArticle;

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  content: string;
}

export interface TrainingCourse {
  id: string;
  title: string;
  category: 'Business Finance' | 'WhatsApp Business' | 'Tax & Compliance' | 'Marketing' | 'Inventory & Operations';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  description?: string;
  lessonsCount: number;
  lessons: CourseLesson[];
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  isCompleted?: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  category?: 'Funding' | 'Grant' | 'Government Program' | 'Tender' | 'Competition' | string;
  type?: string;
  deadline: string;
  amountOrBenefit?: string;
  amount?: string;
  eligibility?: string;
  location?: string;
  description: string;
  applicationLink?: string;
  link?: string;
  saved?: boolean;
}

export interface MessageTemplate {
  id: string;
  title: string;
  category: 'Order Confirmation' | 'Payment Reminder' | 'Thank You' | 'Review Request' | 'Promotion' | 'Reactivation';
  templateText: string;
}

export interface BusinessScoreBreakdown {
  overallScore: number;
  financialHealth: number;
  customerManagement: number;
  operations: number;
  marketing: number;
  compliance: number;
  biggestOpportunity: string;
  recommendations: string[];
}
