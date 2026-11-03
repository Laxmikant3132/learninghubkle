import { create } from 'zustand';
import { 
  AppMode, 
  Course, 
  Enrollment, 
  InboxMessage, 
  MentorPeer, 
  PortalView, 
  StudyGroup, 
  TaskItem, 
  UserProfile,
  NoticeItem,
  LiveSession,
  Quiz,
  QuizSubmission
} from '../types';
import { 
  initialEnrollments, 
  initialTasks, 
  initialUser, 
  mockCourses, 
  mockInboxMessages, 
  mockMentors, 
  mockStudyGroups 
} from '../data/mockData';
import confetti from 'canvas-confetti';

interface AppState {
  appMode: AppMode;
  portalView: PortalView;
  currentUser: UserProfile | null;
  courses: Course[];
  enrollments: Enrollment[];
  tasks: TaskItem[];
  mentors: MentorPeer[];
  studyGroups: StudyGroup[];
  inboxMessages: InboxMessage[];
  notices: NoticeItem[];
  liveSessions: LiveSession[];
  quizzes: Quiz[];
  quizSubmissions: QuizSubmission[];
  
  // UI & Modals
  selectedCourseForPlayer: Course | null;
  activeLessonId: string | null;
  selectedQuizForAttempt: Quiz | null;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  
  // Filtering & Search
  globalSearchQuery: string;
  selectedCategory: string;
  selectedSubjectFilters: string[];
  selectedLanguageFilters: string[];

  // Actions
  setAppMode: (mode: AppMode) => void;
  setPortalView: (view: PortalView) => void;
  setCurrentUser: (user: UserProfile | null) => void;
  setCourses: (courses: Course[]) => void;
  setNotices: (notices: NoticeItem[]) => void;
  setLiveSessions: (sessions: LiveSession[]) => void;
  setQuizzes: (quizzes: Quiz[]) => void;
  setQuizSubmissions: (subs: QuizSubmission[]) => void;
  setSelectedQuizForAttempt: (quiz: Quiz | null) => void;
  setGlobalSearchQuery: (q: string) => void;
  setSelectedCategory: (cat: string) => void;
  toggleSubjectFilter: (subj: string) => void;
  toggleLanguageFilter: (lang: string) => void;
  clearAllFilters: () => void;
  
  // Course & Enrollment
  openCoursePlayer: (course: Course, lessonId?: string) => void;
  closeCoursePlayer: () => void;
  completeLesson: (courseId: string, lessonId: string) => void;
  enrollInCourse: (course: Course) => void;
  
  // Tasks
  toggleTask: (taskId: string) => void;
  addTask: (title: string, courseName: string, priority?: 'high' | 'medium' | 'low', dueDate?: string) => void;
  deleteTask: (taskId: string) => void;
  
  // Community & Mentors
  toggleFollowMentor: (mentorId: string) => void;
  toggleJoinGroup: (groupId: string) => void;
  
  // Messaging
  markMessageAsRead: (messageId: string) => void;
  sendChatMessage: (content: string, tag?: string) => void;
  
  // Auth Modal
  openAuth: (mode?: 'login' | 'signup') => void;
  closeAuth: () => void;
  updateUserGoal: (hours: number) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  appMode: 'landing',
  portalView: 'dashboard',
  currentUser: null,
  courses: mockCourses,
  enrollments: initialEnrollments,
  tasks: initialTasks,
  mentors: mockMentors,
  studyGroups: mockStudyGroups,
  inboxMessages: mockInboxMessages,
  notices: [],
  liveSessions: [],
  quizzes: [],
  quizSubmissions: [],
  
  selectedCourseForPlayer: null,
  activeLessonId: null,
  selectedQuizForAttempt: null,
  isAuthModalOpen: false,
  authModalMode: 'login',
  
  globalSearchQuery: '',
  selectedCategory: 'All',
  selectedSubjectFilters: [],
  selectedLanguageFilters: [],

  setAppMode: (mode) => set({ appMode: mode }),
  
  setPortalView: (view) => set({ portalView: view, appMode: 'portal' }),
  
  setCurrentUser: (user) => set({ currentUser: user }),
  
  setCourses: (courses) => set({ courses }),
  
  setNotices: (notices) => set({ notices }),
  
  setLiveSessions: (liveSessions) => set({ liveSessions }),
  
  setQuizzes: (quizzes) => set({ quizzes }),
  
  setQuizSubmissions: (quizSubmissions) => set({ quizSubmissions }),
  
  setSelectedQuizForAttempt: (selectedQuizForAttempt) => set({ selectedQuizForAttempt }),
  
  setGlobalSearchQuery: (q) => set({ globalSearchQuery: q }),
  
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
  
  toggleSubjectFilter: (subj) => set((state) => {
    const exists = state.selectedSubjectFilters.includes(subj);
    return {
      selectedSubjectFilters: exists
        ? state.selectedSubjectFilters.filter((s) => s !== subj)
        : [...state.selectedSubjectFilters, subj]
    };
  }),

  toggleLanguageFilter: (lang) => set((state) => {
    const exists = state.selectedLanguageFilters.includes(lang);
    return {
      selectedLanguageFilters: exists
        ? state.selectedLanguageFilters.filter((l) => l !== lang)
        : [...state.selectedLanguageFilters, lang]
    };
  }),

  clearAllFilters: () => set({
    selectedCategory: 'All',
    selectedSubjectFilters: [],
    selectedLanguageFilters: [],
    globalSearchQuery: ''
  }),

  openCoursePlayer: (course, lessonId) => {
    const firstLessonId = lessonId || course.lessons[0]?.id || null;
    set({
      selectedCourseForPlayer: course,
      activeLessonId: firstLessonId
    });
  },

  closeCoursePlayer: () => set({
    selectedCourseForPlayer: null,
    activeLessonId: null
  }),

  completeLesson: (courseId, lessonId) => {
    const state = get();
    // Trigger celebratory particle animation
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // safe fallback
    }

    // Update course lesson
    const updatedCourses = state.courses.map((c) => {
      if (c.id !== courseId) return c;
      const updatedLessons = c.lessons.map((l) =>
        l.id === lessonId ? { ...l, completed: true } : l
      );
      return { ...c, lessons: updatedLessons };
    });

    // Update or add enrollment progress
    const existingEnrollment = state.enrollments.find((e) => e.courseId === courseId);
    let updatedEnrollments = [...state.enrollments];

    if (existingEnrollment) {
      const targetCourse = updatedCourses.find((c) => c.id === courseId);
      const completedCount = targetCourse?.lessons.filter((l) => l.completed).length || (existingEnrollment.completedLessons + 1);
      const totalLessons = targetCourse?.totalLessons || existingEnrollment.totalLessons;
      const progressPercent = Math.min(100, Math.round((completedCount / totalLessons) * 100));

      updatedEnrollments = state.enrollments.map((e) =>
        e.courseId === courseId
          ? {
              ...e,
              completedLessons: completedCount,
              progressPercent,
              updatedAt: 'Just now'
            }
          : e
      );
    }

    set({
      courses: updatedCourses,
      enrollments: updatedEnrollments
    });
  },

  enrollInCourse: (course) => {
    const state = get();
    const isAlreadyEnrolled = state.enrollments.some((e) => e.courseId === course.id);
    
    if (isAlreadyEnrolled) {
      set({
        portalView: 'dashboard',
        appMode: 'portal',
        selectedCourseForPlayer: course,
        activeLessonId: course.lessons[0]?.id || null
      });
      return;
    }

    if (!state.currentUser) return;

    const newEnrollment: Enrollment = {
      id: `enroll-${Date.now()}`,
      userId: state.currentUser.id,
      courseId: course.id,
      courseTitle: course.title,
      courseCategory: course.category,
      courseThumbnail: course.thumbnail,
      instructorName: course.instructorName,
      instructorAvatar: course.instructorAvatar,
      totalLessons: course.totalLessons,
      completedLessons: 1,
      progressPercent: Math.round((1 / course.totalLessons) * 100),
      lastWatchedLesson: course.lessons[0]?.title || 'Introduction',
      updatedAt: 'Just now'
    };

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    set({
      enrollments: [newEnrollment, ...state.enrollments],
      currentUser: state.currentUser ? {
        ...state.currentUser,
        enrolledCoursesCount: state.currentUser.enrolledCoursesCount + 1
      } : null,
      selectedCourseForPlayer: course,
      activeLessonId: course.lessons[0]?.id || null
    });
  },

  toggleTask: (taskId) => {
    const state = get();
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return;

    if (!task.completed) {
      try {
        confetti({
          particleCount: 45,
          spread: 50,
          origin: { y: 0.8 }
        });
      } catch {
        // safe fallback
      }
    }

    set({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    });
  },

  addTask: (title, courseName, priority = 'medium', dueDate = 'Next week') => {
    const state = get();
    const newTask: TaskItem = {
      id: `t-${Date.now()}`,
      userId: state.currentUser?.id || 'all-students',
      title,
      courseName,
      dueDate,
      completed: false,
      priority,
      createdAt: new Date().toISOString().split('T')[0]
    };
    set({ tasks: [newTask, ...state.tasks] });
  },

  deleteTask: (taskId) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== taskId)
  })),

  toggleFollowMentor: (mentorId) => set((state) => ({
    mentors: state.mentors.map((m) =>
      m.id === mentorId ? { ...m, isFollowing: !m.isFollowing } : m
    )
  })),

  toggleJoinGroup: (groupId) => set((state) => ({
    studyGroups: state.studyGroups.map((g) => {
      if (g.id !== groupId) return g;
      const isJoined = !g.isJoined;
      return {
        ...g,
        isJoined,
        membersCount: isJoined ? g.membersCount + 1 : g.membersCount - 1
      };
    })
  })),

  markMessageAsRead: (messageId) => set((state) => ({
    inboxMessages: state.inboxMessages.map((m) =>
      m.id === messageId ? { ...m, unread: false } : m
    )
  })),

  sendChatMessage: (content, tag = 'Student Question') => {
    const state = get();
    const newMsg: InboxMessage = {
      id: `msg-${Date.now()}`,
      senderName: state.currentUser?.name || 'Student',
      senderAvatar: state.currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      senderRole: 'Student',
      content,
      timestamp: 'Just now',
      unread: false,
      tag
    };
    set({ inboxMessages: [newMsg, ...state.inboxMessages] });
  },

  openAuth: (mode = 'login') => set({ isAuthModalOpen: true, authModalMode: mode }),
  
  closeAuth: () => set({ isAuthModalOpen: false }),

  updateUserGoal: (hours) => set((state) => ({
    currentUser: state.currentUser ? { ...state.currentUser, weeklyGoalHours: hours } : null
  }))
}));
