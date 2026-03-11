
import React, { useState } from 'react';
import { Phone, GraduationCap, Code2, Database, BrainCircuit, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

const ProjectPage: React.FC = () => {
    const [revealNumber, setRevealNumber] = useState(false);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-900"></div>
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-indigo-500/20 backdrop-blur-md px-4 py-2 rounded-full border border-indigo-400/30 mb-8 animate-fade-up">
                        <GraduationCap className="h-5 w-5 text-indigo-400" />
                        <span className="text-xs font-black font-poppins text-indigo-200 uppercase tracking-widest">For College Students</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black font-poppins text-white tracking-tighter mb-8 leading-tight animate-fade-up">
                        YOUR PROJECT<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">DONE RIGHT.</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-slate-300 text-lg md:text-xl font-medium mb-12 leading-relaxed animate-fade-up delay-100">
                        Struggling with your final year submission? We provide complete, defense-ready projects with documentation, source code, and explanation sessions.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-up delay-200">
                        <button
                            onClick={() => setRevealNumber(true)}
                            className={`px-10 py-5 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 text-sm uppercase tracking-widest active:scale-95 flex items-center gap-3 overflow-hidden relative group ${revealNumber ? 'w-auto' : ''}`}
                        >
                            <Phone size={20} className={`${revealNumber ? 'animate-bounce' : ''}`} />
                            <span className={`transition-all duration-500 ${revealNumber ? 'inline-block' : 'inline-block'}`}>
                                {revealNumber ? '+91 81480 35847' : 'Call Now For Project'}
                            </span>
                            {revealNumber && (
                                <a href="tel:+9181480358472" className="absolute inset-0 z-10 w-full h-full" onClick={(e) => e.stopPropagation()}></a>
                            )}
                        </button>
                    </div>
                </div>
            </section>

            {/* Domains Section */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tight mb-4">Domains We Cover</h2>
                        <p className="text-slate-500 font-medium max-w-2xl mx-auto">From cutting-edge AI to robust Enterprise Apps, we build IEEE standard projects.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* AI/ML */}
                        <div className="bg-white p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:scale-105 transition-transform duration-300 border border-slate-100 group">
                            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-100 transition-colors">
                                <BrainCircuit className="h-7 w-7 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-3 uppercase italic">AI & Machine Learning</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                Computer Vision, NLP models, Predictive Analytics, and Deep Learning implementations using Python & TensorFlow.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center text-sm font-bold text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Face Recognition Systems</li>
                                <li className="flex items-center text-sm font-bold text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Chatbots & Virtual Assistants</li>
                                <li className="flex items-center text-sm font-bold text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Disease Prediction Models</li>
                            </ul>
                        </div>

                        {/* Web Dev */}
                        <div className="bg-white p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 group">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                                <Code2 className="h-7 w-7 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-3 uppercase italic">Full Stack Web</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                MERN Stack (MongoDB, Express, React, Node), Next.js applications, and complex dashboard systems.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center text-sm font-bold text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> E-commerce Platforms</li>
                                <li className="flex items-center text-sm font-bold text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Learning Management Systems</li>
                                <li className="flex items-center text-sm font-bold text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Social Media Clones</li>
                            </ul>
                        </div>

                        {/* IoT & Blockchain */}
                        <div className="bg-white p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 group">
                            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-100 transition-colors">
                                <Database className="h-7 w-7 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-3 uppercase italic">Micro SaaS</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                Niche SaaS products built to solve specific business problems with scalable subscription models.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center text-sm font-bold text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Lead Management & CRM Tools</li>
                                <li className="flex items-center text-sm font-bold text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> AI-Based Content Automation</li>
                                <li className="flex items-center text-sm font-bold text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Workflow & Process Automation Tools</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Bottom */}
            <section className="py-20 bg-white border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight mb-6">Deadlines Approaching?</h2>
                    <p className="text-slate-500 text-lg mb-10 font-medium">Get your synopsis, diagrams, and running code within 24 hours.</p>
                    <a
                        href="tel:+9181480358472"
                        className="inline-flex items-center justify-center px-12 py-6 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 text-sm uppercase tracking-widest group"
                    >
                        <Phone className="mr-3 group-hover:animate-pulse" />
                        Contact For Instant Support
                    </a>
                </div>
            </section>
        </div>
    );
};

export default ProjectPage;
