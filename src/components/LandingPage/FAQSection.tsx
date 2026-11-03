import React, { useState } from 'react';
import { mockFAQs } from '../../data/mockData';
import { Plus, X, HelpCircle, CheckCircle2, Clock, Sparkles, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 bg-slate-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently asked Questions
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Everything you need to know about starting your learning journey with Learn Hub.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Accordion Items (Matching Screenshot 1) */}
          <div className="lg:col-span-7 space-y-4">
            {mockFAQs.map((faq, idx) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl transition-all duration-200 border ${
                    isOpen
                      ? 'bg-blue-50/90 border-blue-200 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        isOpen ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className={`text-sm sm:text-base font-bold ${
                        isOpen ? 'text-blue-950' : 'text-slate-800'
                      }`}>
                        {faq.question}
                      </span>
                    </div>

                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? 'bg-blue-200/80 text-blue-900' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {isOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-blue-100/60 mt-1">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Right Column: Illustrated Character with laptop (Matching Screenshot 1) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              
              {/* Floating decorative elements matching drawing in screenshot 1 */}
              <div className="absolute -top-6 left-12 w-10 h-10 rounded-xl bg-amber-100 border border-amber-300/60 flex items-center justify-center text-amber-700 shadow-sm animate-bounce duration-1000">
                <Clock className="w-5 h-5" />
              </div>

              <div className="absolute top-2 right-4 w-9 h-9 rounded-xl bg-indigo-100 border border-indigo-300/60 flex items-center justify-center text-indigo-700 shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>

              <div className="absolute bottom-16 -left-4 p-3 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-slate-700">Daily Study Streak: 14 Days</span>
              </div>

              {/* Modern Vector Style Card with Learner */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xl overflow-hidden relative">
                <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-indigo-50 via-teal-50 to-blue-50 flex items-center justify-center relative p-6">
                  {/* Stylized vector character illustration */}
                  <svg className="w-full h-full text-slate-800" viewBox="0 0 300 300" fill="none">
                    {/* Background blob */}
                    <circle cx="150" cy="150" r="120" fill="#E0F2FE" />
                    
                    {/* Girl hair */}
                    <path d="M90 120C90 70 120 40 160 40C205 40 230 70 230 120C230 130 220 145 220 145C220 145 235 170 225 190C215 210 195 215 195 215L195 180L105 180L105 215C105 215 85 210 75 190C65 170 80 145 80 145C80 145 70 130 70 120H90Z" fill="#1E293B" />
                    
                    {/* Face */}
                    <path d="M110 110C110 150 130 185 160 185C190 185 210 150 210 110C210 85 190 75 160 75C130 75 110 85 110 110Z" fill="#FDE68A" />
                    
                    {/* Glasses */}
                    <circle cx="138" cy="118" r="18" stroke="#0F172A" strokeWidth="4" fill="rgba(255,255,255,0.7)" />
                    <circle cx="182" cy="118" r="18" stroke="#0F172A" strokeWidth="4" fill="rgba(255,255,255,0.7)" />
                    <line x1="156" y1="118" x2="164" y2="118" stroke="#0F172A" strokeWidth="4" />
                    
                    {/* Eyes */}
                    <circle cx="138" cy="118" r="4" fill="#0F172A" />
                    <circle cx="182" cy="118" r="4" fill="#0F172A" />
                    
                    {/* Smile */}
                    <path d="M148 145Q160 155 172 145" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
                    
                    {/* Blue Shirt */}
                    <path d="M100 230C100 200 130 195 160 195C190 195 220 200 220 230L235 280H85L100 230Z" fill="#0284C7" />
                    
                    {/* Laptop */}
                    <path d="M110 240L160 215L210 240L190 280H130L110 240Z" fill="#CBD5E1" stroke="#475569" strokeWidth="3" />
                    <rect x="135" y="235" width="50" height="35" rx="3" fill="#38BDF8" />
                  </svg>
                </div>

                <div className="mt-4 text-center">
                  <h4 className="font-bold text-slate-900 text-sm">Dedicated Learner Assistance</h4>
                  <p className="text-xs text-slate-500 mt-1">Our support mentors reply within 15 minutes to all course inquiries.</p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
