import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { auth, ADMIN_EMAIL, signOutUser } from '../lib/firebase';
import { GraduationCap, LogIn, UserPlus, LogOut, LayoutDashboard, Shield, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userEmail = (currentUser?.email || auth.currentUser?.email || '').toLowerCase().trim();
  const isAdmin = userEmail === ADMIN_EMAIL.toLowerCase() || currentUser?.role === 'admin';

  const handleDashboardRedirect = () => {
    if (isAdmin) {
      navigate('/admin/dashboard');
    } else if (currentUser?.status === 'approved') {
      navigate('/student/dashboard');
    } else if (currentUser?.status === 'rejected') {
      navigate('/rejected');
    } else {
      navigate('/pending-approval');
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    setCurrentUser(null);
    navigate('/login');
  };

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group select-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                Learn Hub
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium -mt-1 hidden sm:block">Knowledge & Abilities</p>
          </div>
        </Link>

        {/* Center Navigation Links (Public Info Only) */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollTo('home')}
            className="text-xs font-bold tracking-wider uppercase text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => scrollTo('about')}
            className="text-xs font-bold tracking-wider uppercase text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            About Us
          </button>
          <button
            onClick={() => scrollTo('curriculum')}
            className="text-xs font-bold tracking-wider uppercase text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            Programs
          </button>
          <button
            onClick={() => scrollTo('faq')}
            className="text-xs font-bold tracking-wider uppercase text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            FAQ
          </button>
          <button
            onClick={() => scrollTo('contact')}
            className="text-xs font-bold tracking-wider uppercase text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            Contact
          </button>
        </nav>

        {/* Right Action Bar: Clean Login and Registration */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDashboardRedirect}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer border border-slate-200"
              >
                {isAdmin ? (
                  <>
                    <Shield className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Admin Portal</span>
                  </>
                ) : (
                  <>
                    <LayoutDashboard className="w-3.5 h-3.5 text-indigo-600" />
                    <span>My Dashboard</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSignOut}
                className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-bold tracking-wider uppercase text-slate-700 hover:text-indigo-600 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition cursor-pointer"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <button
            onClick={() => scrollTo('home')}
            className="block w-full text-left py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600"
          >
            Home
          </button>
          <button
            onClick={() => scrollTo('about')}
            className="block w-full text-left py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600"
          >
            About Us
          </button>
          <button
            onClick={() => scrollTo('curriculum')}
            className="block w-full text-left py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600"
          >
            Programs Overview
          </button>
          <button
            onClick={() => scrollTo('faq')}
            className="block w-full text-left py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600"
          >
            FAQ
          </button>
          <button
            onClick={() => scrollTo('contact')}
            className="block w-full text-left py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600"
          >
            Contact
          </button>

          <div className="pt-3 border-t border-slate-100 flex gap-2">
            {currentUser ? (
              <button
                onClick={handleDashboardRedirect}
                className="w-full py-2.5 text-center text-xs font-bold rounded-xl bg-indigo-600 text-white"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-xs font-semibold rounded-xl border border-slate-200 text-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-xs font-bold rounded-xl bg-indigo-600 text-white"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
