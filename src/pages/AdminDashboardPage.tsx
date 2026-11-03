import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { 
  auth, 
  ADMIN_EMAIL, 
  subscribeToRegisteredUsers, 
  updateStudentApprovalStatus, 
  signOutUser,
  createBroadcastNotice,
  deleteBroadcastNotice,
  subscribeToNotices,
  createLiveSession,
  updateLiveSessionStatus,
  deleteLiveSession,
  subscribeToLiveSessions,
  createQuiz,
  deleteQuiz,
  subscribeToQuizzes,
  subscribeToQuizSubmissions,
  seedInitialQuizzesIfEmpty
} from '../lib/firebase';
import { UserProfile, NoticeItem, LiveSession, Quiz, QuizSubmission, QuizQuestion } from '../types';
import { CertificateModal } from '../components/Portal/CertificateModal';
import { 
  ShieldCheck, 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  LogOut, 
  RefreshCw, 
  GraduationCap, 
  AlertCircle,
  Mail,
  Calendar,
  Check,
  X,
  Bell,
  Radio,
  Sparkles,
  Plus,
  Trash2,
  ExternalLink,
  BookOpen,
  Award,
  Video,
  Play,
  FileQuestion,
  HelpCircle,
  CheckSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type AdminTab = 'students' | 'notices' | 'live' | 'quizzes' | 'tasks';

const AI_TOPICS = [
  'AI Readiness & Literacy',
  'AI Fundamentals',
  'Generative AI',
  'Prompt Engineering',
  'AI Tools & Applications',
  'AI Ethics & Responsible AI'
] as const;

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, tasks, addTask, deleteTask } = useAppStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('students');
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [adminCertModalSubmission, setAdminCertModalSubmission] = useState<QuizSubmission | null>(null);

  // Form State: New Task Assignment
  const [taskForm, setTaskForm] = useState({
    title: '',
    courseName: 'AI Readiness & Literacy',
    priority: 'medium' as 'high' | 'medium' | 'low',
    dueDate: 'Sunday, 11:59 PM'
  });
  const [isAssigningTask, setIsAssigningTask] = useState(false);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [actionNotice, setActionNotice] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Form State: New Notice
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    content: '',
    priority: 'urgent' as 'urgent' | 'normal' | 'info',
    tag: 'Important Notice'
  });
  const [isPublishingNotice, setIsPublishingNotice] = useState(false);

  // Form State: New Live Session
  const [liveForm, setLiveForm] = useState({
    title: '',
    topic: 'Generative AI & LLM Systems',
    description: '',
    scheduledAt: new Date(Date.now() + 3600 * 1000 * 2).toISOString().slice(0, 16),
    durationMinutes: 60,
    meetingUrl: 'https://meet.google.com/new'
  });
  const [isSchedulingLive, setIsSchedulingLive] = useState(false);

  // Form State: New Quiz
  const [quizForm, setQuizForm] = useState({
    title: '',
    topic: 'Prompt Engineering' as typeof AI_TOPICS[number],
    description: '',
    durationMinutes: 10,
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        question: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        explanation: ''
      }
    ] as QuizQuestion[]
  });
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);

  // Enforce access control for designated admin
  useEffect(() => {
    const userEmail = (auth.currentUser?.email || currentUser?.email || '').toLowerCase().trim();
    const isAdmin = userEmail === ADMIN_EMAIL.toLowerCase() || currentUser?.role === 'admin';

    if (!auth.currentUser && !currentUser) {
      navigate('/login', { replace: true });
      return;
    }

    if (!isAdmin) {
      navigate('/login', { replace: true });
      return;
    }

    seedInitialQuizzesIfEmpty().catch(console.error);

    // 1. Subscribe to registered students
    const unsubStudents = subscribeToRegisteredUsers(
      (users) => {
        const registeredStudents = users.filter(
          (u) => u.email.toLowerCase().trim() !== ADMIN_EMAIL.toLowerCase()
        );
        setStudents(registeredStudents);
        setLoading(false);
      },
      (error) => {
        console.error('Failed to load students:', error);
        setLoading(false);
      }
    );

    // 2. Subscribe to notices
    const unsubNotices = subscribeToNotices(
      (items) => setNotices(items),
      (err) => console.error('Notices err:', err)
    );

    // 3. Subscribe to live sessions
    const unsubLive = subscribeToLiveSessions(
      (sessions) => setLiveSessions(sessions),
      (err) => console.error('Live err:', err)
    );

    // 4. Subscribe to quizzes
    const unsubQuizzes = subscribeToQuizzes(
      (qList) => setQuizzes(qList),
      (err) => console.error('Quizzes err:', err)
    );

    // 5. Subscribe to quiz submissions
    const unsubSubs = subscribeToQuizSubmissions(
      (sList) => setSubmissions(sList),
      (err) => console.error('Subs err:', err)
    );

    return () => {
      unsubStudents();
      unsubNotices();
      unsubLive();
      unsubQuizzes();
      unsubSubs();
    };
  }, [currentUser, navigate]);

  const handleUpdateStatus = async (student: UserProfile, newStatus: 'approved' | 'rejected') => {
    setProcessingId(student.id);
    try {
      await updateStudentApprovalStatus(student.id, newStatus);
      setActionNotice({
        message: `Account for ${student.name} (${student.email}) has been marked as ${newStatus.toUpperCase()}.`,
        type: newStatus === 'approved' ? 'success' : 'danger'
      });
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err: any) {
      console.error('Update status error:', err);
      setActionNotice({
        message: 'Failed to update student status. Check Firestore permissions.',
        type: 'danger'
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    setCurrentUser(null);
    navigate('/login', { replace: true });
  };

  // Broadcast Notice Creation
  const handlePublishNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.title.trim() || !noticeForm.content.trim()) return;

    setIsPublishingNotice(true);
    try {
      await createBroadcastNotice({
        title: noticeForm.title.trim(),
        content: noticeForm.content.trim(),
        priority: noticeForm.priority,
        tag: noticeForm.tag || 'Announcement',
        authorName: 'Administrator (Office of the Director)',
        authorEmail: ADMIN_EMAIL
      });

      setNoticeForm({
        title: '',
        content: '',
        priority: 'urgent',
        tag: 'Important Notice'
      });

      setActionNotice({
        message: 'Important notice has been broadcast to all students’ inboxes!',
        type: 'success'
      });
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err) {
      console.error('Failed to publish notice:', err);
      setActionNotice({
        message: 'Failed to publish notice. Check Firestore security permissions.',
        type: 'danger'
      });
    } finally {
      setIsPublishingNotice(false);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    try {
      await deleteBroadcastNotice(id);
      setActionNotice({ message: 'Notice removed successfully.', type: 'success' });
      setTimeout(() => setActionNotice(null), 3000);
    } catch (err) {
      console.error('Failed to delete notice:', err);
    }
  };

  // Live Session Scheduling
  const handleScheduleSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveForm.title.trim()) return;

    setIsSchedulingLive(true);
    try {
      await createLiveSession({
        title: liveForm.title.trim(),
        topic: liveForm.topic.trim(),
        description: liveForm.description.trim() || 'Interactive virtual live workshop.',
        scheduledAt: new Date(liveForm.scheduledAt).toISOString(),
        durationMinutes: Number(liveForm.durationMinutes) || 60,
        hostName: `Admin (${ADMIN_EMAIL})`,
        status: 'scheduled',
        meetingUrl: liveForm.meetingUrl.trim() || 'https://meet.google.com/new',
        attendeesCount: 0
      });

      setLiveForm({
        title: '',
        topic: 'Generative AI & LLM Systems',
        description: '',
        scheduledAt: new Date(Date.now() + 3600 * 1000 * 2).toISOString().slice(0, 16),
        durationMinutes: 60,
        meetingUrl: 'https://meet.google.com/new'
      });

      setActionNotice({
        message: 'Live Masterclass scheduled successfully! Students can now see it in their portal.',
        type: 'success'
      });
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err) {
      console.error('Schedule live error:', err);
      setActionNotice({
        message: 'Failed to schedule live session.',
        type: 'danger'
      });
    } finally {
      setIsSchedulingLive(false);
    }
  };

  const handleUpdateLiveStatus = async (sessionId: string, newStatus: 'scheduled' | 'live' | 'completed') => {
    try {
      await updateLiveSessionStatus(sessionId, newStatus);
      setActionNotice({
        message: `Live session status updated to ${newStatus.toUpperCase()}`,
        type: 'success'
      });
      setTimeout(() => setActionNotice(null), 3000);
    } catch (err) {
      console.error('Update live status error:', err);
    }
  };

  const handleDeleteLiveSession = async (sessionId: string) => {
    try {
      await deleteLiveSession(sessionId);
      setActionNotice({ message: 'Live session deleted.', type: 'success' });
      setTimeout(() => setActionNotice(null), 3000);
    } catch (err) {
      console.error('Delete live session error:', err);
    }
  };

  // Quiz Creation
  const handleAddQuestionToForm = () => {
    setQuizForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: `q${prev.questions.length + 1}`,
          question: '',
          options: ['', '', '', ''],
          correctAnswerIndex: 0,
          explanation: ''
        }
      ]
    }));
  };

  const handleRemoveQuestionFromForm = (index: number) => {
    if (quizForm.questions.length <= 1) return;
    setQuizForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizForm.title.trim()) return;

    // Validate that questions are filled
    const invalidQ = quizForm.questions.some(q => !q.question.trim() || q.options.some(o => !o.trim()));
    if (invalidQ) {
      setActionNotice({
        message: 'Please fill in all question prompts and their 4 answer choices.',
        type: 'danger'
      });
      return;
    }

    setIsCreatingQuiz(true);
    try {
      await createQuiz({
        title: quizForm.title.trim(),
        topic: quizForm.topic,
        description: quizForm.description.trim() || 'Comprehensive assessment created by administrator.',
        durationMinutes: Number(quizForm.durationMinutes) || 10,
        passingScore: Number(quizForm.passingScore) || 70,
        totalQuestions: quizForm.questions.length,
        questions: quizForm.questions
      });

      setQuizForm({
        title: '',
        topic: 'Prompt Engineering',
        description: '',
        durationMinutes: 10,
        passingScore: 70,
        questions: [
          {
            id: 'q1',
            question: '',
            options: ['', '', '', ''],
            correctAnswerIndex: 0,
            explanation: ''
          }
        ]
      });

      setActionNotice({
        message: 'New AI Quiz published! Students can now take this assessment.',
        type: 'success'
      });
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err) {
      console.error('Create quiz error:', err);
      setActionNotice({
        message: 'Failed to create quiz.',
        type: 'danger'
      });
    } finally {
      setIsCreatingQuiz(false);
    }
  };

  const handleDeleteQuizItem = async (quizId: string) => {
    try {
      await deleteQuiz(quizId);
      setActionNotice({ message: 'Quiz deleted.', type: 'success' });
      setTimeout(() => setActionNotice(null), 3000);
    } catch (err) {
      console.error('Delete quiz error:', err);
    }
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    if (filterTab !== 'all' && s.status !== filterTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (s.name || '').toLowerCase().includes(q);
      const matchEmail = (s.email || '').toLowerCase().includes(q);
      return matchName || matchEmail;
    }
    return true;
  });

  const totalCount = students.length;
  const pendingCount = students.filter((s) => s.status === 'pending').length;
  const approvedCount = students.filter((s) => s.status === 'approved').length;
  const rejectedCount = students.filter((s) => s.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Admin Top Navigation */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight">Learn Hub</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-[10px] font-bold tracking-wider uppercase border border-indigo-400/30">
                  Admin Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Designated Super Admin Management</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 font-mono text-[11px]">{ADMIN_EMAIL}</span>
            </div>

            <button
              onClick={handleSignOut}
              className="px-3.5 py-2 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </div>

        {/* Admin Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 border-t border-slate-800/80 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'students'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Student Approvals</span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'notices'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Broadcast Notices ({notices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('live')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'live'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Live Sessions ({liveSessions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'quizzes'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Quizzes & Submissions ({quizzes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'tasks'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Course Assignments ({tasks.length})</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Action Notice Toast */}
        <AnimatePresence>
          {actionNotice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-center justify-between gap-3 shadow-md ${
                actionNotice.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {actionNotice.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <span className="font-semibold">{actionNotice.message}</span>
              </div>
              <button
                onClick={() => setActionNotice(null)}
                className="text-xs font-bold hover:underline cursor-pointer"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TAB 1: STUDENT APPROVALS */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Registered Student Approvals
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Review new registrations and grant or revoke student access to Learn Hub courses.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Total Registered
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">{totalCount}</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-amber-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                    Pending Review
                  </span>
                  <h3 className="text-2xl font-black text-amber-700 mt-1">{pendingCount}</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-emerald-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    Approved Students
                  </span>
                  <h3 className="text-2xl font-black text-emerald-700 mt-1">{approvedCount}</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-rose-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
                    Rejected
                  </span>
                  <h3 className="text-2xl font-black text-rose-700 mt-1">{rejectedCount}</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <XCircle className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Filters and Search Bar */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setFilterTab('all')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    filterTab === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({totalCount})
                </button>
                <button
                  onClick={() => setFilterTab('pending')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    filterTab === 'pending'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending ({pendingCount})</span>
                </button>
                <button
                  onClick={() => setFilterTab('approved')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    filterTab === 'approved'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approved ({approvedCount})</span>
                </button>
                <button
                  onClick={() => setFilterTab('rejected')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    filterTab === 'rejected'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Rejected ({rejectedCount})</span>
                </button>
              </div>

              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student name or email..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Student Records Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
                  <span>Loading registered students from Firestore...</span>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs">
                  <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-bold text-slate-700">No student records found</p>
                  <p className="mt-1">
                    {searchQuery ? 'Try matching another name or email address.' : 'No students in this filter category.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                        <th className="py-4 px-6">Student Information</th>
                        <th className="py-4 px-6">Email Address</th>
                        <th className="py-4 px-6">Registered On</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6 text-right">Approval Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudents.map((student) => {
                        const isProcessing = processingId === student.id;
                        const statusPills = {
                          pending: 'bg-amber-50 text-amber-800 border-amber-200',
                          approved: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                          rejected: 'bg-rose-50 text-rose-800 border-rose-200'
                        };
                        const formattedDate = student.createdAt 
                          ? new Date(student.createdAt).toLocaleDateString(undefined, { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            }) 
                          : 'Recent';

                        return (
                          <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <img
                                  src={student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                                  alt={student.name}
                                  className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                                />
                                <div>
                                  <span className="font-bold text-slate-900 block">{student.name || 'Unnamed Student'}</span>
                                  <span className="text-[10px] text-slate-400">{student.headline || 'Student'}</span>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-6 text-slate-600 font-mono text-[11px]">
                              {student.email}
                            </td>

                            <td className="py-4 px-6 text-slate-500">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                <span>{formattedDate}</span>
                              </div>
                            </td>

                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${statusPills[student.status]}`}>
                                {student.status === 'pending' && <Clock className="w-3 h-3 text-amber-600" />}
                                {student.status === 'approved' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                                {student.status === 'rejected' && <XCircle className="w-3 h-3 text-rose-600" />}
                                <span>{student.status}</span>
                              </span>
                            </td>

                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {student.status !== 'approved' && (
                                  <button
                                    onClick={() => handleUpdateStatus(student, 'approved')}
                                    disabled={isProcessing}
                                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition cursor-pointer disabled:opacity-50"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Approve</span>
                                  </button>
                                )}

                                {student.status !== 'rejected' && (
                                  <button
                                    onClick={() => handleUpdateStatus(student, 'rejected')}
                                    disabled={isProcessing}
                                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center gap-1 transition cursor-pointer disabled:opacity-50"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                    <span>Reject</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: BROADCAST NOTICES */}
        {activeTab === 'notices' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Create Notice Form (5 cols) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 block">
                  Broadcast Center
                </span>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Publish Important Notice
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  This message will appear instantly in every student's Inbox and notify them on login.
                </p>
              </div>

              <form onSubmit={handlePublishNotice} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Notice Title</label>
                  <input
                    type="text"
                    required
                    value={noticeForm.title}
                    onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                    placeholder="e.g. Schedule Update: Live AI Masterclass on Friday"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Priority</label>
                    <select
                      value={noticeForm.priority}
                      onChange={(e) => setNoticeForm({ ...noticeForm, priority: e.target.value as any })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
                    >
                      <option value="urgent">Urgent Alert (Red)</option>
                      <option value="normal">Normal (Indigo)</option>
                      <option value="info">Informational (Blue)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tag / Category</label>
                    <input
                      type="text"
                      value={noticeForm.tag}
                      onChange={(e) => setNoticeForm({ ...noticeForm, tag: e.target.value })}
                      placeholder="e.g. Exam, Event, Notice"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Notice Content / Instructions</label>
                  <textarea
                    required
                    rows={5}
                    value={noticeForm.content}
                    onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                    placeholder="Type the announcement details here. All students will see this in their inbox..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPublishingNotice}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Bell className="w-4 h-4" />
                  <span>{isPublishingNotice ? 'Broadcasting...' : 'Publish Notice to All Students'}</span>
                </button>
              </form>
            </div>

            {/* Existing Broadcast Notices List (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-slate-900">
                  Active Published Broadcasts ({notices.length})
                </h3>
              </div>

              {notices.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs bg-white rounded-3xl border border-slate-200">
                  <Bell className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-bold text-slate-700">No broadcast notices published</p>
                  <p className="mt-1">Create your first broadcast using the composer on the left.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notices.map((notice) => (
                    <div
                      key={notice.id}
                      className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            notice.priority === 'urgent'
                              ? 'bg-rose-100 text-rose-700'
                              : notice.priority === 'info'
                              ? 'bg-sky-100 text-sky-700'
                              : 'bg-indigo-100 text-indigo-700'
                          }`}>
                            {notice.priority}
                          </span>
                          <span className="text-xs text-slate-400">• {notice.tag}</span>
                          <span className="text-[11px] text-slate-400">
                            {notice.createdAt ? new Date(notice.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-sm">{notice.title}</h4>
                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {notice.content}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteNotice(notice.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer shrink-0"
                        title="Delete Broadcast Notice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: LIVE SESSIONS MANAGER */}
        {activeTab === 'live' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Schedule Live Session Form (5 cols) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 block">
                  Interactive Live Room
                </span>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Schedule Live Session
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Host live interactive lectures, workshops, or Q&A meetings with students.
                </p>
              </div>

              <form onSubmit={handleScheduleSession} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Session Title</label>
                  <input
                    type="text"
                    required
                    value={liveForm.title}
                    onChange={(e) => setLiveForm({ ...liveForm, title: e.target.value })}
                    placeholder="e.g. Masterclass: Hands-on Prompt Engineering with LLMs"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Topic</label>
                  <input
                    type="text"
                    required
                    value={liveForm.topic}
                    onChange={(e) => setLiveForm({ ...liveForm, topic: e.target.value })}
                    placeholder="e.g. Generative AI, Prompt Engineering, AI Ethics"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={liveForm.scheduledAt}
                      onChange={(e) => setLiveForm({ ...liveForm, scheduledAt: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Duration (Mins)</label>
                    <input
                      type="number"
                      min={15}
                      max={240}
                      value={liveForm.durationMinutes}
                      onChange={(e) => setLiveForm({ ...liveForm, durationMinutes: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Meeting Link (Google Meet / Zoom)</label>
                  <input
                    type="url"
                    value={liveForm.meetingUrl}
                    onChange={(e) => setLiveForm({ ...liveForm, meetingUrl: e.target.value })}
                    placeholder="https://meet.google.com/xyz"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={liveForm.description}
                    onChange={(e) => setLiveForm({ ...liveForm, description: e.target.value })}
                    placeholder="Brief agenda for students attending this session..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSchedulingLive}
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Radio className="w-4 h-4" />
                  <span>{isSchedulingLive ? 'Scheduling...' : 'Schedule Live Masterclass'}</span>
                </button>
              </form>
            </div>

            {/* List of Live Sessions & Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900">
                Scheduled & Active Live Sessions ({liveSessions.length})
              </h3>

              {liveSessions.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs bg-white rounded-3xl border border-slate-200">
                  <Radio className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-bold text-slate-700">No live sessions scheduled</p>
                  <p className="mt-1">Schedule a new live masterclass for your students using the form.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {liveSessions.map((session) => {
                    const isLive = session.status === 'live';
                    const formattedDate = session.scheduledAt 
                      ? new Date(session.scheduledAt).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'TBD';

                    return (
                      <div
                        key={session.id}
                        className={`p-5 bg-white rounded-2xl border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isLive ? 'border-rose-300 ring-2 ring-rose-500/20' : 'border-slate-200'
                        }`}
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase flex items-center gap-1 ${
                              isLive
                                ? 'bg-rose-100 text-rose-700 animate-pulse'
                                : session.status === 'completed'
                                ? 'bg-slate-100 text-slate-600'
                                : 'bg-indigo-100 text-indigo-700'
                            }`}>
                              {isLive && <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />}
                              <span>{isLive ? 'Broadcasting Live' : session.status}</span>
                            </span>
                            <span className="text-xs text-slate-400">• {session.topic}</span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{session.durationMinutes}m</span>
                            </span>
                          </div>

                          <h4 className="font-bold text-slate-900 text-sm">{session.title}</h4>
                          <p className="text-xs text-slate-500 line-clamp-2">{session.description}</p>

                          <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{formattedDate}</span>
                            </span>
                            {session.meetingUrl && (
                              <a
                                href={session.meetingUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-600 font-bold flex items-center gap-1 hover:underline"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Join Room</span>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2 shrink-0">
                          {session.status !== 'live' ? (
                            <button
                              onClick={() => handleUpdateLiveStatus(session.id, 'live')}
                              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                            >
                              <Play className="w-3.5 h-3.5" />
                              <span>Go Live Now</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateLiveStatus(session.id, 'completed')}
                              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>End Broadcast</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteLiveSession(session.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                            title="Delete Session"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 4: QUIZZES & STUDENT SUBMISSIONS */}
        {activeTab === 'quizzes' && (
          <div className="space-y-8">
            
            {/* Top Row: Create Quiz + Published Quizzes */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Quiz Creator Form (6 cols) */}
              <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 block">
                    Curriculum Assessment
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Create AI & Technology Quiz
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Create quizzes covering AI Literacy, Prompt Engineering, Generative AI, Tools, and Responsible AI.
                  </p>
                </div>

                <form onSubmit={handleCreateQuiz} className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Quiz Title</label>
                    <input
                      type="text"
                      required
                      value={quizForm.title}
                      onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                      placeholder="e.g. Prompt Engineering & Chain-of-Thought Mastery"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="font-bold text-slate-700 block mb-1">Topic</label>
                      <select
                        value={quizForm.topic}
                        onChange={(e) => setQuizForm({ ...quizForm, topic: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
                      >
                        {AI_TOPICS.map((topic) => (
                          <option key={topic} value={topic}>{topic}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Pass %</label>
                      <input
                        type="number"
                        min={50}
                        max={100}
                        value={quizForm.passingScore}
                        onChange={(e) => setQuizForm({ ...quizForm, passingScore: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Description</label>
                    <input
                      type="text"
                      value={quizForm.description}
                      onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                      placeholder="Brief summary of skills tested in this quiz..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Dynamic Questions Builder */}
                  <div className="pt-2 border-t border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                        Questions ({quizForm.questions.length})
                      </h4>
                      <button
                        type="button"
                        onClick={handleAddQuestionToForm}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-[11px] flex items-center gap-1 hover:bg-indigo-100 transition cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Question</span>
                      </button>
                    </div>

                    <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                      {quizForm.questions.map((q, qIdx) => (
                        <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-indigo-900 text-xs">Question {qIdx + 1}</span>
                            {quizForm.questions.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveQuestionFromForm(qIdx)}
                                className="text-slate-400 hover:text-rose-600 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <input
                            type="text"
                            required
                            placeholder="Enter the question prompt..."
                            value={q.question}
                            onChange={(e) => {
                              const updated = [...quizForm.questions];
                              updated[qIdx].question = e.target.value;
                              setQuizForm({ ...quizForm, questions: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500"
                          />

                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">
                              Choices (Select the radio of the correct answer):
                            </span>
                            {q.options.map((opt, optIdx) => (
                              <div key={optIdx} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`correct-${q.id}`}
                                  checked={q.correctAnswerIndex === optIdx}
                                  onChange={() => {
                                    const updated = [...quizForm.questions];
                                    updated[qIdx].correctAnswerIndex = optIdx;
                                    setQuizForm({ ...quizForm, questions: updated });
                                  }}
                                  className="w-4 h-4 text-indigo-600 cursor-pointer"
                                />
                                <input
                                  type="text"
                                  required
                                  placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                                  value={opt}
                                  onChange={(e) => {
                                    const updated = [...quizForm.questions];
                                    updated[qIdx].options[optIdx] = e.target.value;
                                    setQuizForm({ ...quizForm, questions: updated });
                                  }}
                                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-indigo-500"
                                />
                              </div>
                            ))}
                          </div>

                          <input
                            type="text"
                            placeholder="Explanation (Why is this answer correct?)"
                            value={q.explanation}
                            onChange={(e) => {
                              const updated = [...quizForm.questions];
                              updated[qIdx].explanation = e.target.value;
                              setQuizForm({ ...quizForm, questions: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isCreatingQuiz}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isCreatingQuiz ? 'Publishing...' : 'Publish AI Quiz for Students'}</span>
                  </button>
                </form>
              </div>

              {/* Published Quizzes List (6 cols) */}
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-lg font-extrabold text-slate-900">
                  Published AI Quizzes ({quizzes.length})
                </h3>

                <div className="space-y-3 max-h-[550px] overflow-y-auto">
                  {quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {quiz.topic}
                          </span>
                          <span className="text-xs text-slate-400">• {quiz.questions.length} Questions</span>
                          <span className="text-xs text-slate-400">• Pass: {quiz.passingScore}%</span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-sm">{quiz.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2">{quiz.description}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteQuizItem(quiz.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer shrink-0"
                        title="Delete Quiz"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Section: Real-time Student Quiz Submissions Review */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Student Quiz Submissions & Score Log
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time log of student attempts, test scores, pass rates, and completion times.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                    {submissions.length} Total Submissions
                  </span>
                </div>
              </div>

              {submissions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No students have completed a quiz attempt yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-4">Quiz Title</th>
                        <th className="py-3 px-4">Score</th>
                        <th className="py-3 px-4">Percentage</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Submitted At</th>
                        <th className="py-3 px-4 text-right">Credential</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {submissions.map((sub) => {
                        const dateStr = sub.submittedAt 
                          ? new Date(sub.submittedAt).toLocaleString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'Recent';

                        return (
                          <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3 px-4">
                              <span className="font-bold text-slate-900 block">{sub.studentName}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{sub.studentEmail}</span>
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-800">
                              {sub.quizTitle}
                            </td>
                            <td className="py-3 px-4 font-mono font-bold">
                              {sub.score} / {sub.totalQuestions}
                            </td>
                            <td className="py-3 px-4 font-black">
                              {sub.percentage}%
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                sub.passed
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}>
                                {sub.passed ? 'Passed' : 'Failed'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-400 text-[11px]">
                              {dateStr}
                            </td>
                            <td className="py-3 px-4 text-right">
                              {sub.passed ? (
                                <button
                                  onClick={() => setAdminCertModalSubmission(sub)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold transition cursor-pointer"
                                  title="View and print official student certificate"
                                >
                                  <Award className="w-3 h-3 text-amber-600" />
                                  <span>Certificate</span>
                                </button>
                              ) : (
                                <span className="text-slate-300 text-[11px]">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 5: COURSE TASKS & ASSIGNMENTS */}
        {activeTab === 'tasks' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Create Task Form (5 cols) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 block">
                  Coursework Management
                </span>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Assign Course Task
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Create study milestones and coding challenges assigned to enrolled students.
                </p>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!taskForm.title.trim()) return;
                  setIsAssigningTask(true);
                  addTask(taskForm.title.trim(), taskForm.courseName.trim(), taskForm.priority, taskForm.dueDate.trim());
                  setTaskForm({
                    title: '',
                    courseName: 'AI Readiness & Literacy',
                    priority: 'medium',
                    dueDate: 'Sunday, 11:59 PM'
                  });
                  setIsAssigningTask(false);
                  setActionNotice({
                    message: 'Coursework assignment dispatched to all student task lists!',
                    type: 'success'
                  });
                  setTimeout(() => setActionNotice(null), 3000);
                }} 
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Task / Assignment Title</label>
                  <input
                    type="text"
                    required
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    placeholder="e.g. Build Few-Shot Prompt Template for Document Classifier"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Associated Course</label>
                  <input
                    type="text"
                    required
                    value={taskForm.courseName}
                    onChange={(e) => setTaskForm({ ...taskForm, courseName: e.target.value })}
                    placeholder="e.g. Prompt Engineering, AI Fundamentals, etc."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Priority</label>
                    <select
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as any })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
                    >
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Due Date</label>
                    <input
                      type="text"
                      required
                      value={taskForm.dueDate}
                      onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                      placeholder="e.g. Friday, 5:00 PM"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAssigningTask}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>Assign Task to Students</span>
                </button>
              </form>
            </div>

            {/* Existing Assigned Tasks (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900">
                Active Student Assignments ({tasks.length})
              </h3>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          task.priority === 'high'
                            ? 'bg-rose-100 text-rose-700'
                            : task.priority === 'medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-slate-400">• {task.courseName}</span>
                        <span className="text-xs text-slate-400">• Due: {task.dueDate}</span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm truncate">{task.title}</h4>
                      <p className="text-[11px] text-slate-400">
                        Status: <strong className={task.completed ? 'text-emerald-600' : 'text-amber-600'}>
                          {task.completed ? 'Completed by Student' : 'Pending Submission'}
                        </strong>
                      </p>
                    </div>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer shrink-0"
                      title="Remove Assignment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Verified Certificate Modal for Admin inspection */}
      <CertificateModal 
        submission={adminCertModalSubmission} 
        onClose={() => setAdminCertModalSubmission(null)} 
      />

    </div>
  );
};
