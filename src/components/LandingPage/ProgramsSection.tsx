import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockPrograms } from '../../data/mockData';
import { useAppStore } from '../../store/useAppStore';
import { 
  Code, 
  GraduationCap, 
  Kanban, 
  Palette, 
  Calculator, 
  Users, 
  Megaphone, 
  ArrowRight, 
  Star,
  CheckCircle,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProgramsSection: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppStore();
  const [activeTab, setActiveTab] = useState('All');

  const categories = [
    { id: 'All', label: 'All Tracks', icon: GraduationCap },
    { id: 'Development', label: 'Development', icon: Code },
    { id: 'Design', label: 'Design', icon: Palette },
    { id: 'Project Manage', label: 'Project Manage', icon: Kanban },
    { id: 'Accountancy', label: 'Accountancy', icon: Calculator },
    { id: 'Human Resource', label: 'Human Resource', icon: Users },
    { id: 'Marketing', label: 'Marketing', icon: Megaphone }
  ];

  const filteredPrograms = activeTab === 'All' 
    ? mockPrograms 
    : mockPrograms.filter((p) => p.category === activeTab);

  const handleProgramAction = () => {
    if (currentUser?.status === 'approved') {
      navigate('/student/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <section id="curriculum" className="py-20 bg-slate-50/60 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Discover The <br className="hidden sm:inline" />
            <span className="text-indigo-600">New In Programs</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500">
            Find the best tracks and professional paths for your career and future specialized field.
          </p>
        </div>

        {/* Category Filter Tabs with Icons */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* 8 Programs Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filteredPrograms.map((prog) => (
              <div
                key={prog.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-lg hover:border-indigo-200 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Circular Avatar / Badge matching reference */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-full ${prog.iconBg} flex items-center justify-center font-bold text-lg shadow-xs group-hover:scale-105 transition-transform`}>
                      {prog.title.charAt(0)}
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {prog.rating}
                    </span>
                  </div>

                  {/* Title & Organization */}
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {prog.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-400 mt-1">
                    {prog.organization} • <span className="text-slate-500">{prog.location}</span>
                  </p>

                  {/* Badges */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {prog.coverage}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                      {prog.stipend}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">
                    {prog.description}
                  </p>
                </div>

                {/* Footer action */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-teal-600 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Enrolling Open
                  </span>
                  <button
                    onClick={handleProgramAction}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                  >
                    <span>{currentUser?.status === 'approved' ? 'Open Track' : 'Request Access'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Register to unlock */}
        <div className="mt-12 text-center">
          <button
            onClick={handleProgramAction}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/25 transition cursor-pointer"
          >
            <span>{currentUser?.status === 'approved' ? 'Go to Student Dashboard' : 'Register to Unlock All Tracks'}</span>
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowRight className="w-3 h-3" />
            </div>
          </button>
        </div>

      </div>
    </section>
  );
};
