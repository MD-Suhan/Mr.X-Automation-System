import React, { useState } from 'react';
import {
  Package,
  Search,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Sparkles,
  SlidersHorizontal,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { SupplierProduct } from '../types/index.ts';

interface CatalogueViewProps {
  products: SupplierProduct[];
  onRunProductPipeline: (productId: string) => void;
  isRunningPipeline: boolean;
}

export const CatalogueView: React.FC<CatalogueViewProps> = ({
  products,
  onRunProductPipeline,
  isRunningPipeline,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStock =
      stockFilter === 'all'
        ? true
        : stockFilter === 'in_stock'
        ? p.stockStatus === 'in_stock'
        : p.stockStatus === 'out_of_stock';
    const matchesCategory =
      selectedCategory === 'all' ? true : p.category === selectedCategory;

    return matchesSearch && matchesStock && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Badhons World Public Catalogue & Stock Verification
            </h2>
            <p className="text-xs text-slate-500">
              Live crawler verifying public stock availability and product specifications (Mayons BD Reseller System)
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">
              {products.filter((p) => p.stockStatus === 'in_stock').length} In Stock
            </span>
            <span>·</span>
            <span>Zero Login Required</span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by product title, specs, or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Stock status filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium w-full sm:w-auto">
            <button
              onClick={() => setStockFilter('all')}
              className={`px-3 py-1 rounded transition-colors ${
                stockFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600'
              }`}
            >
              All ({products.length})
            </button>
            <button
              onClick={() => setStockFilter('in_stock')}
              className={`px-3 py-1 rounded transition-colors ${
                stockFilter === 'in_stock'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600'
              }`}
            >
              In Stock ({products.filter((p) => p.stockStatus === 'in_stock').length})
            </button>
            <button
              onClick={() => setStockFilter('out_of_stock')}
              className={`px-3 py-1 rounded transition-colors ${
                stockFilter === 'out_of_stock'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600'
              }`}
            >
              Out of Stock ({products.filter((p) => p.stockStatus === 'out_of_stock').length})
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-medium shrink-0">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-0.5 rounded capitalize transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Catalogue Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => {
          const inStock = product.stockStatus === 'in_stock';
          const isExpanded = expandedProductId === product.id;

          return (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors"
            >
              <div>
                {/* Photo & Stock Badge */}
                <div className="relative w-full h-44 rounded-lg overflow-hidden bg-slate-100 mb-3 border border-slate-100">
                  <img
                    src={product.images[0] || product.telegramAlbumImages[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    {inStock ? (
                      <span className="bg-emerald-500/90 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Available ({product.stockQuantity})
                      </span>
                    ) : (
                      <span className="bg-rose-500/90 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Out of Stock
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded">
                    SKU: {product.sku}
                  </div>
                </div>

                {/* Category & Title */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>{product.category}</span>
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <span>badhonsworld.com</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2">
                  {product.name}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  {product.description}
                </p>

                {/* Features Snippet */}
                <div className="space-y-1 mb-3">
                  {product.features.slice(0, 3).map((feat, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Collapsible Specs */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5 bg-slate-50 p-2.5 rounded-lg">
                    <span className="font-semibold text-slate-900 block mb-1">
                      Technical Specifications:
                    </span>
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <div key={key} className="flex justify-between text-[11px]">
                        <span className="text-slate-500">{key}:</span>
                        <span className="font-medium text-slate-800 text-right">{val}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setExpandedProductId(isExpanded ? null : product.id)}
                  className="mt-2 text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
                >
                  <span>{isExpanded ? 'Hide Specs' : 'View Full Specs'}</span>
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => onRunProductPipeline(product.id)}
                  disabled={!inStock || isRunningPipeline}
                  className={`w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg transition-colors shadow-xs ${
                    inStock
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {inStock
                      ? 'Generate Promotional Creative & Publish'
                      : 'Cannot Post (Out of Stock)'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
