import React, { useState } from 'react';
import {
  MOCK_TENANT,
  MOCK_SALES,
  MOCK_EXPENSES,
  MOCK_INVOICES,
  MOCK_CUSTOMERS,
  MOCK_PRODUCTS,
  MOCK_SUPPLIERS,
  MOCK_COMPLIANCE_TASKS,
  MOCK_NEWS,
  MOCK_TRAINING_COURSES,
  MOCK_OPPORTUNITIES,
} from './data/mockData';
import {
  BusinessTenant,
  Sale,
  Expense,
  Invoice,
  Customer,
  Product,
  Supplier,
  ComplianceTask,
} from './types';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { AppSidebar, AppView } from './components/layout/AppSidebar';
import { AppHeader } from './components/layout/AppHeader';
import { OnboardingWizard } from './components/auth/OnboardingWizard';
import { AuthModal } from './components/auth/AuthModal';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { SalesView } from './components/sales/SalesView';
import { ExpensesView } from './components/expenses/ExpensesView';
import { InvoicesView } from './components/invoices/InvoicesView';
import { CustomersView } from './components/customers/CustomersView';
import { WhatsAppCrmView } from './components/whatsapp/WhatsAppCrmView';
import { InventoryView } from './components/inventory/InventoryView';
import { SuppliersView } from './components/suppliers/SuppliersView';
import { ComplianceView } from './components/compliance/ComplianceView';
import { BusinessHubView } from './components/hub/BusinessHubView';
import { BusinessScoreView } from './components/score/BusinessScoreView';
import { AiAssistantView } from './components/ai/AiAssistantView';
import { MarketingCentreView } from './components/marketing/MarketingCentreView';
import { NewsAcademyView } from './components/training/NewsAcademyView';
import { OpportunitiesView } from './components/opportunities/OpportunitiesView';
import { AnalyticsReportsView } from './components/analytics/AnalyticsReportsView';
import { BillingPlansView } from './components/billing/BillingPlansView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';

export default function App() {
  // Navigation & Mode
  const [appMode, setAppMode] = useState<'landing' | 'app'>('landing');
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Authentication & Onboarding state
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'signup' }>({
    isOpen: false,
    mode: 'signup',
  });
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  // Core Business State (persisting in-memory with sample Kenyan SME data)
  const [tenant, setTenant] = useState<BusinessTenant>(MOCK_TENANT);
  const [sales, setSales] = useState<Sale[]>(MOCK_SALES);
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [complianceTasks, setComplianceTasks] = useState<ComplianceTask[]>(MOCK_COMPLIANCE_TASKS);

  // Reset demo data handler (§34)
  const handleResetDemo = () => {
    setTenant(MOCK_TENANT);
    setSales(MOCK_SALES);
    setExpenses(MOCK_EXPENSES);
    setInvoices(MOCK_INVOICES);
    setCustomers(MOCK_CUSTOMERS);
    setProducts(MOCK_PRODUCTS);
    setSuppliers(MOCK_SUPPLIERS);
    setComplianceTasks(MOCK_COMPLIANCE_TASKS);
  };

  // Auth flow triggers
  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthModal({ isOpen: true, mode });
  };

  const handleAuthSuccess = (mode: 'login' | 'signup', email: string) => {
    setAuthModal({ isOpen: false, mode: 'login' });
    if (mode === 'signup') {
      setOnboardingOpen(true);
    } else {
      setAppMode('app');
      setCurrentView('dashboard');
    }
  };

  const handleOnboardingComplete = (newTenant: BusinessTenant, importSample: boolean) => {
    setTenant(newTenant);
    if (!importSample) {
      setSales([]);
      setExpenses([]);
      setInvoices([]);
      setCustomers([]);
      setProducts([]);
      setSuppliers([]);
    }
    setOnboardingOpen(false);
    setAppMode('app');
    setCurrentView('dashboard');
  };

  const handleEnterDemo = () => {
    setTenant({ ...MOCK_TENANT, isDemo: true });
    setAppMode('app');
    setCurrentView('dashboard');
  };

  // Business Action Handlers
  const handleAddSale = (sale: Sale) => {
    setSales([sale, ...sales]);
  };

  const handleAddExpense = (expense: Expense) => {
    setExpenses([expense, ...expenses]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const handleAddInvoice = (invoice: Invoice) => {
    setInvoices([invoice, ...invoices]);
  };

  const handleUpdateInvoiceStatus = (id: string, status: Invoice['status']) => {
    setInvoices(invoices.map((inv) => (inv.id === id ? { ...inv, status } : inv)));
  };

  const handleAddCustomer = (customer: Customer) => {
    setCustomers([customer, ...customers]);
  };

  const handleUpdateCustomer = (customer: Customer) => {
    setCustomers(customers.map((c) => (c.id === customer.id ? customer : c)));
  };

  const handleAddProduct = (product: Product) => {
    setProducts([product, ...products]);
  };

  const handleUpdateStock = (id: string, newQuantity: number) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, quantity: newQuantity } : p)));
  };

  const handleAddSupplier = (supplier: Supplier) => {
    setSuppliers([supplier, ...suppliers]);
  };

  const handleRecordSupplierPayment = (id: string, amount: number) => {
    setSuppliers(
      suppliers.map((s) =>
        s.id === id ? { ...s, balanceOwed: Math.max(0, (s.balanceOwed || s.outstandingBalance || 0) - amount) } : s
      )
    );
  };

  const handleToggleComplianceTask = (id: string) => {
    setComplianceTasks(
      complianceTasks.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'Completed' ? 'Upcoming' : 'Completed' }
          : t
      )
    );
  };

  const handleUpgradePlan = (newPlan: BusinessTenant['plan']) => {
    setTenant({ ...tenant, plan: newPlan, isTrial: false });
  };

  // Render Public Website Mode (§1 - §6)
  if (appMode === 'landing') {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans flex flex-col">
        <Navbar
          onOpenAuth={(mode) => handleOpenAuth(mode)}
          onOpenDemo={handleEnterDemo}
          onNavigateSection={(sectionId) => {
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <main className="flex-1">
          <LandingPage
            onOpenAuth={(mode) => handleOpenAuth(mode)}
            onOpenDemo={handleEnterDemo}
          />
        </main>

        {/* Auth Modal */}
        <AuthModal
          isOpen={authModal.isOpen}
          initialMode={authModal.mode}
          onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
          onSuccess={handleAuthSuccess}
        />

        {/* Onboarding Wizard (§8) */}
        {onboardingOpen && (
          <OnboardingWizard
            onComplete={handleOnboardingComplete}
            onCancel={() => setOnboardingOpen(false)}
          />
        )}
      </div>
    );
  }

  // Render Internal SaaS Application Mode (§9 - §33)
  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-900 font-sans">
      {/* Desktop Sidebar (§9) */}
      <div className="hidden lg:block">
        <AppSidebar
          currentView={currentView}
          onSelectView={(v) => setCurrentView(v)}
          tenant={tenant}
          onExitToWebsite={() => setAppMode('landing')}
          isAdmin={true}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-64">
            <AppSidebar
              currentView={currentView}
              onSelectView={(v) => {
                setCurrentView(v);
                setMobileSidebarOpen(false);
              }}
              tenant={tenant}
              onExitToWebsite={() => {
                setAppMode('landing');
                setMobileSidebarOpen(false);
              }}
              isAdmin={true}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <AppHeader
          tenant={tenant}
          onResetDemo={handleResetDemo}
          onOpenQuickSale={() => setCurrentView('sales')}
          onOpenQuickExpense={() => setCurrentView('expenses')}
          onOpenQuickInvoice={() => setCurrentView('invoices')}
          onOpenBilling={() => setCurrentView('billing')}
          onToggleMobileMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-16">
          {currentView === 'dashboard' && (
            <DashboardView
              tenant={tenant}
              sales={sales}
              expenses={expenses}
              invoices={invoices}
              customers={customers}
              products={products}
              complianceTasks={complianceTasks}
              onNavigate={(v) => setCurrentView(v)}
              onOpenQuickSale={() => setCurrentView('sales')}
              onOpenQuickExpense={() => setCurrentView('expenses')}
              onOpenQuickInvoice={() => setCurrentView('invoices')}
            />
          )}

          {currentView === 'sales' && (
            <SalesView sales={sales} onAddSale={handleAddSale} />
          )}

          {currentView === 'expenses' && (
            <ExpensesView
              expenses={expenses}
              onAddExpense={handleAddExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          )}

          {currentView === 'invoices' && (
            <InvoicesView
              invoices={invoices}
              tenant={tenant}
              onAddInvoice={handleAddInvoice}
              onUpdateStatus={handleUpdateInvoiceStatus}
            />
          )}

          {currentView === 'customers' && (
            <CustomersView
              customers={customers}
              onAddCustomer={handleAddCustomer}
              onUpdateCustomer={handleUpdateCustomer}
              businessName={tenant.name}
              tillNumber={tenant.mpesaTill || '892104'}
            />
          )}

          {currentView === 'whatsapp' && (
            <WhatsAppCrmView customers={customers} tenant={tenant} />
          )}

          {currentView === 'inventory' && (
            <InventoryView
              products={products}
              onAddProduct={handleAddProduct}
              onUpdateStock={handleUpdateStock}
            />
          )}

          {currentView === 'suppliers' && (
            <SuppliersView
              suppliers={suppliers}
              onAddSupplier={handleAddSupplier}
              onRecordPayment={handleRecordSupplierPayment}
            />
          )}

          {currentView === 'compliance' && (
            <ComplianceView
              tasks={complianceTasks}
              onToggleTask={handleToggleComplianceTask}
            />
          )}

          {currentView === 'hub' && (
            <BusinessHubView
              tenant={tenant}
              onNavigateView={(v) => setCurrentView(v)}
            />
          )}

          {currentView === 'score' && (
            <BusinessScoreView
              score={tenant.score}
              onNavigate={(v) => setCurrentView(v)}
              onUpdateScore={(s) => setTenant({ ...tenant, score: s })}
            />
          )}

          {currentView === 'ai' && <AiAssistantView tenant={tenant} />}

          {currentView === 'marketing' && <MarketingCentreView tenant={tenant} />}

          {currentView === 'news' && (
            <NewsAcademyView
              news={MOCK_NEWS}
              courses={MOCK_TRAINING_COURSES}
              defaultTab="news"
            />
          )}

          {currentView === 'training' && (
            <NewsAcademyView
              news={MOCK_NEWS}
              courses={MOCK_TRAINING_COURSES}
              defaultTab="training"
            />
          )}

          {currentView === 'opportunities' && (
            <OpportunitiesView opportunities={MOCK_OPPORTUNITIES} />
          )}

          {currentView === 'analytics' && (
            <AnalyticsReportsView
              sales={sales}
              expenses={expenses}
              invoices={invoices}
              businessName={tenant.name}
            />
          )}

          {currentView === 'billing' && (
            <BillingPlansView tenant={tenant} onUpgradePlan={handleUpgradePlan} />
          )}

          {currentView === 'admin' && <AdminDashboardView />}
        </main>
      </div>

      {/* Onboarding Wizard when opened inside app */}
      {onboardingOpen && (
        <OnboardingWizard
          onComplete={handleOnboardingComplete}
          onCancel={() => setOnboardingOpen(false)}
        />
      )}
    </div>
  );
}
