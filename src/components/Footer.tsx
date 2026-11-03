import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { GraduationCap, Mail, Phone, MapPin, Send, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setAppMode, setPortalView } = useAppStore();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmailInput('');
      }, 2000);
    }
  };

  const scrollTo = (id: string) => {
    setAppMode('landing');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Newsletter (Screenshot 1 left) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Learn Hub
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering ambitious learners worldwide with high-demand tech abilities, hands-on design tracks, and career-advancing certifications.
            </p>

            {/* Newsletter Subscription (Matching Screenshot 1) */}
            <form onSubmit={handleSubscribe} className="pt-2 max-w-sm">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Subscribe for weekly free tutorials & scholarship drops:
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email..."
                    required
                    className="w-full pl-3.5 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  {subscribed ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Joined</span>
                    </>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <Send className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Col 2: Explore More */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Explore More
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => scrollTo('home')} className="hover:text-indigo-400 transition">
                  HOME
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('programs')} className="hover:text-indigo-400 transition">
                  PROGRAMS
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setAppMode('portal');
                    setPortalView('courses');
                  }}
                  className="hover:text-indigo-400 transition"
                >
                  COURSES CATALOG
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('about')} className="hover:text-indigo-400 transition">
                  ABOUT US
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('faq')} className="hover:text-indigo-400 transition">
                  FAQ & HELP
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Us (Matching Screenshot 1) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Contact us
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Sagrada Familia, Roma, Street Head 33A</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>learnhub.contact@gmail.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>021-9876-1197</span>
              </li>
            </ul>

            <div className="pt-2">
              <span className="block text-xs font-semibold text-slate-300 mb-2">Follow Us:</span>
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 cursor-pointer">
                  in
                </span>
                <span className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 cursor-pointer">
                  tw
                </span>
                <span className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 cursor-pointer">
                  fb
                </span>
                <span className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 cursor-pointer">
                  ig
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line matching reference */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>Copyright © 2026 LEARN HUB. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Cookie Preferences</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
