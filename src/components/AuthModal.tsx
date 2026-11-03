import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { signInWithGoogleAuth } from '../lib/firebase';
import { X, GraduationCap, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalMode, closeAuth, setCurrentUser, openAuth, setAppMode, setPortalView } = useAppStore();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isAuthModalOpen) return null;

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const user = await signInWithGoogleAuth();
      if (user) {
        setCurrentUser({
          id: user.uid,
          name: user.displayName || 'Learner',
          email: user.email || '',
          role: 'student',
          status: 'pending',
          avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          headline: 'Active Student at Learn Hub',
          weeklyGoalHours: 15,
          completedCoursesCount: 1,
          enrolledCoursesCount: 3
        });
        closeAuth();
        setAppMode('portal');
        setPortalView('dashboard');
      }
    } catch (err: unknown) {
      console.warn('Google sign in note:', err);
      // Fallback for popup blocked or guest flow
      setErrorMessage('Popup closed or blocked. You can continue instantly with Demo Student mode.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    setCurrentUser({
      id: 'jason_duello',
      name: name.trim() || 'Jason Duello',
      email: email.trim() || 'jason.duello@learnhub.edu',
      role: 'student',
      status: 'pending',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      headline: 'Aspiring Full-Stack & UI/UX Specialist',
      weeklyGoalHours: 15,
      completedCoursesCount: 4,
      enrolledCoursesCount: 3
    });
    closeAuth();
    setAppMode('portal');
    setPortalView('dashboard');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100"
        >
          {/* Close Button */}
          <button
            onClick={closeAuth}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mb-3 shadow-lg shadow-indigo-600/25">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              {authModalMode === 'login' ? 'Welcome back to Learn Hub' : 'Create your Student Account'}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Access your personalized courses, statistics, and study groups
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl">
              {errorMessage}
            </div>
          )}

          {/* Google Auth Button (Firebase Auth) */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-medium text-slate-700 transition shadow-xs hover:border-slate-300 disabled:opacity-60"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isLoading ? 'Connecting to Firebase...' : 'Continue with Google'}</span>
          </button>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative bg-white px-3 text-xs text-slate-400 uppercase tracking-wider font-medium">
              or instant demo student
            </span>
          </div>

          {/* Form */}
          <div className="space-y-3">
            {authModalMode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jason Duello"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 text-sm"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 text-sm"
              />
            </div>

            <button
              onClick={handleDemoSignIn}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md shadow-indigo-600/25 transition cursor-pointer"
            >
              {authModalMode === 'login' ? 'Sign In as Jason Duello' : 'Create Free Account & Open Portal'}
            </button>
          </div>

          {/* Perks */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-around text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Free tracks
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Cloud Sync
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Certifications
            </span>
          </div>

          {/* Switch mode */}
          <div className="mt-4 text-center text-xs text-slate-500">
            {authModalMode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  onClick={() => openAuth('signup')}
                  className="text-indigo-600 font-semibold hover:underline cursor-pointer"
                >
                  Sign Up Free
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => openAuth('login')}
                  className="text-indigo-600 font-semibold hover:underline cursor-pointer"
                >
                  Log In
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
