import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Search, Bell, ExternalLink, Check, Sparkles } from 'lucide-react';

export const PortalHeader: React.FC = () => {
  const { 
    currentUser, 
    globalSearchQuery, 
    setGlobalSearchQuery, 
    setPortalView, 
    inboxMessages 
  } = useAppStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = inboxMessages.filter(m => m.unread).length;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalSearchQuery(e.target.value);
    setPortalView('courses');
  };

  return (
    <header className="h-20 px-6 bg-white border-b border-slate-200/80 flex items-center justify-between gap-4 sticky top-0 z-20">
      
      {/* Search Input matching Screenshot 2 */}
      <div className="relative flex-1 max-w-xl">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={globalSearchQuery}
          onChange={handleSearchChange}
          placeholder="What do you want to learn"
          className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        />
        {globalSearchQuery && (
          <button
            onClick={() => setGlobalSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Right Action Icons: Notification bell, User chip, Landing toggle */}
      <div className="flex items-center gap-3">
        
        {/* Landing Page Button */}
        <Link
          to="/"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-100 border border-slate-200 transition"
        >
          <span>Landing Page</span>
          <ExternalLink className="w-3 h-3" />
        </Link>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Notifications ({unreadCount})</span>
                <button
                  onClick={() => setPortalView('inbox')}
                  className="text-[11px] font-semibold text-indigo-600 hover:underline"
                >
                  View Inbox
                </button>
              </div>

              <div className="mt-3 space-y-2.5 max-h-60 overflow-y-auto">
                {inboxMessages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setPortalView('inbox');
                      setShowNotifications(false);
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 cursor-pointer flex items-start gap-2.5"
                  >
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 truncate">{msg.senderName}</span>
                        <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Chip */}
        <div 
          onClick={() => setPortalView('settings')}
          className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-full hover:bg-slate-100 border border-slate-200/80 cursor-pointer transition select-none"
        >
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={currentUser?.name || 'User'}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-600/20"
          />
          <span className="text-xs sm:text-sm font-semibold text-slate-800 hidden sm:block">
            {currentUser?.name || 'Student'}
          </span>
        </div>

      </div>

    </header>
  );
};
