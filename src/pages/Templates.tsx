
import React, { useState, useMemo } from 'react';
import {
  Search, Filter, Download, Lock, ShoppingCart, Star, Zap,
  ArrowLeft, X, CheckCircle, FileJson, Eye, Tag, Clock,
  ChevronDown, SlidersHorizontal
} from 'lucide-react';
import { Product, Category, PlanTier, PLAN_CONFIG } from '../types';

interface TemplatesPageProps {
  products: Product[];
  categories: Category[];
  initialCategoryId?: string;
  onViewProduct: (id: string) => void;
  onAddToCart: (product: Product) => void;
  userPlan?: PlanTier;
  onBuySubscription?: () => void;
}

const PRICE_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Free', value: 'free' },
  { label: 'Paid', value: 'paid' },
  { label: 'Subscription', value: 'subscription' }
];

const TemplatesPage: React.FC<TemplatesPageProps> = ({
  products,
  categories,
  initialCategoryId,
  onViewProduct,
  onAddToCart,
  userPlan,
  onBuySubscription
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryId || 'all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || p.categories.includes(selectedCategory);

      const matchesPrice = priceFilter === 'all' ||
        (priceFilter === 'free' && p.price === 0) ||
        (priceFilter === 'paid' && p.price > 0) ||
        (priceFilter === 'subscription' && p.planAccessLevel && p.planAccessLevel !== PlanTier.FREE);

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, searchQuery, selectedCategory, priceFilter]);

  const canAccess = (product: Product): boolean => {
    if (!product.planAccessLevel || product.planAccessLevel === PlanTier.FREE) return true;
    if (!userPlan) return false;
    const planOrder = [PlanTier.FREE, PlanTier.STARTER, PlanTier.PRO, PlanTier.ENTERPRISE];
    return planOrder.indexOf(userPlan) >= planOrder.indexOf(product.planAccessLevel);
  };

  return (
    <div className="min-h-screen bg-brand-primary">
      {/* Header */}
      <div className="border-b border-white/5 bg-base-main/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
          <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between mb-6">
            <div>
              <h1 className="text-4xl font-heading font-bold text-white">Browse Templates</h1>
              <p className="text-content-secondary mt-1">{filteredProducts.length} automation workflows available</p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-panel text-sm font-medium text-content-secondary hover:text-white transition-all md:hidden"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" size={18} />
            <input
              type="text"
              placeholder="Search templates, integrations, or keywords..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="dark-input w-full pl-12 py-3.5"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-content-muted hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex gap-8">
        {/* Sidebar Filters */}
        <aside className={`w-64 flex-shrink-0 space-y-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold text-content-muted uppercase tracking-wider mb-3">Category</h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-purple-600/20 text-purple-400 border border-purple-500/20'
                    : 'text-content-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-purple-600/20 text-purple-400 border border-purple-500/20'
                      : 'text-content-secondary hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <h3 className="text-xs font-bold text-content-muted uppercase tracking-wider mb-3">Access Type</h3>
            <div className="space-y-1">
              {PRICE_FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setPriceFilter(f.value)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    priceFilter === f.value
                      ? 'bg-purple-600/20 text-purple-400 border border-purple-500/20'
                      : 'text-content-secondary hover:text-white hover:bg-white/5'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subscription CTA */}
          {!userPlan && (
            <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(0,212,255,0.06))', border: '1px solid rgba(108,99,255,0.3)' }}>
              <Zap size={20} className="text-purple-400 mb-3" />
              <h4 className="font-heading font-bold text-white text-sm mb-2">Unlock All Templates</h4>
              <p className="text-xs text-content-muted mb-4">Get access to 150+ workflows from ₹499/year</p>
              <button onClick={onBuySubscription} className="w-full py-2.5 btn-gradient rounded-xl text-white text-xs font-semibold">
                View Plans
              </button>
            </div>
          )}
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="gradient-border-card rounded-3xl p-16 text-center">
              <Search size={32} className="text-content-muted mx-auto mb-4" />
              <h3 className="text-xl font-heading font-bold text-white mb-2">No templates found</h3>
              <p className="text-content-secondary">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProducts.map(product => {
                const accessible = canAccess(product);
                const isFree = product.price === 0;

                return (
                  <div
                    key={product.id}
                    className="gradient-border-card rounded-2xl flex flex-col overflow-hidden hover-card group"
                  >
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden bg-base-main">
                      <img
                        src={product.imageUrl || ''}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={e => {
                          (e.target as HTMLImageElement).src = `https://placehold.co/400x200/12121F/6C63FF?text=${encodeURIComponent(product.name.slice(0, 2))}`;
                        }}
                      />
                      {!accessible && (
                        <div className="absolute inset-0 bg-brand-primary/80 flex items-center justify-center">
                          <Lock size={24} className="text-content-muted" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                        {isFree ? (
                          <span className="tag-chip-green text-[10px] px-2 py-1 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 font-semibold">Free</span>
                        ) : (
                          <span className="text-[10px] px-2 py-1 rounded-lg bg-black/60 border border-white/10 text-white font-semibold">₹{product.price}</span>
                        )}
                        {product.isMonthlyDrop && (
                          <span className="text-[10px] px-2 py-1 rounded-lg bg-purple-600/60 border border-purple-500/30 text-white font-semibold">🔥 New</span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-heading font-bold text-white text-sm leading-snug line-clamp-2 flex-1">{product.name}</h3>
                      </div>
                      <p className="text-xs text-content-secondary leading-relaxed mb-4 line-clamp-2">{product.description}</p>

                      <div className="flex flex-wrap gap-1.5 mb-5">
                        <span className="tag-chip text-[10px]">{product.techTag}</span>
                        {(product.tags || []).slice(0, 2).map((tag, ti) => (
                          <span key={ti} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-content-muted">{tag}</span>
                        ))}
                      </div>

                      <div className="mt-auto space-y-2">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="w-full py-2.5 glass-panel rounded-xl text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-white/8 transition-all"
                        >
                          <Eye size={14} /> View Details
                        </button>

                        {accessible ? (
                          isFree ? (
                            <button className="w-full py-2.5 btn-gradient rounded-xl text-white text-xs font-semibold flex items-center justify-center gap-2">
                              <Download size={14} /> Download Free
                            </button>
                          ) : (
                            <button
                              onClick={() => onAddToCart(product)}
                              className="w-full py-2.5 btn-gradient rounded-xl text-white text-xs font-semibold flex items-center justify-center gap-2"
                            >
                              <ShoppingCart size={14} /> Buy Now — ₹{product.discountPrice || product.price}
                            </button>
                          )
                        ) : (
                          <button
                            onClick={onBuySubscription}
                            className="w-full py-2.5 rounded-xl border border-purple-500/30 text-purple-400 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-purple-600/10 transition-all"
                          >
                            <Lock size={14} /> Unlock with Plan
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="glass-panel-dark rounded-3xl w-full max-w-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="font-heading font-bold text-white text-lg">{selectedProduct.name}</h2>
              <button onClick={() => setSelectedProduct(null)} className="text-content-muted hover:text-white p-2 rounded-xl hover:bg-white/5">
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto custom-scrollbar">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="w-full h-56 object-cover"
                onError={e => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/800x300/12121F/6C63FF?text=${encodeURIComponent(selectedProduct.name)}`;
                }}
              />
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="tag-chip">{selectedProduct.techTag}</span>
                  {selectedProduct.price === 0 ? (
                    <span className="tag-chip-green">Free</span>
                  ) : (
                    <span className="text-lg font-heading font-bold text-white">₹{selectedProduct.discountPrice || selectedProduct.price}</span>
                  )}
                  {selectedProduct.planAccessLevel && (
                    <span className="tag-chip-cyan text-xs">Requires {selectedProduct.planAccessLevel} plan</span>
                  )}
                </div>

                <p className="text-content-secondary text-sm leading-relaxed">{selectedProduct.fullDescription || selectedProduct.description}</p>

                {selectedProduct.features && selectedProduct.features.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-white text-sm mb-3">What's included:</h4>
                    <ul className="space-y-2">
                      {selectedProduct.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-content-secondary">
                          <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-white/5">
                  {canAccess(selectedProduct) ? (
                    <button
                      onClick={() => { onAddToCart(selectedProduct); setSelectedProduct(null); }}
                      className="flex-1 py-3.5 btn-gradient rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={16} />
                      {selectedProduct.price === 0 ? 'Download Free' : `Buy Now — ₹${selectedProduct.discountPrice || selectedProduct.price}`}
                    </button>
                  ) : (
                    <button
                      onClick={() => { onBuySubscription?.(); setSelectedProduct(null); }}
                      className="flex-1 py-3.5 rounded-xl border border-purple-500/40 text-purple-400 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-purple-600/10 transition-all"
                    >
                      <Lock size={16} />
                      Unlock with Plan
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;
