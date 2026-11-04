import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { signOutUser } from '../../lib/firebase';
import { 
  LayoutDashboard, 
  Mail, 
  BookOpen, 
  CheckSquare, 
  Users, 
  Settings, 
  LogOut, 
  GraduationCap,
  Sparkles,
  Video,
  Radio,
  Award
} from 'lucide-react';
import { PortalView } from '../../types';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { 
    portalView, 
    setPortalView, 
    setCurrentUser, 
    inboxMessages,
    notices,
    liveSessions,
    quizzes,
    tasks,
    quizSubmissions,
    isMobileMenuOpen,
    toggleMobileMenu
  } = useAppStore();

  const unreadMessagesCount = inboxMessages.filter((m) => m.unread).length + notices.length;
  const pendingTasksCount = tasks.filter((t) => !t.completed).length;
  const liveNowCount = liveSessions.filter((s) => s.status === 'live').length;
  const totalQuizzesCount = quizzes.length;
  const passedCertsCount = quizSubmissions.filter((s) => s.passed).length;

  const navItems: { 
    id: PortalView; 
    label: string; 
    icon: React.ComponentType<{ className?: string }>; 
    badge?: number | string;
    isLiveBadge?: boolean;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inbox', label: 'Inbox', icon: Mail, badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'quizzes', label: 'AI Quizzes', icon: Sparkles, badge: totalQuizzesCount > 0 ? totalQuizzesCount : undefined },
    { id: 'live', label: 'Live Sessions', icon: Radio, badge: liveNowCount > 0 ? 'LIVE' : (liveSessions.length > 0 ? liveSessions.length : undefined), isLiveBadge: liveNowCount > 0 },
    { id: 'certificates', label: 'Certificates', icon: Award, badge: passedCertsCount > 0 ? passedCertsCount : undefined },
    { id: 'task', label: 'Task', icon: CheckSquare, badge: pendingTasksCount > 0 ? pendingTasksCount : 3 },
    { id: 'group', label: 'Group', icon: Users },
  ];

  const handleSignOut = async () => {
    await signOutUser();
    setCurrentUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div 
          onClick={toggleMobileMenu}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside className={`w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between h-screen fixed md:static inset-y-0 left-0 z-50 transform ${
        isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
      } transition-transform duration-300 ease-in-out shrink-0 select-none`}>
      
      {/* Top Brand Logo matching Screenshot 2 */}
      <div>
        <div 
          onClick={() => { navigate('/'); if (isMobileMenuOpen) toggleMobileMenu(); }}
          className="p-6 flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-indigo-600 transition-colors shadow-sm">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-xl text-slate-900 tracking-tight block">
              Learn Hub
            </span>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
              Student Workspace
            </span>
          </div>
        </div>

        {/* Navigation Items (Matching Screenshot 2 Sidebar) */}
        <nav className="px-4 py-2 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = portalView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setPortalView(item.id);
                  if (isMobileMenuOpen) toggleMobileMenu();
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold flex items-center gap-1 ${
                      item.isLiveBadge
                        ? 'bg-rose-500 text-white animate-pulse'
                        : isActive
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'bg-indigo-50 text-indigo-700'
                    }`}
                  >
                    {item.isLiveBadge && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions (Settings, Sign Out) */}
      <div className="p-4 border-t border-slate-100 space-y-1">
        <button
          onClick={() => setPortalView('settings')}
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
            portalView === 'settings'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-5 h-5 text-slate-400" />
          <span>Settings</span>
        </button>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5 text-rose-500" />
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
    </>
  );
};
