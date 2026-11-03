import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { 
  registerWithEmailAndPassword, 
  syncUserProfile 
} from '../lib/firebase';
import { GraduationCap, Lock, Mail, User, AlertCircle, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAppStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const user = await registerWithEmailAndPassword(name, email, password);
      // Profile created with status 'pending' and role 'student' by default
      const profile = await syncUserProfile(user, name);
      setCurrentUser(profile);

      // Rule 4: Redirect to pending approval page
      navigate('/pending-approval', { replace: true });
    } catch (err: any) {
      console.error('Registration error:', err);
      let msg = 'Failed to register account. Please try again.';
      if (err.code === 'auth/operation-not-allowed') {
        msg = 'Email/Password sign-up is not enabled yet in your Firebase Console. Please enable "Email/Password" under Authentication > Sign-in method in Firebase Console.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email address already exists. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (err.message) {
        msg = err.message;
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* Top Brand Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/25 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-7 h-7" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            Learn Hub
          </span>
        </Link>
        <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create Account
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Register your student profile to request access to courses
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-200/80"
        >
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {/* Note on pending approval */}
            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
              <span className="text-base leading-none">⏳</span>
              <span>
                New student registrations are reviewed by the platform administrator before access to courses is granted.
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering Account...</span>
                </>
              ) : (
                <>
                  <span>Submit Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-medium tracking-wider">
                  Or register with
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                setIsLoading(true);
                setErrorMessage('');
                try {
                  const { signInWithGoogleAuth } = await import('../lib/firebase');
                  const user = await signInWithGoogleAuth();
                  const profile = await syncUserProfile(user);
                  setCurrentUser(profile);
                  if (profile.role === 'admin') {
                    navigate('/admin/dashboard', { replace: true });
                  } else if (profile.status === 'approved') {
                    navigate('/student/dashboard', { replace: true });
                  } else {
                    navigate('/pending-approval', { replace: true });
                  }
                } catch (err: any) {
                  if (err.code !== 'auth/popup-closed-by-user') {
                    setErrorMessage(err.message || 'Google registration could not be completed.');
                  }
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
              className="mt-4 w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-medium text-xs sm:text-sm text-slate-700 transition cursor-pointer disabled:opacity-60"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span>Google Account</span>
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700">
              Sign In
            </Link>
          </div>
        </motion.div>
      </div>

    </div>
  );
};
