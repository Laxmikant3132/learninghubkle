export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  status: 'pending' | 'approved' | 'rejected';
  avatar: string;
  headline: string;
  weeklyGoalHours: number;
  completedCoursesCount: number;
  enrolledCoursesCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Course {
  id: string;
  title: string;
  category: 'UI / UX Design' | 'Front End' | 'Branding' | 'Data Science' | 'Computer Science' | 'Business';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  language: 'English' | 'Spanish' | 'French' | 'German';
  description: string;
  thumbnail: string;
  instructorName: string;
  instructorRole: string;
  instructorAvatar: string;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  totalLessons: number;
  durationMinutes: number;
  tags: string[];
  featured?: boolean;
  trending?: boolean;
  lessons: CourseLesson[];
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
  completed?: boolean;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  courseCategory: string;
  courseThumbnail: string;
  instructorName: string;
  instructorAvatar: string;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  lastWatchedLesson: string;
  updatedAt: string;
}

export interface TaskItem {
  id: string;
  userId: string;
  title: string;
  courseName: string;
  dueDate: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  category: string;
  membersCount: number;
  description: string;
  avatar: string;
  isJoined: boolean;
  meetingTime: string;
}

export interface InboxMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  senderRole: string;
  content: string;
  timestamp: string;
  unread: boolean;
  tag: string;
}

export interface MentorPeer {
  id: string;
  name: string;
  avatar: string;
  mutualCount: number;
  role: string;
  isFollowing: boolean;
}

export interface LearningProgram {
  id: string;
  title: string;
  organization: string;
  location: string;
  category: string;
  type: string;
  coverage: string;
  stipend: string;
  rating: number;
  iconBg: string;
  description: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorEmail: string;
  priority: 'urgent' | 'normal' | 'info';
  tag: string;
  createdAt: string;
}

export interface LiveSession {
  id: string;
  title: string;
  topic: string;
  description: string;
  scheduledAt: string;
  durationMinutes: number;
  hostName: string;
  status: 'scheduled' | 'live' | 'completed';
  meetingUrl?: string;
  attendeesCount: number;
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  topic: 'AI Readiness & Literacy' | 'AI Fundamentals' | 'Generative AI' | 'Prompt Engineering' | 'AI Tools & Applications' | 'AI Ethics & Responsible AI';
  description: string;
  durationMinutes: number;
  passingScore: number;
  totalQuestions: number;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizSubmission {
  id: string;
  quizId: string;
  quizTitle: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  submittedAt: string;
  selectedAnswers: number[];
}

export type PortalView = 'dashboard' | 'courses' | 'inbox' | 'quizzes' | 'live' | 'task' | 'group' | 'certificates' | 'settings';
export type AppMode = 'landing' | 'portal';

