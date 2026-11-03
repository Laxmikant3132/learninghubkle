import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Search, FolderOpen, Award, Users, BookOpen, Sparkles, TrendingUp, Compass, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppStore();
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('All');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.status === 'approved') {
      navigate('/student/dashboard');
    } else {
      navigate('/login');
    }
  };

  const highlightCards = [
    {
      title: '50k+ Learners',
      subtitle: 'Enrolled across 85+ countries',
      bg: 'bg-amber-50/80 border-amber-200/50 text-amber-900',
      icon: Users
    },
    {
      title: '1,200+ Courses',
      subtitle: 'From frontend to design systems',
      bg: 'bg-blue-50/80 border-blue-200/50 text-blue-900',
      icon: BookOpen
    },
    {
      title: '98% Success',
      subtitle: 'Learners achieving career goals',
      bg: 'bg-indigo-50/80 border-indigo-200/50 text-indigo-900',
      icon: TrendingUp
    },
    {
      title: 'Top 1% Mentors',
      subtitle: 'Direct feedback from industry leads',
      bg: 'bg-emerald-50/80 border-emerald-200/50 text-emerald-900',
      icon: Sparkles
    },
    {
      title: 'Global Certs',
      subtitle: 'Verifiable portfolio credentials',
      bg: 'bg-orange-50/80 border-orange-200/50 text-orange-900',
      icon: Award
    },
    {
      title: 'Study Circles',
      subtitle: 'Collaborative real-time peer groups',
      bg: 'bg-teal-50/80 border-teal-200/50 text-teal-900',
      icon: Compass
    }
  ];

  return (
    <section id="home" className="relative overflow-hidden pt-12 pb-20">
      {/* Soft Aura Gradient at Top matching screenshot 1 */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] pointer-events-none -z-10 opacity-60 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(167, 243, 208, 0.4) 0%, rgba(199, 210, 254, 0.35) 45%, rgba(255, 255, 255, 0) 70%)'
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Top Pill Badge matching reference */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200/80 shadow-xs text-xs font-semibold text-slate-700 mb-6 backdrop-blur-sm"
        >
          <span className="text-base">🎓</span>
          <span>Online Platform for Skill Training & Knowledge</span>
        </motion.div>

        {/* Hero Headline matching reference */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto"
        >
          Let’s Learn about new <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600">
            Knowledge and abilities.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-5 text-base sm:text-lg text-slate-500 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Learn & grow with industry-standard curriculum, practical projects, verified certificates, and an interactive learner portal.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-6 flex items-center justify-center gap-3 flex-wrap"
        >
          <Link
            to="/register"
            className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 transition flex items-center gap-2"
          >
            <span>Register as Student</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm shadow-xs transition"
          >
            <span>Sign In</span>
          </Link>
        </motion.div>

        {/* Public Search Bar Form */}
        <motion.form
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleHeroSearch}
          className="mt-8 max-w-2xl mx-auto p-2 bg-white rounded-full shadow-xl shadow-slate-200/60 border border-slate-200 flex flex-col sm:flex-row items-center gap-2"
        >
          <div className="flex-1 flex items-center gap-2 px-3 w-full">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search programs, tracks, or topic..."
              className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
            />
          </div>

          <div className="hidden sm:block h-7 w-[1px] bg-slate-200" />

          <div className="flex items-center gap-2 px-3 w-full sm:w-auto">
            <FolderOpen className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-xs sm:text-sm text-slate-700 bg-transparent focus:outline-none cursor-pointer pr-4"
            >
              <option value="All">All Tracks</option>
              <option value="Front End">Front End</option>
              <option value="UI / UX Design">UI / UX Design</option>
              <option value="Branding">Branding</option>
              <option value="Data Science">Data Science</option>
              <option value="Computer Science">Computer Science</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition cursor-pointer shrink-0"
          >
            Explore
          </button>
        </motion.form>

        {/* 6 Pastel Highlight Cards Matching Screenshot 1 */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {highlightCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + idx * 0.05 }}
                className={`p-4 rounded-2xl border ${card.bg} text-left flex flex-col justify-between h-32 hover:scale-[1.03] transition-transform shadow-xs cursor-default`}
              >
                <div className="w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center shadow-xs">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-tight">{card.title}</h4>
                  <p className="text-[11px] opacity-75 leading-tight mt-0.5">{card.subtitle}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
