import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { auth, fetchUserDoc, signOutUser } from '../lib/firebase';
import { Clock, RefreshCw, LogOut, CheckCircle, GraduationCap, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export const PendingApprovalPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAppStore();
  const [isChecking, setIsChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const checkStatus = async () => {
    if (!auth.currentUser) {
      navigate('/login', { replace: true });
      return;
    }

    setIsChecking(true);
    setStatusMessage(null);

    try {
      const profile = await fetchUserDoc(auth.currentUser.uid);
      if (profile) {
        setCurrentUser(profile);
        if (profile.status === 'approved') {
          navigate('/student/dashboard', { replace: true });
          return;
        } else if (profile.status === 'rejected') {
          navigate('/rejected', { replace: true });
          return;
        } else {
          setStatusMessage('Your application is still under review by the administrator.');
        }
      }
    } catch (err) {
      console.error('Check status error:', err);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!auth.currentUser && !currentUser) {
      navigate('/login', { replace: true });
      return;
    }

    // If already approved, go to dashboard
    if (currentUser?.status === 'approved') {
      navigate('/student/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSignOut = async () => {
    await signOutUser();
    setCurrentUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200/90 p-8 sm:p-10 text-center"
      >
        {/* Animated Clock / Hourglass Icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-6 shadow-md shadow-amber-500/10">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
          <span>Status: Pending Admin Approval</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Application Under Review
        </h2>

        <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          Welcome to <strong className="text-slate-900">Learn Hub</strong>. Your student account registration has been submitted and is waiting for approval from the administrator.
        </p>

        {/* User Card */}
        <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-400">Account Name:</span>
            <span className="font-bold text-slate-800">{currentUser?.name || auth.currentUser?.displayName || 'Registered Student'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Email Address:</span>
            <span className="font-bold text-slate-800">{currentUser?.email || auth.currentUser?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Review Status:</span>
            <span className="font-bold text-amber-600">Pending Approval</span>
          </div>
        </div>

        {statusMessage && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-xs">
            {statusMessage}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={checkStatus}
            disabled={isChecking}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Checking Approval Status...' : 'Check Approval Status'}</span>
          </button>

          <button
            onClick={handleSignOut}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>Sign Out</span>
          </button>
        </div>

        <p className="mt-6 text-[11px] text-slate-400">
          Once approved by the administrator, you will immediately have access to course lessons, quizzes, and learner tools.
        </p>
      </motion.div>

    </div>
  );
};
