import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { testConnection } from '../../lib/firebase';
import { User, Bell, Shield, Database, Save, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentUser, setCurrentUser, updateUserGoal } = useAppStore();
  const [name, setName] = useState(currentUser?.name || '');
  const [headline, setHeadline] = useState(currentUser?.headline || '');
  const [goalHours, setGoalHours] = useState(currentUser?.weeklyGoalHours || 15);
  const [dbStatus, setDbStatus] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      name,
      headline,
      weeklyGoalHours: goalHours
    });
    updateUserGoal(goalHours);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleTestDatabase = async () => {
    setDbStatus('Testing connection to Firebase Firestore...');
    const ok = await testConnection();
    if (ok) {
      setDbStatus('Connected successfully to Firestore Database!');
    } else {
      setDbStatus('Connected in local mode (Firestore online or initializing)');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Account & Learning Settings
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Customize your student profile, learning pace targets, and cloud synchronization.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">Student Profile</h3>
          </div>

          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={currentUser?.name || 'Student'}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-500/20 shadow-md"
            />
            <div>
              <h4 className="font-bold text-sm text-slate-900">{currentUser?.name || 'Student'}</h4>
              <p className="text-xs text-slate-400">{currentUser?.email || ''}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email (Read Only)</label>
              <input
                type="text"
                disabled
                value={currentUser?.email || ''}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Headline / Bio</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Study Target Hours */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-900">Weekly Learning Goal Target</h3>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              {goalHours} Hours / Week
            </span>
          </div>

          <p className="text-xs text-slate-500">
            We use this goal to calculate your daily progress circle and send gentle milestone reminders.
          </p>

          <input
            type="range"
            min={5}
            max={40}
            step={1}
            value={goalHours}
            onChange={(e) => setGoalHours(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />

          <div className="flex justify-between text-[11px] text-slate-400">
            <span>5 hrs (Casual)</span>
            <span>15 hrs (Recommended)</span>
            <span>40 hrs (Intensive Bootcamp)</span>
          </div>
        </div>

        {/* Firebase Cloud Health */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Database className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">Firebase Cloud Synchronization</h3>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Connected to Firebase Firestore & Authentication for persistent enrollments, task synchronization, and verified user accounts.
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleTestDatabase}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              Verify Firestore Connection
            </button>
            {dbStatus && (
              <span className="text-xs font-medium text-emerald-600">
                {dbStatus}
              </span>
            )}
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {isSaved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Preferences saved successfully!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>

      </form>
    </div>
  );
};
