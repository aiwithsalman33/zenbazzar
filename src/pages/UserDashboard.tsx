
import React, { useState } from 'react';
import {
  LayoutDashboard, Package, CreditCard, Settings, LogOut, Star,
  Download, ExternalLink, ArrowRight, X, FileText, ShoppingBag,
  Bell, User, Shield, CheckCircle, Clock, Zap, Lock, Globe,
  ChevronRight, BarChart3, Calendar
} from 'lucide-react';
import { Order, OrderStatus, DeliveryMethod, PlanTier, PLAN_CONFIG } from '../types';
import { supabaseService } from '../services/localService';

interface UserDashboardProps {
  user: any;
  orders: Order[];
  onBrowseTemplates: () => void;
  onUpgradePlan?: () => void;
}

const MOCK_SUBSCRIPTION = {
  plan: PlanTier.STARTER,
  status: 'active',
  endDate: '2026-12-31',
  startDate: '2025-12-31',
  templatesAccessed: 12,
  totalTemplates: 50
};

const UserDashboard: React.FC<UserDashboardProps> = ({ user, orders, onBrowseTemplates }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'templates' | 'subscription' | 'billing' | 'settings'>('overview');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await supabaseService.signOut();
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const libraryItems = orders
    .filter(o => o.status === OrderStatus.COMPLETED)
    .flatMap(o => o.items);

  const totalSpent = orders
    .filter(o => o.status === OrderStatus.COMPLETED)
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrders = orders.filter(o => o.status === OrderStatus.AWAITING_VERIFICATION).length;

  const NAV_ITEMS = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'templates', icon: Package, label: 'My Templates' },
    { id: 'subscription', icon: Star, label: 'Subscription' },
    { id: 'billing', icon: CreditCard, label: 'Billing' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-brand-primary flex">
      {/* Sidebar */}
      <aside className="w-64 glass-panel-dark border-r border-white/5 flex flex-col fixed inset-y-0 top-16 z-40 hidden lg:flex">
        <div className="p-6 flex-1 overflow-y-auto">
          {/* User card */}
          <div className="glass-panel rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-sm truncate">{user?.fullName}</div>
                <div className="text-xs text-content-muted truncate">{user?.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-green-400">Starter Plan</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                  activeTab === item.id
                    ? 'bg-purple-600/20 text-purple-400 border border-purple-500/20'
                    : 'text-content-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={16} />
                <span className="text-sm font-medium">{item.label}</span>
                {activeTab === item.id && <ChevronRight size={14} className="ml-auto" />}
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom */}
        <div className="p-6 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all"
          >
            <LogOut size={16} />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 p-6 lg:p-10 animate-page-enter">

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8 max-w-5xl">
            {/* Welcome */}
            <div className="relative rounded-3xl overflow-hidden p-8"
              style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.2) 0%, rgba(0,212,255,0.08) 100%)', border: '1px solid rgba(108,99,255,0.3)' }}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />
              <div className="relative">
                <h1 className="text-3xl font-heading font-bold text-white mb-2">
                  Welcome back, {user?.fullName?.split(' ')[0]}! 👋
                </h1>
                <p className="text-content-secondary">Here's an overview of your AutomateHub activity.</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Templates Owned', value: libraryItems.length, icon: <Package size={18} />, color: 'purple' },
                { label: 'Total Spent', value: `₹${totalSpent.toLocaleString('en-IN')}`, icon: <CreditCard size={18} />, color: 'cyan' },
                { label: 'Pending Orders', value: pendingOrders, icon: <Clock size={18} />, color: 'yellow' },
                { label: 'Current Plan', value: 'Starter', icon: <Star size={18} />, color: 'green' }
              ].map((stat, i) => (
                <div key={i} className="gradient-border-card rounded-2xl p-5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${
                    stat.color === 'purple' ? 'bg-purple-600/15 text-purple-400' :
                    stat.color === 'cyan' ? 'bg-cyan-500/15 text-cyan-400' :
                    stat.color === 'yellow' ? 'bg-yellow-500/15 text-yellow-400' :
                    'bg-green-500/15 text-green-400'
                  }`}>
                    {stat.icon}
                  </div>
                  <div className="text-xs text-content-muted font-medium mb-1">{stat.label}</div>
                  <div className="text-2xl font-heading font-bold text-white">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div>
              <h2 className="text-lg font-heading font-bold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={onBrowseTemplates}
                  className="gradient-border-card rounded-2xl p-6 text-left hover-card flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-purple-600/15 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                    <Globe size={22} />
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">Browse Templates</div>
                    <div className="text-xs text-content-muted">Explore 1200+ workflows</div>
                  </div>
                  <ArrowRight size={18} className="ml-auto text-content-muted group-hover:text-purple-400 transition-colors" />
                </button>
                <button
                  onClick={() => setActiveTab('subscription')}
                  className="gradient-border-card rounded-2xl p-6 text-left hover-card flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    <Zap size={22} />
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">Upgrade Plan</div>
                    <div className="text-xs text-content-muted">Get Pro for ₹999/year</div>
                  </div>
                  <ArrowRight size={18} className="ml-auto text-content-muted group-hover:text-cyan-400 transition-colors" />
                </button>
              </div>
            </div>

            {/* Recent orders */}
            {orders.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-heading font-bold text-white">Recent Purchases</h2>
                  <button onClick={() => setActiveTab('billing')} className="text-xs text-purple-400 hover:text-purple-300 font-medium">View all</button>
                </div>
                <div className="gradient-border-card rounded-2xl overflow-hidden">
                  <table className="w-full admin-table">
                    <thead>
                      <tr>
                        <th>Reference</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 3).map(order => (
                        <tr key={order.id} className="cursor-pointer" onClick={() => { setSelectedOrder(order); setIsOrderModalOpen(true); }}>
                          <td className="font-semibold text-white text-sm">#AH-{order.id.slice(0, 8).toUpperCase()}</td>
                          <td className="text-content-secondary text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="font-bold text-green-400">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                          <td>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === OrderStatus.COMPLETED ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                              order.status === OrderStatus.AWAITING_VERIFICATION ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                              'bg-white/5 text-content-muted border border-white/10'
                            }`}>
                              {order.status === OrderStatus.COMPLETED && <CheckCircle size={11} />}
                              {order.status === OrderStatus.AWAITING_VERIFICATION && <Clock size={11} />}
                              {order.status === OrderStatus.COMPLETED ? 'Completed' :
                               order.status === OrderStatus.AWAITING_VERIFICATION ? 'Pending' : order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* My Templates */}
        {activeTab === 'templates' && (
          <div className="space-y-8 max-w-5xl">
            <div>
              <h1 className="text-3xl font-heading font-bold text-white">My Templates</h1>
              <p className="text-content-secondary mt-1">All your purchased and unlocked automation workflows</p>
            </div>

            {libraryItems.length === 0 ? (
              <div className="gradient-border-card rounded-3xl p-16 text-center">
                <div className="w-16 h-16 rounded-2xl glass-panel mx-auto flex items-center justify-center mb-6">
                  <Package size={28} className="text-content-muted" />
                </div>
                <h3 className="text-xl font-heading font-bold text-white mb-3">No templates yet</h3>
                <p className="text-content-secondary mb-8 max-w-sm mx-auto">Purchase or unlock templates through a subscription to access them here.</p>
                <button onClick={onBrowseTemplates} className="btn-gradient px-6 py-3 rounded-xl text-white font-semibold text-sm">
                  Browse Templates
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {libraryItems.map((item, idx) => (
                  <div key={idx} className="gradient-border-card rounded-2xl p-6 hover-card flex flex-col">
                    <div className="flex items-start justify-between mb-5">
                      <img src={item.imageUrl} className="w-14 h-14 rounded-xl object-cover" alt={item.name} />
                      <span className="tag-chip text-xs">{item.techTag}</span>
                    </div>
                    <h3 className="font-heading font-bold text-white mb-2">{item.name}</h3>
                    <p className="text-sm text-content-secondary leading-relaxed mb-5 flex-1 line-clamp-2">{item.description}</p>
                    <div className="flex gap-2 pt-4 border-t border-white/5">
                      {item.deliveryMethod === DeliveryMethod.FILE ? (
                        <a href={item.deliveryContent} download className="flex-1 py-3 btn-gradient rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2">
                          <Download size={15} /> Download
                        </a>
                      ) : (
                        <a href={item.deliveryContent} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 btn-gradient rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2">
                          <ExternalLink size={15} /> Open Link
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Subscription */}
        {activeTab === 'subscription' && (
          <div className="space-y-8 max-w-3xl">
            <div>
              <h1 className="text-3xl font-heading font-bold text-white">My Subscription</h1>
              <p className="text-content-secondary mt-1">Manage your plan and access</p>
            </div>

            {/* Current Plan */}
            <div className="relative rounded-3xl p-8 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.15) 0%, rgba(0,212,255,0.06) 100%)', border: '1px solid rgba(108,99,255,0.4)' }}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="tag-chip mb-3 inline-flex">Active Plan</div>
                  <h2 className="text-2xl font-heading font-bold text-white">Starter Plan</h2>
                  <p className="text-content-secondary text-sm mt-1">₹499/year · Renews Dec 31, 2026</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-green-500/15 flex items-center justify-center">
                  <CheckCircle size={24} className="text-green-400" />
                </div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-content-secondary">Templates accessed this period</span>
                  <span className="text-sm font-semibold text-white">{MOCK_SUBSCRIPTION.templatesAccessed}/{MOCK_SUBSCRIPTION.totalTemplates}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full"
                    style={{ width: `${(MOCK_SUBSCRIPTION.templatesAccessed / MOCK_SUBSCRIPTION.totalTemplates) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Monthly Drop Add-on */}
            <div className="gradient-border-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-heading font-bold text-white mb-1">Monthly Template Drop</h3>
                  <p className="text-sm text-content-secondary">New automation workflows added this month</p>
                </div>
                <span className="tag-chip-cyan">March 2026</span>
              </div>
              <div className="flex items-center gap-4 p-4 glass-panel rounded-2xl">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">5 new templates added</p>
                  <p className="text-xs text-content-muted mt-0.5">Unlock for ₹49 as a Starter member</p>
                </div>
                <button className="btn-gradient px-5 py-2.5 rounded-xl text-white text-sm font-semibold whitespace-nowrap">
                  Unlock for ₹49
                </button>
              </div>
            </div>

            {/* Upgrade Options */}
            <div>
              <h3 className="text-lg font-heading font-bold text-white mb-4">Upgrade Your Plan</h3>
              <div className="gradient-border-card rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600/15 flex items-center justify-center flex-shrink-0">
                    <Zap size={22} className="text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-heading font-bold text-white">Pro Plan</h4>
                      <span className="text-xs font-bold text-purple-400 bg-purple-600/10 border border-purple-500/20 px-2 py-0.5 rounded-full">Most Popular</span>
                    </div>
                    <p className="text-sm text-content-secondary mb-4">150+ templates · Priority support · ₹29 monthly drops</p>
                    <button onClick={() => {}} className="btn-gradient px-6 py-2.5 rounded-xl text-white text-sm font-semibold">
                      Upgrade to Pro — ₹999/year
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Billing */}
        {activeTab === 'billing' && (
          <div className="space-y-8 max-w-4xl">
            <div>
              <h1 className="text-3xl font-heading font-bold text-white">Billing & Invoices</h1>
              <p className="text-content-secondary mt-1">Your complete purchase history</p>
            </div>

            {orders.length === 0 ? (
              <div className="gradient-border-card rounded-3xl p-16 text-center">
                <FileText size={32} className="text-content-muted mx-auto mb-4" />
                <h3 className="text-xl font-heading font-bold text-white mb-2">No invoices yet</h3>
                <p className="text-content-secondary">Your purchase history will appear here.</p>
              </div>
            ) : (
              <div className="gradient-border-card rounded-2xl overflow-hidden">
                <table className="w-full admin-table">
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th className="text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td className="font-semibold text-white">#AH-{order.id.slice(0, 8).toUpperCase()}</td>
                        <td className="text-content-secondary text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                        <td className="text-content-secondary text-sm">{order.items.length} template{order.items.length > 1 ? 's' : ''}</td>
                        <td className="font-bold text-green-400">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                        <td>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === OrderStatus.COMPLETED ? 'bg-green-500/10 text-green-400' :
                            order.status === OrderStatus.AWAITING_VERIFICATION ? 'bg-yellow-500/10 text-yellow-400' :
                            'bg-white/5 text-content-muted'
                          }`}>
                            {order.status === OrderStatus.COMPLETED ? 'Paid' :
                             order.status === OrderStatus.AWAITING_VERIFICATION ? 'Verifying' : order.status}
                          </span>
                        </td>
                        <td className="text-right">
                          <button
                            onClick={() => { setSelectedOrder(order); setIsOrderModalOpen(true); }}
                            className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-8 max-w-2xl">
            <div>
              <h1 className="text-3xl font-heading font-bold text-white">Account Settings</h1>
              <p className="text-content-secondary mt-1">Manage your profile and preferences</p>
            </div>

            <div className="gradient-border-card rounded-2xl p-6 space-y-6">
              <h3 className="font-heading font-bold text-white">Profile Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-2">Full Name</label>
                  <div className="dark-input">{user?.fullName}</div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-2">Email Address</label>
                  <div className="dark-input">{user?.email}</div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-2">Account Type</label>
                  <div className="flex items-center gap-2 dark-input">
                    <Shield size={14} className="text-purple-400" />
                    <span className="text-purple-400 font-semibold capitalize">{user?.role}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger zone */}
            <div className="rounded-2xl p-6 border border-red-500/20 bg-red-500/5">
              <h3 className="font-heading font-bold text-red-400 mb-4">Danger Zone</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white text-sm">Sign Out</p>
                  <p className="text-xs text-content-muted mt-1">Securely sign out of your account</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-sm font-semibold flex items-center gap-2"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Order Modal */}
      {isOrderModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="glass-panel-dark rounded-3xl w-full max-w-lg border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="font-heading font-bold text-white">Invoice #{selectedOrder.id.slice(0, 8).toUpperCase()}</h2>
              <button onClick={() => setIsOrderModalOpen(false)} className="text-content-muted hover:text-white p-2 rounded-xl hover:bg-white/5">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 glass-panel rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-600/15 flex items-center justify-center">
                        <Package size={16} className="text-purple-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{item.name}</p>
                        <p className="text-xs text-content-muted">{item.techTag}</p>
                      </div>
                    </div>
                    <p className="font-bold text-white">₹{item.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(0,212,255,0.08))', border: '1px solid rgba(108,99,255,0.3)' }}>
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-white">Total</span>
                  <span className="font-heading font-bold text-2xl text-white">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
                <div className="mt-2">
                  <span className={`tag-chip-${selectedOrder.status === OrderStatus.COMPLETED ? 'green' : 'cyan'} text-xs`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
