import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { signOutUser } from '../lib/firebase';
import { ShieldX, LogOut, Mail } from 'lucide-react';
import { motion } from 'motion/react';

export const RejectedPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAppStore();

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
        className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-rose-200/90 p-8 sm:p-10 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-6 shadow-md shadow-rose-500/10">
          <ShieldX className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold uppercase tracking-wider mb-3">
          <span>Access Restricted</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Application Not Approved
        </h2>

        <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          Your student registration request for <strong className="text-slate-900">{currentUser?.email}</strong> was reviewed and declined by the administrator. Access to protected learning hub courses and internal materials is restricted.
        </p>

        <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1">
          <p className="font-semibold text-slate-700">Need clarification?</p>
          <p className="text-slate-500">
            If you believe this decision was made in error or wish to appeal, please contact the administrator via email at <strong className="text-slate-800">laxmikanttalli303@gmail.com</strong>.
          </p>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Return to Sign In</span>
        </button>
      </motion.div>

    </div>
  );
};
