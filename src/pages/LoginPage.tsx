
import React, { useState } from 'react';
import { Mail, Lock, User, Loader2, ArrowRight, ShieldCheck, Zap, Package } from 'lucide-react';
import { supabaseService } from '../services/localService';

interface LoginPageProps {
  onLoginSuccess: (user: any) => void;
  onAdminLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onAdminLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await supabaseService.signIn(email, password);
      } else {
        await supabaseService.signUp(email, password, fullName);
      }
      const user = await supabaseService.getCurrentUser();
      if (user) {
        if (user.role === 'admin') {
          await supabaseService.signOut();
          throw new Error('Please use the Admin Portal to sign in as admin.');
        }
        onLoginSuccess(user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-primary flex relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 p-16 flex-col justify-between relative">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-600/30">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-xl font-heading font-bold text-white">AutomateHub</span>
        </div>

        <div>
          <h1 className="text-5xl font-heading font-bold text-white leading-tight mb-6">
            The Marketplace for<br />
            <span className="gradient-text">n8n Automation</span><br />
            Templates.
          </h1>
          <div className="space-y-5 max-w-sm">
            {[
              { icon: Zap, title: '1200+ Ready Workflows', desc: 'Import and start automating in minutes.' },
              { icon: Package, title: 'Starter to Enterprise', desc: 'Plans for every team size and budget.' },
              { icon: ShieldCheck, title: 'Verified Downloads', desc: 'Every workflow tested and documented.' }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl glass-panel-purple flex items-center justify-center flex-shrink-0">
                  <item.icon size={18} className="text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{item.title}</p>
                  <p className="text-content-muted text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-content-muted text-xs">© {new Date().getFullYear()} AutomateHub · Made in India 🇮🇳</p>
      </div>

      {/* Right panel: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="gradient-border-card rounded-3xl p-10">
            <div className="mb-8">
              <h2 className="text-3xl font-heading font-bold text-white mb-2">
                {isLogin ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="text-content-muted text-sm">
                {isLogin ? 'Sign in to access your automation library.' : 'Join 5000+ teams automating with n8n.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" size={16} />
                    <input
                      type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                      className="dark-input w-full pl-11" placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" size={16} />
                  <input
                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className="dark-input w-full pl-11" placeholder="you@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" size={16} />
                  <input
                    type="password" required value={password} onChange={e => setPassword(e.target.value)}
                    className="dark-input w-full pl-11" placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10">
                  <p className="text-red-400 text-xs font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit" disabled={loading}
                className="w-full py-4 btn-gradient rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : (
                  <>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="text-sm text-content-muted hover:text-white transition-colors">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span className="text-purple-400 font-semibold">{isLogin ? 'Sign Up' : 'Sign In'}</span>
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <button
                onClick={onAdminLogin}
                className="w-full py-3 glass-panel rounded-xl text-content-muted hover:text-white text-sm font-medium flex items-center justify-center gap-2 transition-all hover:bg-white/5"
              >
                <ShieldCheck size={15} /> Admin Portal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
