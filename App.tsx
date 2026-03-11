
import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, Category, OrderStatus } from './types';
import { supabaseService, supabase } from './services/localService';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import TemplatesPage from './pages/Templates';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/Admin/AdminLoginPage';
import AboutPage from './pages/AboutPage';
import ManualUPIModal from './components/ManualUPIModal';
import { Loader2 } from 'lucide-react';

type View = 'home' | 'store' | 'product' | 'dashboard' | 'admin' | 'checkout' | 'login' | 'admin-login' | 'about' | 'project';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [user, setUser] = useState<{ id: string, email: string, fullName: string, role: string } | null>(null);

  const loadData = async () => {
    try {
      const isAdmin = user?.role === 'admin';
      const [fetchedProducts, fetchedCategories, fetchedOrders] = await Promise.all([
        supabaseService.getProducts(isAdmin),
        supabaseService.getCategories(),
        user ? supabaseService.getOrders(isAdmin ? undefined : user.id) : Promise.resolve([])
      ]);
      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const currentUser = await supabaseService.getCurrentUser();
      setUser(currentUser);
      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            fullName: session.user.user_metadata.full_name || 'Anonymous',
            role: session.user.user_metadata.role || 'user'
          });
        } else {
          setUser(null);
        }
      });
    };
    initAuth();
  }, []);

  useEffect(() => {
    loadData();
    const savedCart = localStorage.getItem('automatehub_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    const pollInterval = setInterval(() => { if (user) loadData(); }, 10000);
    return () => clearInterval(pollInterval);
  }, [user]);

  useEffect(() => {
    localStorage.setItem('automatehub_cart', JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleExplore = (slug?: string) => {
    setActiveCategorySlug(slug || null);
    setView('store');
    window.scrollTo(0, 0);
  };

  const handleCheckout = async () => {
    if (!user) { setView('login'); return; }
    setIsProcessing(true);
    const total = cart.reduce((sum, item) => sum + (item.discountPrice || item.price) * item.quantity, 0);
    const newOrder: Order = {
      id: crypto.randomUUID(),
      userId: user.id,
      items: [...cart],
      totalAmount: total,
      status: OrderStatus.PENDING,
      createdAt: new Date().toISOString()
    };
    setCurrentOrder(newOrder);
    setIsPaymentModalOpen(true);
    setIsProcessing(false);
  };

  const handlePaymentSuccess = async (screenshotUrl: string, transactionId: string) => {
    if (!currentOrder) return;
    setIsProcessing(true);
    setIsPaymentModalOpen(false);
    try {
      const finalizedOrder = { ...currentOrder, screenshotUrl, transactionId, status: OrderStatus.AWAITING_VERIFICATION };
      await supabaseService.saveOrder(finalizedOrder);
      await loadData();
      setCart([]);
      setCurrentOrder(null);
      setIsProcessing(false);
      setView('dashboard');
    } catch (error: any) {
      setIsProcessing(false);
      alert(`Error: ${error.message}`);
    }
  };

  const handleDashboardClick = () => {
    if (user) setView('dashboard');
    else setView('login');
  };

  const handleLogout = async () => {
    try {
      await supabaseService.signOut();
      setUser(null);
      setView('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const initialCategoryId = activeCategorySlug ? categories.find(c => c.slug === activeCategorySlug)?.id : undefined;

  const noNavViews: View[] = ['admin', 'admin-login'];
  const noFooterViews: View[] = ['admin', 'login', 'admin-login', 'dashboard'];

  return (
    <div className="min-h-screen bg-brand-primary">
      {!noNavViews.includes(view) && (
        <Navbar
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          onCartClick={handleCheckout}
          onStoreClick={() => handleExplore()}
          onHomeClick={() => { setView('home'); window.scrollTo(0, 0); }}
          onAdminClick={() => setView('admin')}
          onDashboardClick={handleDashboardClick}
          onProjectClick={() => setView('about')}
          onAboutClick={() => { setView('about'); window.scrollTo(0, 0); }}
          onLogout={handleLogout}
          user={user}
        />
      )}

      <main className="transition-all duration-300" key={view}>
        <div className="animate-page-enter">
          {view === 'home' && (
            <Landing
              categories={categories}
              featuredProducts={products.slice(0, 6)}
              onExplore={handleExplore}
              onViewProduct={(id) => { setSelectedProductId(id); setView('product'); }}
              onAddToCart={handleAddToCart}
              onRequestCustom={() => { setView('about'); window.scrollTo(0, 0); }}
              onLogin={() => setView('login')}
              onPricingClick={() => {}}
            />
          )}

          {view === 'login' && (
            <LoginPage
              onLoginSuccess={(loggedUser) => {
                setUser(loggedUser);
                setView(loggedUser.role === 'admin' ? 'admin' : 'dashboard');
              }}
              onAdminLogin={() => setView('admin-login')}
            />
          )}

          {view === 'admin-login' && (
            <AdminLoginPage
              onLoginSuccess={(loggedUser) => { setUser(loggedUser); setView('admin'); }}
              onBackToSite={() => setView('login')}
            />
          )}

          {view === 'store' && (
            <TemplatesPage
              products={products}
              categories={categories}
              initialCategoryId={initialCategoryId}
              onViewProduct={(id) => { setSelectedProductId(id); setView('product'); }}
              onAddToCart={handleAddToCart}
              onBuySubscription={() => setView('login')}
            />
          )}

          {view === 'dashboard' && (
            <UserDashboard
              user={user}
              orders={orders}
              onBrowseTemplates={() => handleExplore()}
            />
          )}

          {view === 'about' && <AboutPage />}

          {view === 'admin' && (
            <AdminDashboard
              products={products}
              orders={orders}
              categories={categories}
              onRefresh={loadData}
              onBack={() => setView('home')}
            />
          )}
        </div>
      </main>

      {!noFooterViews.includes(view) && (
        <Footer onLinkClick={(v) => { setView(v); window.scrollTo(0, 0); }} />
      )}

      {isProcessing && (
        <div className="fixed inset-0 z-[400] bg-brand-primary/95 backdrop-blur-xl flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 text-purple-400 animate-spin mb-4" />
          <h2 className="text-xl font-heading font-bold text-white">Processing...</h2>
        </div>
      )}

      {isPaymentModalOpen && currentOrder && (
        <ManualUPIModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          orderId={currentOrder.id}
          amount={currentOrder.totalAmount}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default App;
