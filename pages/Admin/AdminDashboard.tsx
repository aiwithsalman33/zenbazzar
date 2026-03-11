
import React from 'react';
import {
  BarChart3, Users, ShoppingBag, DollarSign, Plus, Trash2, Edit2,
  Search, ArrowUpRight, TrendingUp, Package, History, Layers, Check,
  X, Eye, EyeOff, Settings, Zap, ShieldCheck, FileText, LogOut,
  Send, AlertCircle, ExternalLink, UserCheck, Key, Calendar, Bell,
  Star, Lock, Download, BarChart, RefreshCw
} from 'lucide-react';
import { Product, Order, OrderStatus, Category, TechTag, DeliveryMethod, PlanTier } from '../../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { supabaseService } from '../../services/localService';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  categories: Category[];
  onRefresh: () => void;
  onBack?: () => void;
}

type AdminView = 'overview' | 'products' | 'categories' | 'orders' | 'requests' | 'users' | 'subscriptions' | 'access' | 'drops';

const MOCK_USERS = [
  { id: '1', fullName: 'Rahul Sharma', email: 'rahul@example.com', plan: 'Pro', status: 'active', joined: '2025-12-01', templatesAccessed: 34 },
  { id: '2', fullName: 'Priya Nair', email: 'priya@example.com', plan: 'Starter', status: 'active', joined: '2026-01-15', templatesAccessed: 12 },
  { id: '3', fullName: 'Arjun Mehta', email: 'arjun@example.com', plan: 'None', status: 'inactive', joined: '2026-02-20', templatesAccessed: 2 },
];

const MOCK_SUBSCRIPTIONS = [
  { id: 'sub-1', user: 'Rahul Sharma', email: 'rahul@example.com', plan: PlanTier.PRO, amount: 999, startDate: '2025-12-01', endDate: '2026-12-01', status: 'active' },
  { id: 'sub-2', user: 'Priya Nair', email: 'priya@example.com', plan: PlanTier.STARTER, amount: 499, startDate: '2026-01-15', endDate: '2027-01-15', status: 'active' },
];

const chartData = [
  { month: 'Sep', revenue: 4200, signups: 12 },
  { month: 'Oct', revenue: 6800, signups: 22 },
  { month: 'Nov', revenue: 8400, signups: 31 },
  { month: 'Dec', revenue: 11200, signups: 45 },
  { month: 'Jan', revenue: 9700, signups: 38 },
  { month: 'Feb', revenue: 13500, signups: 52 },
  { month: 'Mar', revenue: 15800, signups: 67 },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, orders, categories, onRefresh, onBack }) => {
  const [activeView, setActiveView] = React.useState<AdminView>('overview');
  const [isAddingProduct, setIsAddingProduct] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [isAddingCategory, setIsAddingCategory] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = React.useState(false);
  const [customRequests, setCustomRequests] = React.useState<any[]>([]);
  const [accessForm, setAccessForm] = React.useState({ userId: '', templateId: '', note: '', expiresAt: '' });
  const [accessGranted, setAccessGranted] = React.useState(false);

  const fetchRequests = async () => {
    if (!localStorage.getItem('devhub_token')) return;
    try {
      const data = await supabaseService.getCustomRequests();
      setCustomRequests(data);
    } catch (error) { console.error('Failed to fetch requests:', error); }
  };

  React.useEffect(() => { fetchRequests(); }, []);

  const totalRevenue = orders.reduce((sum, o) => o.status === OrderStatus.COMPLETED ? sum + o.totalAmount : sum, 0);
  const pendingOrders = orders.filter(o => o.status === OrderStatus.AWAITING_VERIFICATION).length;

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const categoryIds = formData.getAll('categoryIds').filter(id => id !== '') as string[];
    const features = (formData.get('features') as string).split(',').map(s => s.trim()).filter(Boolean);
    const productData: Product = {
      id: editingProduct ? editingProduct.id : 'prod-' + Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      fullDescription: formData.get('fullDescription') as string,
      price: parseFloat(formData.get('price') as string),
      discountPrice: parseFloat(formData.get('discountPrice') as string) || undefined,
      categories: categoryIds,
      techTag: formData.get('techTag') as TechTag,
      deliveryMethod: formData.get('deliveryMethod') as DeliveryMethod,
      deliveryContent: formData.get('deliveryContent') as string,
      imageUrl: formData.get('imageUrl') as string || '',
      features,
      planAccessLevel: (formData.get('planAccessLevel') as PlanTier) || PlanTier.FREE,
      isMonthlyDrop: formData.get('isMonthlyDrop') === 'on',
      isPublished: editingProduct ? editingProduct.isPublished : true,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString()
    };
    try {
      await supabaseService.saveProduct(productData);
      setIsAddingProduct(false);
      setEditingProduct(null);
      onRefresh();
    } catch (error) {
      alert('Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Delete this template permanently?')) {
      try { await supabaseService.deleteProduct(id); onRefresh(); } catch {}
    }
  };

  const handleToggleProductStatus = async (product: Product) => {
    try { await supabaseService.saveProduct({ ...product, isPublished: !product.isPublished }); onRefresh(); } catch {}
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsAddingProduct(true);
  };

  const handleSaveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCat: Category = {
      id: 'cat-' + Math.random().toString(36).substr(2, 5),
      name: formData.get('name') as string,
      slug: (formData.get('name') as string).toLowerCase().replace(/\s+/g, '-'),
      icon: 'Layers',
      description: formData.get('description') as string,
      isVisible: true,
      priority: categories.length + 1
    };
    try { await supabaseService.saveCategory(newCat); setIsAddingCategory(false); onRefresh(); } catch {}
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Delete this category?')) {
      try { await supabaseService.deleteCategory(id); onRefresh(); } catch {}
    }
  };

  const handleApproveOrder = async (order: Order) => {
    if (!confirm(`Approve payment for order #${order.id.slice(0, 8).toUpperCase()}?`)) return;
    try {
      await supabaseService.updateOrderStatus(order.id, OrderStatus.COMPLETED);
      onRefresh();
      setIsOrderModalOpen(false);
    } catch {}
  };

  const handleUpdateRequestStatus = async (id: string, status: string) => {
    try { await supabaseService.updateRequestStatus(id, status); fetchRequests(); } catch {}
  };

  const NAV_ITEMS = [
    { id: 'overview', icon: BarChart3, label: 'Dashboard' },
    { id: 'products', icon: ShoppingBag, label: 'Templates' },
    { id: 'categories', icon: Layers, label: 'Categories' },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'subscriptions', icon: Star, label: 'Subscriptions' },
    { id: 'access', icon: Key, label: 'Manual Access' },
    { id: 'drops', icon: Bell, label: 'Monthly Drops' },
    { id: 'orders', icon: History, label: 'Orders' },
    { id: 'requests', icon: FileText, label: 'Requests' },
  ];

  return (
    <div className="flex bg-brand-primary min-h-screen">
      {/* Sidebar */}
      <aside className="w-72 glass-panel-dark border-r border-white/5 flex flex-col fixed inset-y-0 z-50">
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <div className="font-heading font-bold text-white text-sm">AutomateHub</div>
              <div className="text-[10px] text-purple-400 font-semibold uppercase tracking-widest">Admin Console</div>
            </div>
          </div>

          <nav className="space-y-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as AdminView)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                  activeView === item.id
                    ? 'bg-purple-600/20 text-purple-400 border border-purple-500/20'
                    : 'text-content-muted hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={16} />
                <span className="text-sm font-medium">{item.label}</span>
                {activeView === item.id && <div className="w-1.5 h-1.5 bg-purple-400 rounded-full ml-auto animate-pulse" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-white/5 space-y-2">
          <button
            onClick={onBack}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-content-muted hover:text-white hover:bg-white/5 transition-all text-sm"
          >
            <ArrowUpRight size={15} /> View Live Site
          </button>
          <button
            onClick={() => { supabaseService.signOut().then(() => window.location.reload()); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/5 transition-all text-sm"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-72 p-8 max-w-[calc(100%-18rem)]">

        {/* OVERVIEW */}
        {activeView === 'overview' && (
          <div className="space-y-8 animate-fade-up">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-heading font-bold text-white">Dashboard</h1>
                <p className="text-content-secondary mt-1">AutomateHub platform overview</p>
              </div>
              <button onClick={onRefresh} className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-panel text-content-secondary hover:text-white text-sm">
                <RefreshCw size={15} /> Refresh
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: <DollarSign size={18} />, color: 'green' },
                { label: 'Pending Orders', value: pendingOrders, icon: <AlertCircle size={18} />, color: 'yellow' },
                { label: 'Total Templates', value: products.length, icon: <Package size={18} />, color: 'purple' },
                { label: 'Active Subscriptions', value: MOCK_SUBSCRIPTIONS.length, icon: <Star size={18} />, color: 'cyan' }
              ].map((stat, i) => (
                <div key={i} className="gradient-border-card rounded-2xl p-5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${
                    stat.color === 'green' ? 'bg-green-500/15 text-green-400' :
                    stat.color === 'yellow' ? 'bg-yellow-500/15 text-yellow-400' :
                    stat.color === 'purple' ? 'bg-purple-600/15 text-purple-400' :
                    'bg-cyan-500/15 text-cyan-400'
                  }`}>{stat.icon}</div>
                  <div className="text-xs text-content-muted font-medium mb-1">{stat.label}</div>
                  <div className="text-2xl font-heading font-bold text-white">{stat.value}</div>
                </div>
              ))}
            </div>

            <div className="gradient-border-card rounded-2xl p-6">
              <h3 className="font-heading font-bold text-white mb-6">Revenue Over Time</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: '#6B6B80', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6B6B80', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#12121F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'white' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#6C63FF" fill="url(#revenue)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TEMPLATES */}
        {activeView === 'products' && (
          <div className="space-y-6 animate-fade-up">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-heading font-bold text-white">Templates</h1>
                <p className="text-content-secondary mt-1">Manage your automation workflow library</p>
              </div>
              <button
                onClick={() => { setEditingProduct(null); setIsAddingProduct(true); }}
                className="btn-gradient px-5 py-2.5 rounded-xl text-white font-semibold text-sm flex items-center gap-2"
              >
                <Plus size={16} /> Add Template
              </button>
            </div>

            <div className="gradient-border-card rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/5 flex gap-3">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" />
                  <input
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="dark-input w-full pl-10"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="dark-input px-4"
                >
                  <option value="all">All Categories</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <table className="w-full admin-table">
                <thead>
                  <tr>
                    <th>Template</th>
                    <th>Plan Level</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Monthly Drop</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.filter(p =>
                    p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (selectedCategory === 'all' || p.categories.includes(selectedCategory))
                  ).map(p => (
                    <tr key={p.id} className="group">
                      <td>
                        <div className="flex items-center gap-3">
                          <img src={p.imageUrl} className="w-10 h-10 rounded-xl object-cover bg-base-main" alt="" onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/40x40/12121F/6C63FF?text=T'; }} />
                          <div>
                            <div className="font-semibold text-white text-sm">{p.name}</div>
                            <div className="text-xs text-content-muted">{p.techTag}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`tag-chip text-xs capitalize ${
                          p.planAccessLevel === PlanTier.PRO ? 'tag-chip' :
                          p.planAccessLevel === PlanTier.FREE ? 'tag-chip-green' :
                          'tag-chip-cyan'
                        }`}>
                          {p.planAccessLevel || 'free'}
                        </span>
                      </td>
                      <td className="font-semibold text-white text-sm">
                        {p.price === 0 ? <span className="text-green-400">Free</span> : `₹${p.price}`}
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleProductStatus(p)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            p.isPublished ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-white/5 text-content-muted border border-white/10'
                          }`}
                        >
                          {p.isPublished ? <><Check size={11} /> Published</> : <><EyeOff size={11} /> Draft</>}
                        </button>
                      </td>
                      <td>
                        {p.isMonthlyDrop && <span className="tag-chip-cyan text-xs">🔥 This Month</span>}
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEditProduct(p)} className="p-2 glass-panel text-content-muted hover:text-purple-400 rounded-xl transition-all"><Edit2 size={15} /></button>
                          <button onClick={() => handleDeleteProduct(p.id)} className="p-2 glass-panel text-content-muted hover:text-red-400 rounded-xl transition-all"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CATEGORIES */}
        {activeView === 'categories' && (
          <div className="space-y-6 animate-fade-up">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-heading font-bold text-white">Categories</h1>
                <p className="text-content-secondary mt-1">Organize your template taxonomy</p>
              </div>
              <button onClick={() => setIsAddingCategory(true)} className="btn-gradient px-5 py-2.5 rounded-xl text-white font-semibold text-sm flex items-center gap-2">
                <Plus size={16} /> Add Category
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(cat => (
                <div key={cat.id} className="gradient-border-card rounded-2xl p-6 hover-card group">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/15 flex items-center justify-center mb-4">
                    <Layers size={18} className="text-purple-400" />
                  </div>
                  <h3 className="font-heading font-bold text-white mb-1">{cat.name}</h3>
                  <p className="text-sm text-content-muted mb-4 line-clamp-2">{cat.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xs text-content-muted">Priority: {cat.priority}</span>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-content-muted hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS */}
        {activeView === 'users' && (
          <div className="space-y-6 animate-fade-up">
            <div>
              <h1 className="text-3xl font-heading font-bold text-white">Users</h1>
              <p className="text-content-secondary mt-1">Manage platform users</p>
            </div>
            <div className="gradient-border-card rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/5">
                <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" />
                  <input placeholder="Search users..." className="dark-input w-full pl-10" />
                </div>
              </div>
              <table className="w-full admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Plan</th>
                    <th>Joined</th>
                    <th>Templates</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_USERS.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-600/15 flex items-center justify-center text-sm font-bold text-purple-400">
                            {u.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-white text-sm">{u.fullName}</div>
                            <div className="text-xs text-content-muted">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                          u.plan === 'Pro' ? 'bg-purple-600/10 text-purple-400 border-purple-500/20' :
                          u.plan === 'Starter' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          'bg-white/5 text-content-muted border-white/10'
                        }`}>{u.plan}</span>
                      </td>
                      <td className="text-content-secondary text-sm">{u.joined}</td>
                      <td className="text-white font-semibold">{u.templatesAccessed}</td>
                      <td>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${u.status === 'active' ? 'text-green-400 bg-green-500/10' : 'text-content-muted bg-white/5'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <button onClick={() => setActiveView('access')} className="text-xs text-purple-400 hover:text-purple-300 font-medium">Grant Access</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBSCRIPTIONS */}
        {activeView === 'subscriptions' && (
          <div className="space-y-6 animate-fade-up">
            <div>
              <h1 className="text-3xl font-heading font-bold text-white">Subscriptions</h1>
              <p className="text-content-secondary mt-1">Manage active plans</p>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Active Subs', value: MOCK_SUBSCRIPTIONS.filter(s => s.status === 'active').length, color: 'green' },
                { label: 'Pro Plans', value: MOCK_SUBSCRIPTIONS.filter(s => s.plan === PlanTier.PRO).length, color: 'purple' },
                { label: 'Starter Plans', value: MOCK_SUBSCRIPTIONS.filter(s => s.plan === PlanTier.STARTER).length, color: 'cyan' }
              ].map((stat, i) => (
                <div key={i} className="gradient-border-card rounded-2xl p-5">
                  <div className="text-xs text-content-muted mb-1">{stat.label}</div>
                  <div className="text-2xl font-heading font-bold text-white">{stat.value}</div>
                </div>
              ))}
            </div>
            <div className="gradient-border-card rounded-2xl overflow-hidden">
              <table className="w-full admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Plan</th>
                    <th>Amount</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_SUBSCRIPTIONS.map(sub => (
                    <tr key={sub.id}>
                      <td>
                        <div className="font-semibold text-white text-sm">{sub.user}</div>
                        <div className="text-xs text-content-muted">{sub.email}</div>
                      </td>
                      <td>
                        <span className={`text-xs font-semibold capitalize px-3 py-1 rounded-full border ${
                          sub.plan === PlanTier.PRO ? 'bg-purple-600/10 text-purple-400 border-purple-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'
                        }`}>{sub.plan}</span>
                      </td>
                      <td className="font-bold text-white">₹{sub.amount}</td>
                      <td className="text-content-secondary text-sm">{sub.startDate}</td>
                      <td className="text-content-secondary text-sm">{sub.endDate}</td>
                      <td><span className="text-xs text-green-400 bg-green-500/10 px-3 py-1 rounded-full">{sub.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MANUAL ACCESS GRANT */}
        {activeView === 'access' && (
          <div className="space-y-6 animate-fade-up max-w-2xl">
            <div>
              <h1 className="text-3xl font-heading font-bold text-white">Manual Access Grant</h1>
              <p className="text-content-secondary mt-1">Grant template access to users bypassing payment</p>
            </div>
            {accessGranted ? (
              <div className="gradient-border-card rounded-3xl p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-green-500/15 flex items-center justify-center mx-auto mb-4">
                  <Check size={28} className="text-green-400" />
                </div>
                <h3 className="text-xl font-heading font-bold text-white mb-2">Access Granted!</h3>
                <p className="text-content-secondary mb-6">The user now has access to the specified template.</p>
                <button onClick={() => setAccessGranted(false)} className="btn-gradient px-6 py-3 rounded-xl text-white font-semibold text-sm">Grant Another</button>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setAccessGranted(true); }} className="gradient-border-card rounded-2xl p-8 space-y-5">
                <div>
                  <label className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-2">Select User</label>
                  <select className="dark-input w-full" value={accessForm.userId} onChange={e => setAccessForm({ ...accessForm, userId: e.target.value })}>
                    <option value="">Choose user...</option>
                    {MOCK_USERS.map(u => <option key={u.id} value={u.id}>{u.fullName} ({u.email})</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-2">Select Template</label>
                  <select className="dark-input w-full" value={accessForm.templateId} onChange={e => setAccessForm({ ...accessForm, templateId: e.target.value })}>
                    <option value="">Choose template...</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-2">Expiry Date (Optional)</label>
                  <input type="date" className="dark-input w-full" value={accessForm.expiresAt} onChange={e => setAccessForm({ ...accessForm, expiresAt: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-2">Admin Note</label>
                  <textarea rows={3} placeholder="Reason for granting access..." className="dark-input w-full resize-none" value={accessForm.note} onChange={e => setAccessForm({ ...accessForm, note: e.target.value })} />
                </div>
                <button type="submit" className="w-full py-3.5 btn-gradient rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2">
                  <Key size={16} /> Grant Access
                </button>
              </form>
            )}
          </div>
        )}

        {/* MONTHLY DROPS */}
        {activeView === 'drops' && (
          <div className="space-y-6 animate-fade-up">
            <div>
              <h1 className="text-3xl font-heading font-bold text-white">Monthly Template Drops</h1>
              <p className="text-content-secondary mt-1">Manage this month's new template additions</p>
            </div>
            <div className="gradient-border-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-heading font-bold text-white">March 2026 Drop</h3>
                  <p className="text-sm text-content-muted mt-1">Mark templates as "This Month's Drop"</p>
                </div>
                <span className="tag-chip">Active</span>
              </div>
              <table className="w-full admin-table">
                <thead>
                  <tr>
                    <th>Template</th>
                    <th>Category</th>
                    <th>Monthly Drop</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td className="font-semibold text-white text-sm">{p.name}</td>
                      <td className="text-content-muted text-sm">{p.techTag}</td>
                      <td>
                        {p.isMonthlyDrop
                          ? <span className="tag-chip text-xs">🔥 Current Drop</span>
                          : <span className="text-xs text-content-muted">—</span>
                        }
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleProductStatus({ ...p, isMonthlyDrop: !p.isMonthlyDrop } as any)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                            p.isMonthlyDrop ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' : 'border-purple-500/30 text-purple-400 hover:bg-purple-600/10'
                          }`}
                        >
                          {p.isMonthlyDrop ? 'Remove from Drop' : 'Add to Drop'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS */}
        {activeView === 'orders' && (
          <div className="space-y-6 animate-fade-up">
            <div>
              <h1 className="text-3xl font-heading font-bold text-white">Orders</h1>
              <p className="text-content-secondary mt-1">Manage payment verifications</p>
            </div>
            <div className="gradient-border-card rounded-2xl overflow-hidden">
              <table className="w-full admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>User</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td className="font-semibold text-white text-sm">#AH-{order.id.slice(0, 8).toUpperCase()}</td>
                      <td className="text-content-secondary text-sm">{order.userEmail || order.userId.slice(0, 8)}</td>
                      <td className="font-bold text-green-400">₹{order.totalAmount.toLocaleString()}</td>
                      <td>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                          order.status === OrderStatus.COMPLETED ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          order.status === OrderStatus.AWAITING_VERIFICATION ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 animate-pulse' :
                          'bg-white/5 text-content-muted border-white/10'
                        }`}>
                          {order.status === OrderStatus.AWAITING_VERIFICATION ? 'Needs Verification' : order.status}
                        </span>
                      </td>
                      <td className="text-content-muted text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="text-right">
                        <button
                          onClick={() => { setSelectedOrder(order); setIsOrderModalOpen(true); }}
                          className="text-xs text-purple-400 hover:text-purple-300 font-medium"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REQUESTS */}
        {activeView === 'requests' && (
          <div className="space-y-6 animate-fade-up">
            <div>
              <h1 className="text-3xl font-heading font-bold text-white">Custom Requests</h1>
              <p className="text-content-secondary mt-1">Enterprise and custom build requests</p>
            </div>
            <div className="gradient-border-card rounded-2xl overflow-hidden">
              <table className="w-full admin-table">
                <thead>
                  <tr>
                    <th>Requester</th>
                    <th>Project</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th className="text-right">Reply</th>
                  </tr>
                </thead>
                <tbody>
                  {customRequests.map(req => (
                    <tr key={req.id}>
                      <td>
                        <div className="font-semibold text-white text-sm">{req.fullName}</div>
                        <div className="text-xs text-content-muted">{req.email}</div>
                      </td>
                      <td className="text-white text-sm font-medium">{req.projectTitle}</td>
                      <td className="max-w-xs">
                        <p className="text-xs text-content-secondary line-clamp-2">{req.description}</p>
                      </td>
                      <td>
                        <select
                          value={req.status}
                          onChange={e => handleUpdateRequestStatus(req.id, e.target.value)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-full border-none focus:ring-1 focus:ring-purple-500 cursor-pointer ${
                            req.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                            req.status === 'responded' ? 'bg-green-500/10 text-green-400' :
                            'bg-white/5 text-content-muted'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="responded">Responded</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>
                      <td className="text-right">
                        <a
                          href={`mailto:${req.email}?subject=Re: ${req.projectTitle}`}
                          className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 justify-end"
                        >
                          <Send size={12} /> Reply
                        </a>
                      </td>
                    </tr>
                  ))}
                  {customRequests.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-12 text-content-muted text-sm">No requests yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ADD/EDIT PRODUCT MODAL */}
        {isAddingProduct && (
          <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
            <div className="glass-panel-dark rounded-3xl w-full max-w-3xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h2 className="font-heading font-bold text-white text-lg">{editingProduct ? 'Edit Template' : 'Add New Template'}</h2>
                <button onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }} className="text-content-muted hover:text-white p-2 rounded-xl hover:bg-white/5"><X size={18} /></button>
              </div>
              <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto custom-scrollbar space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-2">Title *</label>
                    <input name="name" required defaultValue={editingProduct?.name} placeholder="e.g. Slack to Notion Sync" className="dark-input w-full" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-2">Categories</label>
                    <select name="categoryIds" multiple defaultValue={editingProduct?.categories} className="dark-input w-full min-h-[80px]">
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-2">Price (₹) *</label>
                    <input name="price" type="number" step="1" min="0" required defaultValue={editingProduct?.price} className="dark-input w-full" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-2">Discount Price (₹)</label>
                    <input name="discountPrice" type="number" step="1" min="0" defaultValue={editingProduct?.discountPrice} className="dark-input w-full" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-2">Integration Tag *</label>
                    <select name="techTag" defaultValue={editingProduct?.techTag} required className="dark-input w-full">
                      {Object.values(TechTag).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-2">Plan Access Level</label>
                    <select name="planAccessLevel" defaultValue={editingProduct?.planAccessLevel || 'free'} className="dark-input w-full">
                      <option value="free">Free</option>
                      <option value="starter">Starter</option>
                      <option value="pro">Pro</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-2">Delivery Method *</label>
                    <select name="deliveryMethod" defaultValue={editingProduct?.deliveryMethod} required className="dark-input w-full">
                      {Object.values(DeliveryMethod).map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-2">Download URL / Link *</label>
                    <input name="deliveryContent" required defaultValue={editingProduct?.deliveryContent} placeholder="https://..." className="dark-input w-full" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-2">Preview Image URL</label>
                    <input name="imageUrl" defaultValue={editingProduct?.imageUrl} placeholder="https://..." className="dark-input w-full" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-2">Short Description *</label>
                  <textarea name="description" required rows={2} defaultValue={editingProduct?.description} className="dark-input w-full resize-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-2">Full Description</label>
                  <textarea name="fullDescription" rows={4} defaultValue={editingProduct?.fullDescription} className="dark-input w-full resize-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-2">Features (comma-separated)</label>
                  <input name="features" defaultValue={editingProduct?.features?.join(', ')} placeholder="Import n8n JSON, Auto-sync, Webhook support" className="dark-input w-full" />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" name="isMonthlyDrop" id="isMonthlyDrop" defaultChecked={editingProduct?.isMonthlyDrop} className="w-4 h-4 accent-purple-600" />
                  <label htmlFor="isMonthlyDrop" className="text-sm text-content-secondary">Mark as This Month's New Drop 🔥</label>
                </div>
                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }} className="flex-1 py-3 glass-panel rounded-xl text-content-muted font-semibold text-sm hover:text-white transition-all">Cancel</button>
                  <button type="submit" className="flex-1 py-3 btn-gradient rounded-xl text-white font-semibold text-sm">{editingProduct ? 'Save Changes' : 'Add Template'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ADD CATEGORY MODAL */}
        {isAddingCategory && (
          <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
            <div className="glass-panel-dark rounded-3xl w-full max-w-md border border-white/10 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h2 className="font-heading font-bold text-white">Add Category</h2>
                <button onClick={() => setIsAddingCategory(false)} className="text-content-muted hover:text-white p-2 rounded-xl hover:bg-white/5"><X size={18} /></button>
              </div>
              <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-2">Category Name *</label>
                  <input name="name" required placeholder="e.g. Shopify" className="dark-input w-full" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-2">Description</label>
                  <textarea name="description" rows={3} placeholder="What templates are in this category?" className="dark-input w-full resize-none" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsAddingCategory(false)} className="flex-1 py-3 glass-panel rounded-xl text-content-muted font-semibold text-sm hover:text-white transition-all">Cancel</button>
                  <button type="submit" className="flex-1 py-3 btn-gradient rounded-xl text-white font-semibold text-sm">Add Category</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ORDER REVIEW MODAL */}
        {isOrderModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
            <div className="glass-panel-dark rounded-3xl w-full max-w-xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h2 className="font-heading font-bold text-white">Order Review</h2>
                <button onClick={() => setIsOrderModalOpen(false)} className="text-content-muted hover:text-white p-2 rounded-xl hover:bg-white/5"><X size={18} /></button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-panel rounded-xl p-4">
                    <div className="text-xs text-content-muted mb-1">Order ID</div>
                    <div className="font-semibold text-white text-sm">#AH-{selectedOrder.id.slice(0, 8).toUpperCase()}</div>
                  </div>
                  <div className="glass-panel rounded-xl p-4">
                    <div className="text-xs text-content-muted mb-1">Total</div>
                    <div className="font-heading font-bold text-white text-lg">₹{selectedOrder.totalAmount.toLocaleString()}</div>
                  </div>
                </div>

                {selectedOrder.transactionId && (
                  <div className="glass-panel rounded-xl p-4">
                    <div className="text-xs text-content-muted mb-1">Transaction ID</div>
                    <div className="font-semibold text-white text-sm break-all">{selectedOrder.transactionId}</div>
                  </div>
                )}

                {selectedOrder.screenshotUrl && (
                  <div>
                    <div className="text-xs text-content-muted mb-2">Payment Screenshot</div>
                    <div className="rounded-2xl overflow-hidden border border-white/10">
                      <img
                        src={selectedOrder.screenshotUrl}
                        alt="Payment proof"
                        className="w-full max-h-[300px] object-contain bg-base-main cursor-zoom-in"
                        onClick={() => window.open(selectedOrder.screenshotUrl, '_blank')}
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                  {selectedOrder.status === OrderStatus.AWAITING_VERIFICATION && (
                    <button
                      onClick={() => handleApproveOrder(selectedOrder)}
                      className="w-full py-3.5 btn-gradient rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2"
                    >
                      <Check size={16} /> Verify Payment & Grant Access
                    </button>
                  )}
                  <button
                    onClick={() => setIsOrderModalOpen(false)}
                    className="w-full py-3 glass-panel rounded-xl text-content-muted font-semibold text-sm hover:text-white transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
