
import React, { useState } from 'react';
import { Zap, Menu, X, User, LogOut, Settings, LayoutDashboard, ShoppingBag } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onStoreClick: () => void;
  onHomeClick: () => void;
  onAdminClick: () => void;
  onDashboardClick: () => void;
  onProjectClick: () => void;
  onAboutClick: () => void;
  onLogout: () => void;
  user: any;
}

const Navbar: React.FC<NavbarProps> = ({
  onStoreClick,
  onHomeClick,
  onAdminClick,
  onDashboardClick,
  onAboutClick,
  onLogout,
  user
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass-panel-dark border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <button
            onClick={onHomeClick}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-600/30">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-lg font-heading font-bold text-white group-hover:gradient-text transition-colors">
              AutomateHub
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={onHomeClick}
              className="text-sm font-medium text-content-secondary hover:text-white transition-colors"
            >
              Home
            </button>
            <button
              onClick={onStoreClick}
              className="text-sm font-medium text-content-secondary hover:text-white transition-colors"
            >
              Templates
            </button>
            <button
              onClick={onAboutClick}
              className="text-sm font-medium text-content-secondary hover:text-white transition-colors"
            >
              About
            </button>
            <button
              onClick={() => { onHomeClick(); setTimeout(() => { const el = document.getElementById('pricing'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 100); }}
              className="text-sm font-medium text-content-secondary hover:text-white transition-colors"
            >
              Pricing
            </button>
            {user?.role === 'admin' && (
              <button
                onClick={onAdminClick}
                className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors border-b border-purple-400/50"
              >
                Admin Panel
              </button>
            )}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={onDashboardClick}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-sm font-medium text-white hover:bg-white/5 transition-all"
                >
                  <LayoutDashboard size={15} />
                  Dashboard
                </button>
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl glass-panel-purple hover:bg-purple-600/20 transition-all"
                  >
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
                      <User size={12} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold text-white">{user.fullName?.split(' ')[0]}</span>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-12 w-48 glass-panel-dark rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-50 animate-fade-down">
                      <button
                        onClick={() => { onDashboardClick(); setUserMenuOpen(false); }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-content-secondary hover:text-white hover:bg-white/5 transition-all"
                      >
                        <LayoutDashboard size={15} /> Dashboard
                      </button>
                      <button
                        onClick={() => { onDashboardClick(); setUserMenuOpen(false); }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-content-secondary hover:text-white hover:bg-white/5 transition-all"
                      >
                        <Settings size={15} /> Settings
                      </button>
                      <div className="border-t border-white/5 my-1" />
                      <button
                        onClick={() => { onLogout(); setUserMenuOpen(false); }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={onDashboardClick}
                  className="text-sm font-medium text-content-secondary hover:text-white transition-colors px-3 py-2"
                >
                  Sign In
                </button>
                <button
                  onClick={onDashboardClick}
                  className="btn-gradient px-5 py-2.5 rounded-xl text-white font-semibold text-sm shadow-lg shadow-purple-600/20"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl glass-panel text-white"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-panel-dark border-t border-white/5 p-6 space-y-4 animate-fade-down">
          <button onClick={() => { onHomeClick(); setIsOpen(false); }} className="block w-full text-left text-sm font-medium text-content-secondary hover:text-white py-2">Home</button>
          <button onClick={() => { onStoreClick(); setIsOpen(false); }} className="block w-full text-left text-sm font-medium text-content-secondary hover:text-white py-2">Templates</button>
          <button onClick={() => { onAboutClick(); setIsOpen(false); }} className="block w-full text-left text-sm font-medium text-content-secondary hover:text-white py-2">About</button>
          {user?.role === 'admin' && (
            <button onClick={() => { onAdminClick(); setIsOpen(false); }} className="block w-full text-left text-sm font-medium text-purple-400 py-2">Admin Panel</button>
          )}
          <div className="pt-4 border-t border-white/5">
            {user ? (
              <>
                <button onClick={() => { onDashboardClick(); setIsOpen(false); }} className="w-full py-3 btn-gradient rounded-xl text-white font-semibold text-sm mb-2">Dashboard</button>
                <button onClick={() => { onLogout(); setIsOpen(false); }} className="w-full py-3 glass-panel rounded-xl text-red-400 font-semibold text-sm">Sign Out</button>
              </>
            ) : (
              <button onClick={() => { onDashboardClick(); setIsOpen(false); }} className="w-full py-3 btn-gradient rounded-xl text-white font-semibold text-sm">Get Started</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
