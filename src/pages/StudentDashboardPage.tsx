import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { 
  auth, 
  ADMIN_EMAIL, 
  seedCoursesToFirestore,
  subscribeToNotices,
  subscribeToLiveSessions,
  subscribeToQuizzes,
  seedInitialQuizzesIfEmpty
} from '../lib/firebase';
import { Sidebar } from '../components/Portal/Sidebar';
import { PortalHeader } from '../components/Portal/PortalHeader';
import { DashboardView } from '../components/Portal/DashboardView';
import { CoursesView } from '../components/Portal/CoursesView';
import { TasksView } from '../components/Portal/TasksView';
import { InboxView } from '../components/Portal/InboxView';
import { GroupsView } from '../components/Portal/GroupsView';
import { SettingsView } from '../components/Portal/SettingsView';
import { QuizzesView } from '../components/Portal/QuizzesView';
import { LiveSessionsView } from '../components/Portal/LiveSessionsView';
import { CertificatesView } from '../components/Portal/CertificatesView';
import { CoursePlayerModal } from '../components/Portal/CoursePlayerModal';
import { mockCourses } from '../data/mockData';

export const StudentDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentUser, 
    portalView, 
    setCourses,
    setNotices,
    setLiveSessions,
    setQuizzes
  } = useAppStore();

  useEffect(() => {
    const userEmail = (auth.currentUser?.email || currentUser?.email || '').toLowerCase().trim();

    // 1. Check if user is logged in
    if (!auth.currentUser && !currentUser) {
      navigate('/login', { replace: true });
      return;
    }

    // 2. Check if admin
    if (userEmail === ADMIN_EMAIL.toLowerCase() || currentUser?.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
      return;
    }

    // 3. Check student approval status
    if (currentUser?.status === 'pending') {
      navigate('/pending-approval', { replace: true });
      return;
    }

    if (currentUser?.status === 'rejected') {
      navigate('/rejected', { replace: true });
      return;
    }

    // Seed courses in Firestore if empty for approved student session
    seedCoursesToFirestore(mockCourses).then((dbCourses) => {
      setCourses(dbCourses);
    });

    seedInitialQuizzesIfEmpty().catch(console.error);

    // Set up real-time listeners for student portal
    const unsubNotices = subscribeToNotices(
      (items) => setNotices(items),
      (err) => console.error('Notices sub error:', err)
    );

    const unsubLive = subscribeToLiveSessions(
      (sessions) => setLiveSessions(sessions),
      (err) => console.error('Live sessions sub error:', err)
    );

    const unsubQuizzes = subscribeToQuizzes(
      (qList) => setQuizzes(qList),
      (err) => console.error('Quizzes sub error:', err)
    );

    return () => {
      unsubNotices();
      unsubLive();
      unsubQuizzes();
    };
  }, [currentUser, navigate, setCourses, setNotices, setLiveSessions, setQuizzes]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans antialiased text-slate-800">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <PortalHeader />

        <main className="flex-1 overflow-y-auto">
          {portalView === 'dashboard' && <DashboardView />}
          {portalView === 'courses' && <CoursesView />}
          {portalView === 'quizzes' && <QuizzesView />}
          {portalView === 'live' && <LiveSessionsView />}
          {portalView === 'certificates' && <CertificatesView />}
          {portalView === 'task' && <TasksView />}
          {portalView === 'inbox' && <InboxView />}
          {portalView === 'group' && <GroupsView />}
          {portalView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Interactive Course Player Modal */}
      <CoursePlayerModal />
    </div>
  );
};
