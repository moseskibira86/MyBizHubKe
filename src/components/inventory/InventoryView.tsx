import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  Download,
  ArrowUp,
  ArrowDown,
  Trash2,
  DollarSign,
  X,
  Sparkles,
} from 'lucide-react';
import { Product } from '../../types';
import { formatKsh, exportToCsv } from '../../services/api';

interface InventoryViewProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateStock: (id: string, newQuantity: number) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  onAddProduct,
  onUpdateStock,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // New Product Form
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Hardware & Building');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [quantity, setQuantity] = useState('10');
  const [minStockLevel, setMinStockLevel] = useState('5');
  const [supplierName, setSupplierName] = useState('Bamburi Cement Ltd');

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStock = filterLowStockOnly ? p.quantity <= p.minStockLevel : true;
    return matchesSearch && matchesStock;
  });

  const totalInventoryCost = products.reduce((acc, p) => acc + p.purchasePrice * p.quantity, 0);
  const totalRetailPotential = products.reduce((acc, p) => acc + p.sellingPrice * p.quantity, 0);
  const lowStockCount = products.filter((p) => p.quantity <= p.minStockLevel).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sellingPrice) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name,
      sku: sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      purchasePrice: parseFloat(purchasePrice) || 0,
      sellingPrice: parseFloat(sellingPrice) || 0,
      quantity: parseInt(quantity) || 0,
      minStockLevel: parseInt(minStockLevel) || 5,
      supplier: supplierName || 'Local Supplier',
      supplierName: supplierName || undefined,
      location: 'Storefront',
    };

    onAddProduct(newProd);
    setName('');
    setSku('');
    setPurchasePrice('');
    setSellingPrice('');
    setQuantity('10');
    setModalOpen(false);
  };

  const handleExport = () => {
    const rows = filteredProducts.map((p) => ({
      SKU: p.sku,
      Name: p.name,
      Category: p.category,
      Cost_Price_KSh: p.purchasePrice,
      Selling_Price_KSh: p.sellingPrice,
      Stock_Qty: p.quantity,
      Min_Alert_Level: p.minStockLevel,
      Supplier: p.supplier || p.supplierName || 'N/A',
      Total_Value_KSh: p.purchasePrice * p.quantity,
    }));
    exportToCsv('BizHubKE_Stock_Inventory', rows);
  };

  return (
    <div className="space-y-6">
      {/* Header & Export (§18) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-[#0F7A4C]" /> Inventory & Stock Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor warehouse quantities, cost prices, profit margins, and reorder levels.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExport}
            className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export CSV
          </button>
          <button
            id="add-product-btn"
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0F7A4C] hover:bg-[#0b5e3a] flex items-center gap-1.5 shadow transition-colors"
          >
            <Plus className="w-4 h-4" /> Add New Item
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Stock Value at Cost</span>
          <div className="text-xl font-extrabold text-slate-900 mt-1">
            {formatKsh(totalInventoryCost)}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Total capital tied in current inventory
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Potential Retail Turnover</span>
          <div className="text-xl font-extrabold text-[#0F7A4C] mt-1">
            {formatKsh(totalRetailPotential)}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">
            Gross margin: {formatKsh(totalRetailPotential - totalInventoryCost)}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Low Stock Alerts</span>
          <div className="text-xl font-extrabold text-rose-600 mt-1">
            {lowStockCount} Products
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Below safety reorder threshold
          </span>
        </div>
      </div>

      {/* Search & Low Stock Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by SKU, product name or category..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F7A4C] outline-none"
          />
        </div>

        <button
          onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            filterLowStockOnly
              ? 'bg-rose-600 text-white shadow'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Low Stock Only ({lowStockCount})</span>
        </button>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">SKU / Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Cost (KSh)</th>
                  <th className="py-3 px-4 text-right">Selling (KSh)</th>
                  <th className="py-3 px-4 text-right">Margin %</th>
                  <th className="py-3 px-4 text-center">Stock Level</th>
                  <th className="py-3 px-4 text-center">Quick Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const isLow = p.quantity <= p.minStockLevel;
                  const margin = p.sellingPrice > 0
                    ? Math.round(((p.sellingPrice - p.purchasePrice) / p.sellingPrice) * 100)
                    : 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{p.name}</div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {p.sku} • {p.supplier || p.supplierName || 'Supplier'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{p.category}</td>
                      <td className="py-3 px-4 text-right text-slate-600">{formatKsh(p.purchasePrice)}</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                        {formatKsh(p.sellingPrice)}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-emerald-700">
                        {margin}%
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                            isLow
                              ? 'bg-rose-100 text-rose-800 animate-pulse border border-rose-200'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {p.quantity} in stock
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onUpdateStock(p.id, Math.max(0, p.quantity - 1))}
                            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center"
                            title="Decrement 1 item"
                          >
                            -
                          </button>
                          <button
                            onClick={() => onUpdateStock(p.id, p.quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-[#E8F7EF] hover:bg-[#d0f0e0] text-[#0F7A4C] font-bold flex items-center justify-center"
                            title="Add 1 item (Restock)"
                          >
                            +
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No Inventory Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add your products to track real-time stock levels and automatically prevent stockouts.
            </p>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0B2440] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Add Inventory Item</h3>
                <p className="text-xs text-slate-400">Add to your catalog & set reorder alert</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Item / Product Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Y12 Deformed Steel Bars 12m"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SKU / Code</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. STL-Y12"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Hardware"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Buying Cost (KSh) *</label>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    placeholder="e.g. 1100"
                    min="0"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Selling Price (KSh) *</label>
                  <input
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    placeholder="e.g. 1450"
                    min="1"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Opening Stock Qty</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="10"
                    min="0"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Low Stock Alert Level</label>
                  <input
                    type="number"
                    value={minStockLevel}
                    onChange={(e) => setMinStockLevel(e.target.value)}
                    placeholder="5"
                    min="1"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Supplier</label>
                <input
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="e.g. Apex Steel Ltd"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
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
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
