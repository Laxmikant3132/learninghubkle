import { Course, LearningProgram, MentorPeer, StudyGroup, TaskItem, UserProfile, InboxMessage } from '../types';

export const initialUser: UserProfile = {
  id: '',
  name: '',
  email: '',
  role: 'student',
  status: 'pending',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  headline: 'Enrolled Learner',
  weeklyGoalHours: 15,
  completedCoursesCount: 0,
  enrolledCoursesCount: 0,
};

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: "Beginner's Guide to Mastering UI/UX Design",
    category: 'UI / UX Design',
    level: 'Beginner',
    language: 'English',
    description: 'Learn foundational UI/UX design theories, user persona creation, user flows, and wireframing in Figma with hands-on practice.',
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=700&q=80',
    instructorName: 'Sofia Karim',
    instructorRole: 'Lead Product Designer',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    rating: 4.9,
    reviewsCount: 1420,
    studentsCount: 3844,
    totalLessons: 18,
    durationMinutes: 320,
    tags: ['Figma', 'UI/UX', 'Design Systems', 'User Research'],
    featured: true,
    trending: true,
    lessons: [
      { id: 'l1', title: 'Introduction to Modern Product Design', duration: '12:30', completed: true },
      { id: 'l2', title: 'Understanding User Psychology & Personas', duration: '18:45', completed: true },
      { id: 'l3', title: 'Color Theory & Accessible Typography', duration: '22:10', completed: true },
      { id: 'l4', title: 'Creating Wireframes in Figma', duration: '28:00', completed: false },
      { id: 'l5', title: 'Building Interactive Prototypes', duration: '35:20', completed: false },
      { id: 'l6', title: 'Usability Testing & Design Handoff', duration: '19:40', completed: false }
    ]
  },
  {
    id: 'course-2',
    title: 'A Comprehensive Beginner’s Guide to UI/UX Design',
    category: 'UI / UX Design',
    level: 'Beginner',
    language: 'English',
    description: 'Step into UX research, information architecture, prototyping, and test scenarios for real client digital products.',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=700&q=80',
    instructorName: 'Sofia Karim',
    instructorRole: 'Design Instructor',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    rating: 4.8,
    reviewsCount: 980,
    studentsCount: 2910,
    totalLessons: 14,
    durationMinutes: 260,
    tags: ['Design', 'Prototypes', 'Figma', 'Case Studies'],
    featured: false,
    trending: true,
    lessons: [
      { id: 'l2-1', title: 'The UX Discovery Process', duration: '15:00', completed: true },
      { id: 'l2-2', title: 'Competitive Benchmarking & Audits', duration: '20:30', completed: false },
      { id: 'l2-3', title: 'High-Fidelity Interface Patterns', duration: '32:15', completed: false }
    ]
  },
  {
    id: 'course-3',
    title: 'Build Consistent & Scalable Interfaces',
    category: 'UI / UX Design',
    level: 'Intermediate',
    language: 'English',
    description: 'Architect professional design systems with auto-layout, design tokens, responsive components, and variant properties.',
    thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=700&q=80',
    instructorName: 'Sofia Karim',
    instructorRole: 'Design System Architect',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    rating: 4.95,
    reviewsCount: 2150,
    studentsCount: 4200,
    totalLessons: 20,
    durationMinutes: 410,
    tags: ['Scalability', 'Tokens', 'UI/UX', 'Component Library'],
    featured: true,
    trending: false,
    lessons: [
      { id: 'l3-1', title: 'Principles of Atomic Design', duration: '14:20', completed: true },
      { id: 'l3-2', title: 'Design Tokens Architecture', duration: '25:00', completed: true },
      { id: 'l3-3', title: 'Variants & Component Properties', duration: '30:40', completed: false }
    ]
  },
  {
    id: 'course-4',
    title: "Beginner's guide to become a Professional Front-end developer",
    category: 'Front End',
    level: 'Beginner',
    language: 'English',
    description: 'Master HTML5, modern semantic styling, responsive viewport layouts, Git workflows, and front-end best practices.',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=700&q=80',
    instructorName: 'Ava Chen',
    instructorRole: 'Staff Frontend Engineer',
    instructorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    rating: 4.9,
    reviewsCount: 3120,
    studentsCount: 5600,
    totalLessons: 24,
    durationMinutes: 480,
    tags: ['HTML', 'CSS', 'Tailwind', 'JavaScript'],
    featured: true,
    trending: true,
    lessons: [
      { id: 'l4-1', title: 'Web Anatomy & The Modern Browser', duration: '16:00', completed: true },
      { id: 'l4-2', title: 'Semantic HTML & Accessible Landmarks', duration: '21:15', completed: true },
      { id: 'l4-3', title: 'CSS Grid & Flexbox Mastery', duration: '34:20', completed: true },
      { id: 'l4-4', title: 'Responsive Breakpoints & Media Queries', duration: '27:10', completed: true },
      { id: 'l4-5', title: 'Interactive DOM Manipulation', duration: '39:50', completed: true },
      { id: 'l4-6', title: 'Deploying Modern Static Sites', duration: '18:30', completed: false }
    ]
  },
  {
    id: 'course-5',
    title: 'JavaScript Essentials for Aspiring Front-End Developers',
    category: 'Front End',
    level: 'Beginner',
    language: 'English',
    description: 'Deep dive into JavaScript ES6+, promises, async/await, closures, prototypes, event delegation, and browser APIs.',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=700&q=80',
    instructorName: 'Ava Chen',
    instructorRole: 'Senior Web Architect',
    instructorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    rating: 4.85,
    reviewsCount: 2890,
    studentsCount: 4900,
    totalLessons: 22,
    durationMinutes: 430,
    tags: ['JavaScript', 'ES6', 'Algorithms', 'Async'],
    featured: false,
    trending: true,
    lessons: [
      { id: 'l5-1', title: 'Variables, Scope & Execution Context', duration: '19:40', completed: true },
      { id: 'l5-2', title: 'Array Methods: Map, Filter, Reduce', duration: '26:10', completed: true },
      { id: 'l5-3', title: 'Async JS, Promises & Fetch API', duration: '35:00', completed: false },
      { id: 'l5-4', title: 'Event Loop & Microtasks Explained', duration: '22:15', completed: false }
    ]
  },
  {
    id: 'course-6',
    title: 'Responsive Web Design: From Basics to Best Practices',
    category: 'Front End',
    level: 'Intermediate',
    language: 'English',
    description: 'Craft fluid, accessible, and high-performance layouts that adapt flawlessly to mobile, tablet, and desktop screens.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=700&q=80',
    instructorName: 'Isla Takeda',
    instructorRole: 'Creative Developer & UI Engineer',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rating: 4.92,
    reviewsCount: 1670,
    studentsCount: 3410,
    totalLessons: 16,
    durationMinutes: 350,
    tags: ['Responsive', 'Tailwind CSS', 'Mobile First', 'UX'],
    featured: true,
    trending: true,
    lessons: [
      { id: 'l6-1', title: 'Mobile-First Layout Philosophy', duration: '14:50', completed: true },
      { id: 'l6-2', title: 'Fluid Typography & Modern CSS Units (clamp, rem)', duration: '21:30', completed: true },
      { id: 'l6-3', title: 'Container Queries & Component Responsiveness', duration: '29:40', completed: true }
    ]
  },
  {
    id: 'course-7',
    title: 'Brand Identity Design & Visual Strategy',
    category: 'Branding',
    level: 'Beginner',
    language: 'English',
    description: 'Create memorable logos, brand style guidelines, brand narratives, and visual collateral for modern tech products.',
    thumbnail: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=700&q=80',
    instructorName: 'Christine Robles',
    instructorRole: 'Creative Director',
    instructorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    rating: 4.88,
    reviewsCount: 1120,
    studentsCount: 2400,
    totalLessons: 15,
    durationMinutes: 290,
    tags: ['Branding', 'Typography', 'Logo Design', 'Identity'],
    featured: false,
    trending: false,
    lessons: [
      { id: 'l7-1', title: 'Foundations of Brand Strategy', duration: '18:20', completed: true },
      { id: 'l7-2', title: 'Logo Conception & Grid Systems', duration: '31:10', completed: true },
      { id: 'l7-3', title: 'Assembling Brand Guidelines', duration: '24:00', completed: false }
    ]
  },
  {
    id: 'course-8',
    title: 'Data Science & Machine Learning with Python',
    category: 'Data Science',
    level: 'Intermediate',
    language: 'English',
    description: 'Practical data analysis, Pandas, NumPy, Scikit-learn, exploratory data visualization, and predictive modeling.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=700&q=80',
    instructorName: 'Dr. Marcus Vance',
    instructorRole: 'Principal Data Scientist',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    rating: 4.96,
    reviewsCount: 3890,
    studentsCount: 6700,
    totalLessons: 28,
    durationMinutes: 560,
    tags: ['Python', 'Pandas', 'Machine Learning', 'Data Analysis'],
    featured: true,
    trending: true,
    lessons: [
      { id: 'l8-1', title: 'Python for Data Analysis Kickstart', duration: '22:00', completed: true },
      { id: 'l8-2', title: 'Data Cleaning & Wrangling with Pandas', duration: '34:40', completed: false },
      { id: 'l8-3', title: 'Statistical Modeling & Hypothesis Testing', duration: '40:15', completed: false }
    ]
  },
  {
    id: 'course-9',
    title: 'Computer Science: Algorithms & Data Structures',
    category: 'Computer Science',
    level: 'Advanced',
    language: 'English',
    description: 'Master binary trees, graphs, dynamic programming, sorting algorithms, and Big-O computational complexity.',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=700&q=80',
    instructorName: 'Alex Thorne',
    instructorRole: 'Ex-Google Systems Engineer',
    instructorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    rating: 4.98,
    reviewsCount: 4500,
    studentsCount: 7800,
    totalLessons: 30,
    durationMinutes: 620,
    tags: ['Algorithms', 'Data Structures', 'C++', 'Python'],
    featured: true,
    trending: true,
    lessons: [
      { id: 'l9-1', title: 'Asymptotic Analysis & Big O', duration: '18:50', completed: false },
      { id: 'l9-2', title: 'Linked Lists & Hash Maps in Practice', duration: '28:10', completed: false },
      { id: 'l9-3', title: 'Graph Traversals: BFS & DFS', duration: '38:00', completed: false }
    ]
  }
];

export const initialEnrollments = [
  {
    id: 'enroll-1',
    userId: 'jason_duello',
    courseId: 'course-4',
    courseTitle: "Beginner's guide to become a Professional Front-end developer",
    courseCategory: 'Front End',
    courseThumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=700&q=80',
    instructorName: 'Ava Chen',
    instructorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    totalLessons: 8,
    completedLessons: 5,
    progressPercent: 62,
    lastWatchedLesson: 'Interactive DOM Manipulation',
    updatedAt: '2 hours ago'
  },
  {
    id: 'enroll-2',
    userId: 'jason_duello',
    courseId: 'course-1',
    courseTitle: "Beginner's Guide to Mastering UI/UX Design",
    courseCategory: 'UI / UX Design',
    courseThumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=700&q=80',
    instructorName: 'Sofia Karim',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    totalLessons: 8,
    completedLessons: 3,
    progressPercent: 37,
    lastWatchedLesson: 'Color Theory & Accessible Typography',
    updatedAt: 'Yesterday'
  },
  {
    id: 'enroll-3',
    userId: 'jason_duello',
    courseId: 'course-7',
    courseTitle: 'Brand Identity Design & Visual Strategy',
    courseCategory: 'Branding',
    courseThumbnail: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=700&q=80',
    instructorName: 'Christine Robles',
    instructorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    totalLessons: 6,
    completedLessons: 2,
    progressPercent: 33,
    lastWatchedLesson: 'Logo Conception & Grid Systems',
    updatedAt: '3 days ago'
  }
];

export const initialTasks: TaskItem[] = [
  {
    id: 't-1',
    userId: 'jason_duello',
    title: 'Design high-fidelity mobile prototype in Figma',
    courseName: "Beginner's Guide to Mastering UI/UX Design",
    dueDate: 'Tomorrow, 5:00 PM',
    completed: false,
    priority: 'high',
    createdAt: '2026-11-01'
  },
  {
    id: 't-2',
    userId: 'jason_duello',
    title: 'Complete JavaScript Async & Promise chaining quiz',
    courseName: 'JavaScript Essentials for Aspiring Front-End',
    dueDate: 'Nov 6, 11:59 PM',
    completed: false,
    priority: 'medium',
    createdAt: '2026-11-02'
  },
  {
    id: 't-3',
    userId: 'jason_duello',
    title: 'Submit CSS Container Queries code sandbox',
    courseName: 'Responsive Web Design: Basics to Best Practices',
    dueDate: 'Nov 8, 3:00 PM',
    completed: true,
    priority: 'low',
    createdAt: '2026-10-30'
  },
  {
    id: 't-4',
    userId: 'jason_duello',
    title: 'Review brand color contrast ratios for accessibility',
    courseName: 'Brand Identity Design & Visual Strategy',
    dueDate: 'Nov 10, 6:00 PM',
    completed: false,
    priority: 'medium',
    createdAt: '2026-11-03'
  }
];

export const mockMentors: MentorPeer[] = [
  {
    id: 'm-1',
    name: 'Ava Chen',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    mutualCount: 20,
    role: 'Frontend Instructor',
    isFollowing: false
  },
  {
    id: 'm-2',
    name: 'Sofia Karim',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    mutualCount: 15,
    role: 'UI/UX Mentor',
    isFollowing: true
  },
  {
    id: 'm-3',
    name: 'Isla Takeda',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    mutualCount: 18,
    role: 'Creative UI Dev',
    isFollowing: false
  },
  {
    id: 'm-4',
    name: 'Christine Robles',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    mutualCount: 8,
    role: 'Branding Strategist',
    isFollowing: false
  }
];

export const mockStudyGroups: StudyGroup[] = [
  {
    id: 'g-1',
    name: 'Front-End Masters Circle',
    category: 'Web Development',
    membersCount: 428,
    description: 'Weekly React, TypeScript, and CSS architecture coding reviews and portfolio feedback.',
    avatar: '💻',
    isJoined: true,
    meetingTime: 'Every Thursday, 6:00 PM'
  },
  {
    id: 'g-2',
    name: 'Figma UI/UX Guild',
    category: 'Design',
    membersCount: 612,
    description: 'Share design system components, critique user journeys, and practice design sprints.',
    avatar: '🎨',
    isJoined: true,
    meetingTime: 'Tuesdays & Saturdays, 4:00 PM'
  },
  {
    id: 'g-3',
    name: 'Data Science & AI Explorers',
    category: 'Data Science',
    membersCount: 350,
    description: 'Python notebook deep-dives, Kaggle competitions, and machine learning study sessions.',
    avatar: '📊',
    isJoined: false,
    meetingTime: 'Every Monday, 7:00 PM'
  },
  {
    id: 'g-4',
    name: 'Algorithm Sprint Group',
    category: 'Computer Science',
    membersCount: 295,
    description: 'LeetCode problem of the day, Big-O whiteboard sessions, and tech interview prep.',
    avatar: '⚡',
    isJoined: false,
    meetingTime: 'Daily at 9:00 AM'
  }
];

export const mockInboxMessages: InboxMessage[] = [
  {
    id: 'msg-1',
    senderName: 'Sofia Karim',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    senderRole: 'UI/UX Mentor',
    content: 'Great job on your wireframe submission! I left 3 constructive notes on your typography scales in the Figma board.',
    timestamp: '10:45 AM',
    unread: true,
    tag: 'Course Feedback'
  },
  {
    id: 'msg-2',
    senderName: 'Ava Chen',
    senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    senderRole: 'Frontend Instructor',
    content: 'Join our live office hours tomorrow at 3 PM EST. We will review tricky async/await promise patterns in React.',
    timestamp: 'Yesterday',
    unread: true,
    tag: 'Office Hours'
  },
  {
    id: 'msg-3',
    senderName: 'Front-End Masters Circle',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    senderRole: 'Study Group',
    content: 'Alex posted a new challenge: Build an accessible accordion using pure Tailwind and Framer Motion!',
    timestamp: '2 days ago',
    unread: false,
    tag: 'Study Group'
  }
];

export const mockPrograms: LearningProgram[] = [
  {
    id: 'prog-1',
    title: 'Full-Stack Web Innovation Track',
    organization: 'Global Tech Academy',
    location: 'Online • Global',
    category: 'Development',
    type: 'Full Program',
    coverage: '100% Verified Track',
    stipend: 'Certificate Included',
    rating: 4.9,
    iconBg: 'bg-rose-100 text-rose-600',
    description: 'Master full-stack JavaScript, React, Node.js, and cloud deployments with 1-on-1 industry mentorship.'
  },
  {
    id: 'prog-2',
    title: 'UI/UX Product Design Specialization',
    organization: 'Design Institute',
    location: 'Interactive Cohort',
    category: 'Design',
    type: 'Specialization',
    coverage: 'Mentorship Backed',
    stipend: 'Portfolio Ready',
    rating: 4.95,
    iconBg: 'bg-indigo-100 text-indigo-600',
    description: 'End-to-end UX research, system design, Figma mastery, and real enterprise case studies.'
  },
  {
    id: 'prog-3',
    title: 'Cloud & DevOps Engineering Fellowship',
    organization: 'Open Cloud Initiative',
    location: 'Remote Hands-on',
    category: 'Development',
    type: 'Fellowship',
    coverage: 'Lab Access',
    stipend: 'Cloud Credits',
    rating: 4.88,
    iconBg: 'bg-pink-100 text-pink-600',
    description: 'Learn Docker, Kubernetes, CI/CD pipelines, and cloud native architecture on real infra.'
  },
  {
    id: 'prog-4',
    title: 'Applied AI & Machine Learning Fellow',
    organization: 'Data Foundation',
    location: 'Global Virtual',
    category: 'Data Science',
    type: 'Advanced Fellow',
    coverage: 'GPU Compute Included',
    stipend: 'Research Grant',
    rating: 4.92,
    iconBg: 'bg-cyan-100 text-cyan-600',
    description: 'Deep dive into LLMs, neural networks, PyTorch, and deploying machine learning models into production.'
  },
  {
    id: 'prog-5',
    title: 'Product Management & Growth Track',
    organization: 'Venture School',
    location: 'Live Case Studies',
    category: 'Project Manage',
    type: 'Executive Track',
    coverage: 'Industry Case Studies',
    stipend: 'Alumni Network',
    rating: 4.85,
    iconBg: 'bg-amber-100 text-amber-700',
    description: 'Formulate product strategy, run A/B growth experiments, and lead cross-functional engineering teams.'
  },
  {
    id: 'prog-6',
    title: 'Financial Analysis & Business Modeling',
    organization: 'Finance Academy',
    location: 'Self-Paced + Live',
    category: 'Accountancy',
    type: 'Professional Cert',
    coverage: 'Accredited',
    stipend: 'Tools License',
    rating: 4.79,
    iconBg: 'bg-emerald-100 text-emerald-600',
    description: 'Corporate financial modeling, DCF valuation, balance sheet forecasting, and portfolio management.'
  },
  {
    id: 'prog-7',
    title: 'People Operations & HR Leadership',
    organization: 'HR Excellence Global',
    location: 'Hybrid Cohort',
    category: 'Human Resource',
    type: 'Leadership Track',
    coverage: 'Certification',
    stipend: 'Community Pass',
    rating: 4.82,
    iconBg: 'bg-purple-100 text-purple-600',
    description: 'Modern talent acquisition, remote culture building, employee retention metrics, and organizational scaling.'
  },
  {
    id: 'prog-8',
    title: 'Growth Marketing & Brand Storytelling',
    organization: 'Digital Marketing Council',
    location: 'Interactive Workshop',
    category: 'Marketing',
    type: 'Intensive Track',
    coverage: 'Ad Budget Sandbox',
    stipend: 'Analytics Toolkit',
    rating: 4.91,
    iconBg: 'bg-yellow-100 text-yellow-700',
    description: 'SEO strategy, viral content loops, paid acquisition funnels, and brand positioning in crowded markets.'
  }
];

export const mockFAQs = [
  {
    id: 'faq-1',
    question: 'How do I create an account and get started on Learn Hub?',
    answer: 'Signing up takes under 30 seconds! You can sign in directly with your Google account via Firebase or create a student profile. Once logged in, you immediately get personalized course recommendations, a dedicated dashboard to track your weekly learning targets, and access to peer study groups.'
  },
  {
    id: 'faq-2',
    question: 'How do courses work and do I receive verified certificates?',
    answer: 'Every course on Learn Hub is designed in bite-sized interactive lessons with video walkthroughs, downloadable notes, code sandboxes, and milestone quizzes. As soon as you complete 100% of a course, a verifiable digital certificate is generated for your resume and LinkedIn.'
  },
  {
    id: 'faq-3',
    question: 'Is there a cost to use Learn Hub, and what features are completely free?',
    answer: 'Learn Hub offers extensive free tier access including foundational courses, community study groups, assignment checklists, and learning roadmaps. Advanced specialized master tracks and 1-on-1 mentor reviews are available via premium fellowships and scholarships.'
  },
  {
    id: 'faq-4',
    question: 'Can I switch between the public programs landing page and my student dashboard?',
    answer: 'Yes! Use the navigation bar or top portal button at any time to seamlessly toggle between the Learn Hub landing showcase and your private student portal.'
  }
];
