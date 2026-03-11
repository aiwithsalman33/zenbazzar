
import React from 'react';
import {
  Zap, ArrowRight, Mail, MessageSquare, Phone, Globe, Twitter,
  Linkedin, Github, Heart
} from 'lucide-react';

interface FooterProps {
  onLinkClick: (view: any) => void;
}

const Footer: React.FC<FooterProps> = ({ onLinkClick }) => {
  return (
    <footer className="bg-base-main border-t border-white/5">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-600/30">
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-lg font-heading font-bold text-white">AutomateHub</span>
            </div>
            <p className="text-sm text-content-muted leading-relaxed mb-6">
              The #1 marketplace for n8n automation templates. Browse 1200+ battle-tested workflows.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 glass-panel rounded-xl flex items-center justify-center text-content-muted hover:text-purple-400 transition-colors">
                <Twitter size={15} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 glass-panel rounded-xl flex items-center justify-center text-content-muted hover:text-purple-400 transition-colors">
                <Linkedin size={15} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 glass-panel rounded-xl flex items-center justify-center text-content-muted hover:text-purple-400 transition-colors">
                <Github size={15} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-bold text-content-muted uppercase tracking-wider mb-5">Product</h4>
            <ul className="space-y-3">
              {[
                { label: 'Browse Templates', view: 'store' },
                { label: 'Pricing', view: 'home' },
                { label: 'Dashboard', view: 'dashboard' },
                { label: 'About Us', view: 'about' }
              ].map(link => (
                <li key={link.label}>
                  <button
                    onClick={() => onLinkClick(link.view)}
                    className="text-sm text-content-muted hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Integrations */}
          <div>
            <h4 className="text-xs font-bold text-content-muted uppercase tracking-wider mb-5">Integrations</h4>
            <ul className="space-y-3">
              {['Google Suite', 'Slack', 'Notion', 'HubSpot', 'Shopify', 'WhatsApp', 'AI Agents'].map(item => (
                <li key={item}>
                  <button
                    onClick={() => onLinkClick('store')}
                    className="text-sm text-content-muted hover:text-white transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold text-content-muted uppercase tracking-wider mb-5">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-content-muted">
                <MessageSquare size={15} className="text-green-400 flex-shrink-0" />
                <a href="https://wa.me/918148035472" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  WhatsApp: +91 81480 35472
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-content-muted">
                <Mail size={15} className="text-purple-400 flex-shrink-0" />
                <a href="mailto:support@automatehub.in" className="hover:text-white transition-colors">
                  support@automatehub.in
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-content-muted">
                <Globe size={15} className="text-cyan-400 flex-shrink-0" />
                <span>India · Remote First</span>
              </li>
            </ul>

            {/* Enterprise CTA */}
            <div className="mt-6 p-4 glass-panel-purple rounded-2xl">
              <p className="text-xs font-semibold text-purple-400 mb-2">Enterprise Solutions</p>
              <p className="text-xs text-content-muted mb-3">Need custom automation builds for your team?</p>
              <button
                onClick={() => onLinkClick('about')}
                className="text-xs font-semibold text-white hover:text-purple-400 transition-colors flex items-center gap-1"
              >
                Contact us <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-content-muted">
            © {new Date().getFullYear()} AutomateHub. Built with <Heart size={11} className="inline text-red-400" /> for automation teams.
          </p>
          <div className="flex items-center gap-6">
            <button className="text-xs text-content-muted hover:text-white transition-colors">Privacy Policy</button>
            <button className="text-xs text-content-muted hover:text-white transition-colors">Terms of Service</button>
            <button className="text-xs text-content-muted hover:text-white transition-colors">Refund Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
