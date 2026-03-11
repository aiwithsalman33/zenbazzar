
import React, { useState } from 'react';
import {
  Zap, ArrowRight, Play, Star, ChevronDown, ChevronUp,
  Check, Shield, Download, Globe, Mail, MessageSquare,
  Users, Package, Workflow, Bot, Sparkles, Code, FileJson,
  BarChart3, ShoppingBag, Bell, Cpu, Rocket, Lock
} from 'lucide-react';
import { Category, Product, PLAN_CONFIG, PlanTier } from '../types';

interface LandingProps {
  categories: Category[];
  featuredProducts: Product[];
  onExplore: (catSlug?: string) => void;
  onViewProduct: (id: string) => void;
  onAddToCart: (product: Product) => void;
  onRequestCustom: () => void;
  onLogin: () => void;
  onPricingClick: () => void;
}

const INTEGRATIONS = [
  { name: 'Google Suite', icon: '🟢', desc: '600+ templates', color: '#34A853' },
  { name: 'ClickUp', icon: '🟣', desc: 'Task automation', color: '#7B68EE' },
  { name: 'Jira', icon: '🔵', desc: 'Dev workflows', color: '#0052CC' },
  { name: 'Slack', icon: '🔴', desc: 'Team alerts', color: '#E01E5A' },
  { name: 'Notion', icon: '⬛', desc: 'DB sync', color: '#FFFFFF' },
  { name: 'HubSpot', icon: '🟠', desc: 'CRM flows', color: '#FF7A59' },
  { name: 'Trello', icon: '🔷', desc: 'Board sync', color: '#0079BF' },
  { name: 'Airtable', icon: '🟡', desc: 'DB automation', color: '#FCB400' },
  { name: 'WhatsApp', icon: '💬', desc: 'Messaging', color: '#25D366' },
  { name: 'Telegram', icon: '✈️', desc: 'Bot flows', color: '#2AABEE' },
  { name: 'Shopify', icon: '🛒', desc: 'E-commerce', color: '#96BF48' },
  { name: 'Gmail', icon: '📧', desc: 'Email flows', color: '#EA4335' },
  { name: 'Google Sheets', icon: '📊', desc: 'Data sync', color: '#0F9D58' },
  { name: 'Google Drive', icon: '📁', desc: 'File automation', color: '#4285F4' },
  { name: 'Salesforce', icon: '☁️', desc: 'CRM pipeline', color: '#00A1E0' },
  { name: 'AI Agents', icon: '🤖', desc: 'GPT + Claude', color: '#6C63FF' },
  { name: 'GitHub', icon: '🐙', desc: 'Dev automation', color: '#6E5494' },
  { name: 'Twilio', icon: '📱', desc: 'SMS flows', color: '#F22F46' },
  { name: 'Stripe', icon: '💳', desc: 'Payment flows', color: '#635BFF' },
  { name: 'LinkedIn', icon: '🔗', desc: 'Lead gen', color: '#0077B5' },
  { name: 'Monday.com', icon: '📋', desc: 'Project mgmt', color: '#FF3D57' },
  { name: 'Asana', icon: '📌', desc: 'Task tracking', color: '#F06A6A' },
  { name: 'SendGrid', icon: '📨', desc: 'Email delivery', color: '#1A82E2' },
  { name: 'Zapier→n8n', icon: '⚡', desc: 'Migrations', color: '#FF4A00' },
];

const TESTIMONIALS = [
  {
    name: 'Rahul Sharma',
    role: 'Founder, TechFlow India',
    text: 'AutomateHub saved us 40+ hours/week. The Google Sheets + Slack integration templates alone were worth the Pro subscription.',
    stars: 5,
    avatar: '👨‍💼'
  },
  {
    name: 'Priya Nair',
    role: 'Operations Lead, ScaleUp',
    text: 'The n8n templates are incredibly well-structured. Downloaded 15 workflows and all of them worked flawlessly on first import.',
    stars: 5,
    avatar: '👩‍💼'
  },
  {
    name: 'Arjun Mehta',
    role: 'CTO, AutomateIndia',
    text: 'Best investment for our automation stack. The Zapier-to-n8n migration templates made our switch completely painless.',
    stars: 5,
    avatar: '👨‍💻'
  }
];

const FAQS = [
  {
    q: 'What are automation templates?',
    a: 'Our templates are ready-to-use n8n workflow JSON files. Simply import them into your n8n instance and customize for your needs. No coding required.'
  },
  {
    q: 'What is the monthly template drop?',
    a: 'Each month, we add brand new automation templates. Starter subscribers pay ₹49 and Pro subscribers pay ₹29 to unlock that month\'s new additions. These are on top of your plan\'s base library.'
  },
  {
    q: 'Can I buy individual templates without a subscription?',
    a: 'Yes! Every template has an individual purchase price. You can buy just the templates you need without subscribing to a plan.'
  },
  {
    q: 'What does "Starter" vs "Pro" unlock?',
    a: 'Starter unlocks 50+ curated basic templates. Pro unlocks 150+ templates including advanced AI agent workflows, more integrations, and beta early access.'
  },
  {
    q: 'Do the templates work with self-hosted n8n?',
    a: 'Yes! All our templates are fully compatible with both n8n Cloud and self-hosted n8n instances. We include setup documentation with each template.'
  },
  {
    q: 'What is your refund policy?',
    a: 'We offer a 7-day refund window for subscriptions if you\'re unsatisfied. Individual template purchases are non-refundable once downloaded.'
  }
];

const Landing: React.FC<LandingProps> = ({
  categories,
  featuredProducts,
  onExplore,
  onRequestCustom,
  onLogin,
  onPricingClick
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [enterpriseForm, setEnterpriseForm] = useState({ name: '', email: '', company: '', message: '' });
  const [enterpriseSubmitted, setEnterpriseSubmitted] = useState(false);

  const handleEnterpriseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    const whatsappMsg = `Hi, I'm ${enterpriseForm.name} from ${enterpriseForm.company}. ${enterpriseForm.message}`;
    window.open(`https://wa.me/918148035472?text=${encodeURIComponent(whatsappMsg)}`, '_blank');
    setEnterpriseSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-primary">

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-28 pb-24 overflow-hidden grid-bg">
        {/* Ambient glows */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-panel px-5 py-2.5 rounded-full mb-8 animate-fade-up">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-content-secondary tracking-wide">1,200+ Automation Templates Available</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white leading-none tracking-tight mb-6 animate-fade-up delay-100">
            Automate Everything.<br />
            <span className="gradient-text">Sell Your Workflows.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-content-secondary text-lg md:text-xl font-normal leading-relaxed mb-10 animate-fade-up delay-200">
            The #1 marketplace for n8n automation templates. Browse 1200+ battle-tested workflows for every tool your team uses.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-300">
            <button
              id="hero-browse-btn"
              onClick={() => onExplore()}
              className="btn-gradient px-8 py-4 rounded-2xl text-white font-semibold text-sm flex items-center gap-2 shadow-lg"
            >
              <Zap size={18} />
              Browse Templates
            </button>
            <button
              id="hero-trial-btn"
              onClick={onLogin}
              className="px-8 py-4 rounded-2xl glass-panel text-white font-semibold text-sm flex items-center gap-2 hover:bg-white/5 transition-all"
            >
              <Play size={16} />
              Start Free Trial
            </button>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-center gap-8 mt-16 animate-fade-up delay-400 flex-wrap">
            {[
              { value: '1,200+', label: 'Templates' },
              { value: '50+', label: 'Integrations' },
              { value: '5,000+', label: 'Users' },
              { value: '4.9★', label: 'Rating' }
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-heading font-bold gradient-text">{stat.value}</div>
                <div className="text-xs text-content-muted font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INTEGRATIONS GRID ===== */}
      <section className="py-20 bg-base-main/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <span className="tag-chip mb-4 inline-flex">50+ Integrations</span>
            <h2 className="text-4xl font-heading font-bold text-white mt-3">All Your Favorite Tools</h2>
            <p className="text-content-secondary mt-4 max-w-xl mx-auto">Browse workflows organized by the tool they automate. New integrations added every month.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {INTEGRATIONS.map((integration) => (
              <button
                key={integration.name}
                onClick={() => onExplore()}
                className="glass-panel rounded-2xl p-4 hover:glass-panel-purple transition-all group hover-card text-left"
              >
                <div className="text-2xl mb-2">{integration.icon}</div>
                <div className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors leading-tight">{integration.name}</div>
                <div className="text-xs text-content-muted mt-1">{integration.desc}</div>
              </button>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => onExplore()}
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-semibold transition-colors"
            >
              View all 50+ integrations <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <span className="tag-chip mb-4 inline-flex">Simple Process</span>
            <h2 className="text-4xl font-heading font-bold text-white mt-3">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-px bg-gradient-to-r from-purple-600/50 via-cyan-500/50 to-purple-600/50" />
            {[
              {
                step: '01',
                icon: <Globe size={28} />,
                title: 'Browse Templates',
                desc: 'Search 1200+ n8n workflows by category, integration, or keyword. Filter by plan tier or price.'
              },
              {
                step: '02',
                icon: <ShoppingBag size={28} />,
                title: 'Subscribe or Buy',
                desc: 'Choose a plan (₹499–₹999/year) for bulk access, or purchase individual templates one-time.'
              },
              {
                step: '03',
                icon: <Download size={28} />,
                title: 'Download & Deploy',
                desc: 'Get the .json workflow file instantly. Import into n8n and start automating within minutes.'
              }
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="gradient-border-card rounded-3xl p-8 hover-card h-full">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 rounded-2xl glass-panel-purple flex items-center justify-center text-purple-400">
                      {step.icon}
                    </div>
                    <span className="text-5xl font-heading font-bold text-white/10">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-content-secondary leading-relaxed text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING SECTION ===== */}
      <section id="pricing" className="py-20 bg-base-main/50 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
          <div className="text-center mb-14">
            <span className="tag-chip mb-4 inline-flex">Simple Pricing</span>
            <h2 className="text-4xl font-heading font-bold text-white mt-3">Choose Your Plan</h2>
            <p className="text-content-secondary mt-4 max-w-xl mx-auto">
              Start free or go Pro. Cancel anytime. Individual template purchases always available.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">

            {/* Starter */}
            <div className="gradient-border-card rounded-3xl p-8 flex flex-col hover-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Package size={20} className="text-green-400" />
                </div>
                <span className="tag-chip-green text-xs font-semibold px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400">Starter</span>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-heading font-bold text-white">₹499<span className="text-lg text-content-muted font-normal">/year</span></div>
                <div className="text-xs text-content-muted mt-1">+ ₹49/month for new drops</div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {PLAN_CONFIG[PlanTier.STARTER].features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-content-secondary">
                    <Check size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                id="starter-plan-btn"
                onClick={onLogin}
                className="w-full py-3.5 rounded-xl border border-green-500/30 text-green-400 font-semibold text-sm hover:bg-green-500/10 transition-all"
              >
                Get Starter
              </button>
            </div>

            {/* Pro — Featured */}
            <div className="relative rounded-3xl p-8 flex flex-col overflow-hidden plan-shine"
              style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.15) 0%, rgba(0,212,255,0.08) 100%)', border: '1px solid rgba(108,99,255,0.4)' }}>
              <div className="absolute top-4 right-4">
                <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-purple-600 text-white">Most Popular</span>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center">
                  <Rocket size={20} className="text-purple-400" />
                </div>
                <span className="tag-chip text-xs font-semibold px-3 py-1 rounded-full">Pro</span>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-heading font-bold text-white">₹999<span className="text-lg text-content-muted font-normal">/year</span></div>
                <div className="text-xs text-content-muted mt-1">+ ₹29/month for new drops</div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {PLAN_CONFIG[PlanTier.PRO].features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-content-secondary">
                    <Check size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                id="pro-plan-btn"
                onClick={onLogin}
                className="w-full py-3.5 rounded-xl btn-gradient text-white font-semibold text-sm shadow-lg shadow-purple-600/30"
              >
                Get Pro
              </button>
            </div>

            {/* Enterprise */}
            <div className="gradient-border-card rounded-3xl p-8 flex flex-col hover-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <Shield size={20} className="text-cyan-400" />
                </div>
                <span className="tag-chip-cyan text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">Enterprise</span>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-heading font-bold text-white">Custom</div>
                <div className="text-xs text-content-muted mt-1">Contact us for pricing</div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {PLAN_CONFIG[PlanTier.ENTERPRISE].features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-content-secondary">
                    <Check size={16} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                id="enterprise-plan-btn"
                onClick={onRequestCustom}
                className="w-full py-3.5 rounded-xl border border-cyan-500/30 text-cyan-400 font-semibold text-sm hover:bg-cyan-500/10 transition-all"
              >
                Contact Sales
              </button>
            </div>
          </div>

          <p className="text-center text-content-muted text-sm mt-8">
            🔒 Secure payments via Razorpay · No hidden fees · Cancel anytime
          </p>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <span className="tag-chip mb-4 inline-flex">Testimonials</span>
            <h2 className="text-4xl font-heading font-bold text-white mt-3">Loved by Automation Teams</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="gradient-border-card rounded-3xl p-8 hover-card">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <Star key={si} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-content-secondary text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="text-3xl">{t.avatar}</div>
                  <div>
                    <div className="font-semibold text-white text-sm">{t.name}</div>
                    <div className="text-xs text-content-muted">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="py-20 bg-base-main/50">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <span className="tag-chip mb-4 inline-flex">FAQ</span>
            <h2 className="text-4xl font-heading font-bold text-white mt-3">Common Questions</h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="gradient-border-card rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-white/3 transition-colors"
                >
                  <span className="font-semibold text-white text-sm pr-4">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp size={18} className="text-purple-400 flex-shrink-0" />
                    : <ChevronDown size={18} className="text-content-muted flex-shrink-0" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6">
                    <p className="text-content-secondary text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ENTERPRISE CONTACT ===== */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="rounded-3xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.12) 0%, rgba(0,212,255,0.06) 100%)', border: '1px solid rgba(108,99,255,0.3)' }}>
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Left: Info */}
              <div className="p-10 lg:p-14 relative">
                <div className="tag-chip-cyan mb-4 inline-flex">Enterprise</div>
                <h2 className="text-3xl font-heading font-bold text-white mt-3 mb-4">Need a Custom Solution?</h2>
                <p className="text-content-secondary text-sm leading-relaxed mb-8">
                  Get full library access, dedicated support, and custom n8n workflow builds tailored to your business processes.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: <Shield size={16} />, label: 'Full library access + custom AI agents' },
                    { icon: <Bot size={16} />, label: 'Custom n8n workflow development' },
                    { icon: <Users size={16} />, label: 'Team collaboration tools' },
                    { icon: <Bell size={16} />, label: 'Dedicated support SLA' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-content-secondary">
                      <div className="text-cyan-400">{item.icon}</div>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-8 p-4 glass-panel rounded-2xl">
                  <MessageSquare size={18} className="text-green-400" />
                  <div>
                    <div className="text-xs text-content-muted">WhatsApp Direct</div>
                    <div className="font-semibold text-white text-sm">+91 81480 35472</div>
                  </div>
                </div>
              </div>

              {/* Right: Form */}
              <div className="p-10 lg:p-14 border-t md:border-t-0 md:border-l border-white/5">
                {enterpriseSubmitted ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mb-4">
                      <Check size={32} className="text-green-400" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-content-secondary text-sm">Our enterprise team will reach out within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleEnterpriseSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-1.5">Your Name</label>
                      <input
                        required
                        placeholder="John Doe"
                        value={enterpriseForm.name}
                        onChange={e => setEnterpriseForm({ ...enterpriseForm, name: e.target.value })}
                        className="dark-input w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-1.5">Work Email</label>
                      <input
                        type="email"
                        required
                        placeholder="john@company.com"
                        value={enterpriseForm.email}
                        onChange={e => setEnterpriseForm({ ...enterpriseForm, email: e.target.value })}
                        className="dark-input w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-1.5">Company Name</label>
                      <input
                        required
                        placeholder="Acme Corp"
                        value={enterpriseForm.company}
                        onChange={e => setEnterpriseForm({ ...enterpriseForm, company: e.target.value })}
                        className="dark-input w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-1.5">Message</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Tell us about your automation needs..."
                        value={enterpriseForm.message}
                        onChange={e => setEnterpriseForm({ ...enterpriseForm, message: e.target.value })}
                        className="dark-input w-full resize-none"
                      />
                    </div>
                    <button type="submit" className="w-full py-3.5 btn-gradient rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2">
                      <MessageSquare size={16} />
                      Contact Enterprise Team
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER CTA STRIP ===== */}
      <section className="py-16 bg-base-main/70">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">Ready to Automate?</h2>
          <p className="text-content-secondary mb-8">Join 5,000+ teams building automation workflows with AutomateHub.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => onExplore()}
              className="btn-gradient px-8 py-4 rounded-2xl text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-purple-600/30"
            >
              <Zap size={18} />
              Browse Templates
            </button>
            <button
              onClick={onLogin}
              className="px-8 py-4 rounded-2xl glass-panel text-white font-semibold text-sm hover:bg-white/5 transition-all"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
