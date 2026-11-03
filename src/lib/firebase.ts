import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  type User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
  getDocFromServer 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { 
  UserProfile, 
  Course, 
  NoticeItem, 
  LiveSession, 
  Quiz, 
  QuizSubmission 
} from '../types';

export const ADMIN_EMAIL = 'laxmikanttalli303@gmail.com';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: The app will break without specifying firestoreDatabaseId when custom databaseId is used
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or initializing.');
    }
    return false;
  }
}

/**
 * Syncs user authentication state with their Firestore /users/{uid} document.
 */
export async function syncUserProfile(firebaseUser: User, customName?: string): Promise<UserProfile> {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const userEmail = (firebaseUser.email || '').toLowerCase().trim();
  const isAdminAccount = userEmail === ADMIN_EMAIL.toLowerCase();

  try {
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data() as UserProfile;
      
      if (isAdminAccount && (data.role !== 'admin' || data.status !== 'approved')) {
        const updatedAdmin: Partial<UserProfile> = {
          role: 'admin',
          status: 'approved',
          updatedAt: new Date().toISOString()
        };
        await updateDoc(userRef, updatedAdmin);
        return { ...data, ...updatedAdmin, role: 'admin', status: 'approved' };
      }

      return data;
    } else {
      const initialProfile: UserProfile = {
        id: firebaseUser.uid,
        name: customName || firebaseUser.displayName || (isAdminAccount ? 'System Admin' : 'New Student'),
        email: userEmail,
        role: isAdminAccount ? 'admin' : 'student',
        status: isAdminAccount ? 'approved' : 'pending',
        avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        headline: isAdminAccount ? 'Platform Administrator' : 'Enrolled Student',
        weeklyGoalHours: 15,
        completedCoursesCount: 0,
        enrolledCoursesCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(userRef, initialProfile);
      return initialProfile;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
  }
}

export async function fetchUserDoc(userId: string): Promise<UserProfile | null> {
  try {
    const userSnap = await getDoc(doc(db, 'users', userId));
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${userId}`);
  }
}

export async function updateStudentApprovalStatus(studentId: string, status: 'approved' | 'rejected'): Promise<void> {
  const path = `users/${studentId}`;
  try {
    await updateDoc(doc(db, 'users', studentId), {
      status,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export function subscribeToRegisteredUsers(
  callback: (users: UserProfile[]) => void,
  onError?: (error: Error) => void
) {
  const usersCol = collection(db, 'users');
  return onSnapshot(usersCol, (snapshot) => {
    const users: UserProfile[] = [];
    snapshot.forEach((docSnap) => {
      users.push(docSnap.data() as UserProfile);
    });
    callback(users);
  }, (error) => {
    console.error('Error listening to users collection:', error);
    if (onError) onError(error);
  });
}

// ---------------- Broadcast Notices (Inbox) ----------------
export async function createBroadcastNotice(noticeData: Omit<NoticeItem, 'id' | 'createdAt'>): Promise<NoticeItem> {
  const noticeId = `notice-${Date.now()}`;
  const newNotice: NoticeItem = {
    ...noticeData,
    id: noticeId,
    createdAt: new Date().toISOString()
  };
  try {
    await setDoc(doc(db, 'notices', noticeId), newNotice);
    return newNotice;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `notices/${noticeId}`);
  }
}

export async function deleteBroadcastNotice(noticeId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'notices', noticeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `notices/${noticeId}`);
  }
}

export function subscribeToNotices(callback: (notices: NoticeItem[]) => void, onError?: (err: any) => void) {
  const noticesCol = collection(db, 'notices');
  return onSnapshot(noticesCol, (snapshot) => {
    const list: NoticeItem[] = [];
    snapshot.forEach(d => list.push(d.data() as NoticeItem));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(list);
  }, (err) => {
    console.warn('Notice snapshot warning:', err);
    if (onError) onError(err);
  });
}

// ---------------- Live Meeting Sessions ----------------
export async function createLiveSession(sessionData: Omit<LiveSession, 'id' | 'createdAt'>): Promise<LiveSession> {
  const sessionId = `live-${Date.now()}`;
  const newSession: LiveSession = {
    ...sessionData,
    id: sessionId,
    createdAt: new Date().toISOString()
  };
  try {
    await setDoc(doc(db, 'live_sessions', sessionId), newSession);
    return newSession;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `live_sessions/${sessionId}`);
  }
}

export async function updateLiveSessionStatus(sessionId: string, status: 'scheduled' | 'live' | 'completed'): Promise<void> {
  try {
    await updateDoc(doc(db, 'live_sessions', sessionId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `live_sessions/${sessionId}`);
  }
}

export async function deleteLiveSession(sessionId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'live_sessions', sessionId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `live_sessions/${sessionId}`);
  }
}

export function subscribeToLiveSessions(callback: (sessions: LiveSession[]) => void, onError?: (err: any) => void) {
  const col = collection(db, 'live_sessions');
  return onSnapshot(col, (snapshot) => {
    const list: LiveSession[] = [];
    snapshot.forEach(d => list.push(d.data() as LiveSession));
    list.sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
    callback(list);
  }, (err) => {
    console.warn('Live sessions snapshot warning:', err);
    if (onError) onError(err);
  });
}

// ---------------- Quizzes & Submissions ----------------
export async function createQuiz(quizData: Omit<Quiz, 'id' | 'createdAt'>): Promise<Quiz> {
  const quizId = `quiz-${Date.now()}`;
  const newQuiz: Quiz = {
    ...quizData,
    id: quizId,
    createdAt: new Date().toISOString()
  };
  try {
    await setDoc(doc(db, 'quizzes', quizId), newQuiz);
    return newQuiz;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `quizzes/${quizId}`);
  }
}

export async function deleteQuiz(quizId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'quizzes', quizId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `quizzes/${quizId}`);
  }
}

export function subscribeToQuizzes(callback: (quizzes: Quiz[]) => void, onError?: (err: any) => void) {
  const col = collection(db, 'quizzes');
  return onSnapshot(col, (snapshot) => {
    const list: Quiz[] = [];
    snapshot.forEach(d => list.push(d.data() as Quiz));
    callback(list);
  }, (err) => {
    console.warn('Quizzes snapshot warning:', err);
    if (onError) onError(err);
  });
}

export async function submitQuizAttempt(submissionData: Omit<QuizSubmission, 'id' | 'submittedAt'>): Promise<QuizSubmission> {
  const submissionId = `sub-${Date.now()}`;
  const submission: QuizSubmission = {
    ...submissionData,
    id: submissionId,
    submittedAt: new Date().toISOString()
  };
  try {
    await setDoc(doc(db, 'quiz_submissions', submissionId), submission);
    return submission;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `quiz_submissions/${submissionId}`);
  }
}

export function subscribeToQuizSubmissions(callback: (submissions: QuizSubmission[]) => void, onError?: (err: any) => void) {
  const col = collection(db, 'quiz_submissions');
  return onSnapshot(col, (snapshot) => {
    const list: QuizSubmission[] = [];
    snapshot.forEach(d => list.push(d.data() as QuizSubmission));
    list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    callback(list);
  }, (err) => {
    console.warn('Submissions snapshot warning:', err);
    if (onError) onError(err);
  });
}

/**
 * Seed initial comprehensive AI Literacy & Technology quizzes if the collection is empty
 */
export async function seedInitialQuizzesIfEmpty(): Promise<void> {
  try {
    const snap = await getDocs(collection(db, 'quizzes'));
    if (!snap.empty) return;

    const initialQuizzes: Omit<Quiz, 'createdAt'>[] = [
      {
        id: 'quiz-ai-readiness',
        title: 'AI Readiness & Digital Literacy Assessment',
        topic: 'AI Readiness & Literacy',
        description: 'Evaluate your foundational grasp of artificial intelligence concepts, modern data literacy, and organizational adoption readiness.',
        durationMinutes: 10,
        passingScore: 70,
        totalQuestions: 4,
        questions: [
          {
            id: 'q1',
            question: 'What is the primary distinction between Narrow AI (Weak AI) and General AI (AGI)?',
            options: [
              'Narrow AI performs specific predefined tasks, while AGI would possess human-like generalized intelligence across domains.',
              'Narrow AI runs only on smartphones, while AGI runs in the cloud.',
              'Narrow AI requires no training data, while AGI requires manual rules.',
              'Narrow AI is biological, while AGI is software-based.'
            ],
            correctAnswerIndex: 0,
            explanation: 'Narrow AI excels at targeted domains (like image recognition or chess), whereas AGI refers to autonomous systems outperforming humans at most economically valuable work.'
          },
          {
            id: 'q2',
            question: 'Which of the following is considered a core pillar of AI Literacy in a modern workforce?',
            options: [
              'Blindly accepting AI outputs as fact',
              'Understanding AI capabilities, critically evaluating outputs, and identifying ethical risks',
              'Writing assembly code for GPUs',
              'Replacing all human communication with chatbots'
            ],
            correctAnswerIndex: 1,
            explanation: 'AI literacy involves critical evaluation of machine-generated insights, identifying hallucinations, and understanding ethical context.'
          },
          {
            id: 'q3',
            question: 'What is "Data Hygiene" and why is it critical for AI model performance?',
            options: [
              'Wiping server hard drives with alcohol',
              'Cleaning, deduplicating, and formatting raw training data to prevent bias and garbage-in-garbage-out errors',
              'Purchasing expensive hard drives',
              'Encrypting files so AI cannot read them'
            ],
            correctAnswerIndex: 1,
            explanation: 'High-quality, unbiased, well-structured data is the cornerstone of reliable machine learning predictions.'
          },
          {
            id: 'q4',
            question: 'In organizational AI readiness, what does "Human-in-the-Loop" (HITL) mean?',
            options: [
              'Humans are completely eliminated from the workflow',
              'Humans actively oversee, review, and refine AI automated decisions, especially in high-stakes scenarios',
              'Humans are only called when computers break down',
              'AI monitors human employees on video cameras'
            ],
            correctAnswerIndex: 1,
            explanation: 'HITL combines algorithmic speed with human domain judgment, preventing costly automated mistakes.'
          }
        ]
      },
      {
        id: 'quiz-prompt-engineering',
        title: 'Prompt Engineering & Generative AI Mastery',
        topic: 'Prompt Engineering',
        description: 'Test your understanding of zero-shot, few-shot prompting, system roles, chain-of-thought, and temperature controls in LLMs.',
        durationMinutes: 12,
        passingScore: 75,
        totalQuestions: 4,
        questions: [
          {
            id: 'pe-1',
            question: 'What is "Few-Shot Prompting" in large language models?',
            options: [
              'Providing the model with several exemplary input-output pairs before asking it to solve the target prompt',
              'Giving the model only three chances to guess the answer',
              'Rebooting the server three times',
              'Prompting the model with minimal characters'
            ],
            correctAnswerIndex: 0,
            explanation: 'Few-shot prompting conditions the model on demonstrations, drastically improving formatting consistency and accuracy.'
          },
          {
            id: 'pe-2',
            question: 'What is the purpose of "Chain-of-Thought" (CoT) prompting?',
            options: [
              'Connecting multiple computers with network cables',
              'Encouraging the model to show step-by-step intermediate reasoning before arriving at a final answer',
              'Writing prompts in poetic rhyming chains',
              'Forcing the model to respond in JSON format only'
            ],
            correctAnswerIndex: 1,
            explanation: 'Chain-of-Thought prompting directs LLMs to unpack complex multi-step reasoning, minimizing arithmetic and logic errors.'
          },
          {
            id: 'pe-3',
            question: 'How does adjusting the "Temperature" parameter influence model generation?',
            options: [
              'Higher temperature produces more deterministic, repetitive responses',
              'Higher temperature increases randomness and creative divergence, while lower temperature yields deterministic, focused outputs',
              'Temperature cools down the GPU fans',
              'Temperature changes the font size of the response'
            ],
            correctAnswerIndex: 1,
            explanation: 'Temperature scales the logit probability distribution: 0.0 is greedy and deterministic, while 1.0+ increases variety and randomness.'
          },
          {
            id: 'pe-4',
            question: 'What is an effective defense against Prompt Injection attacks?',
            options: [
              'Using structured delimiters, strict system instructions, and input sanitization layers',
              'Writing prompts in all uppercase letters',
              'Deleting the user prompt before sending',
              'Using smaller fonts'
            ],
            correctAnswerIndex: 0,
            explanation: 'Clear delimiter boundaries (e.g. XML tags, quotes) and separate system-prompt guardrails protect models from being hijacked by malicious user inputs.'
          }
        ]
      },
      {
        id: 'quiz-ai-ethics',
        title: 'AI Ethics, Governance & Responsible AI',
        topic: 'AI Ethics & Responsible AI',
        description: 'Explore bias mitigation, algorithmic fairness, intellectual property, data privacy, and transparency principles.',
        durationMinutes: 10,
        passingScore: 70,
        totalQuestions: 3,
        questions: [
          {
            id: 'et-1',
            question: 'What causes algorithmic bias in machine learning models?',
            options: [
              'Historical biases, skewed representation, or unrepresentative sample datasets in the training corpus',
              'Computer monitors having low color accuracy',
              'Too much electricity supplied to the motherboard',
              'Using Python instead of C++'
            ],
            correctAnswerIndex: 0,
            explanation: 'Models reflect the demographic and cultural patterns present in their training data; uncorrected data leads to systematic biases.'
          },
          {
            id: 'et-2',
            question: 'What does "Explainable AI" (XAI) seek to achieve?',
            options: [
              'Creating machines that can translate languages',
              'Providing intelligible explanations of how an AI system reached its prediction or decision',
              'Teaching computers to speak audibly',
              'Publishing the source code of every operating system'
            ],
            correctAnswerIndex: 1,
            explanation: 'Explainability ensures that decisions in critical sectors (medicine, loans, justice) are auditable and understandable by humans.'
          },
          {
            id: 'et-3',
            question: 'What is a "Hallucination" in the context of Large Language Models?',
            options: [
              'When the computer screen flickers',
              'When an LLM generates factually false or invented statements with high grammatical confidence',
              'When a model runs out of RAM',
              'When the user imagines a feature that does not exist'
            ],
            correctAnswerIndex: 1,
            explanation: 'Hallucination occurs because LLMs predict probabilistic next tokens rather than querying an infallible knowledge base.'
          }
        ]
      }
    ];

    for (const quiz of initialQuizzes) {
      await setDoc(doc(db, 'quizzes', quiz.id), {
        ...quiz,
        createdAt: new Date().toISOString()
      });
    }

    // Also seed initial welcome broadcast notice
    const initialNotice: NoticeItem = {
      id: 'notice-welcome',
      title: 'Welcome to Learn Hub AI & Tech Programs',
      content: 'Welcome students! All approved learners now have access to our AI Readiness Assessments, live masterclasses, and coding workshops. Be sure to check your weekly study targets and join our scheduled live sessions.',
      authorName: 'Platform Administrator',
      authorEmail: ADMIN_EMAIL,
      priority: 'urgent',
      tag: 'Important Notice',
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'notices', initialNotice.id), initialNotice);

    // Seed initial upcoming live session
    const initialSession: LiveSession = {
      id: 'live-session-ai-masterclass',
      title: 'Live Workshop: Real-world Generative AI & Prompt Engineering',
      topic: 'Generative AI & LLM Systems',
      description: 'Hands-on interactive walkthrough building practical AI-assisted workflows with Gemini, prompt templates, and evaluation pipelines.',
      scheduledAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      durationMinutes: 60,
      hostName: 'Admin (laxmikanttalli303@gmail.com)',
      status: 'scheduled',
      meetingUrl: 'https://meet.google.com/ais-live-learnhub',
      attendeesCount: 42,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'live_sessions', initialSession.id), initialSession);

  } catch (err) {
    console.warn('Seeding initial quizzes note:', err);
  }
}

/**
 * Login with email and password
 */
export async function loginWithEmailAndPassword(email: string, pass: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
  return cred.user;
}

/**
 * Register student with email and password
 */
export async function registerWithEmailAndPassword(name: string, email: string, pass: string): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  if (name.trim()) {
    try {
      await updateProfile(cred.user, { displayName: name.trim() });
    } catch {
      // non-blocking
    }
  }
  return cred.user;
}

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogleAuth(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

/**
 * Sign out
 */
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Seed initial courses into Firestore if the collection is empty
 */
export async function seedCoursesToFirestore(initialCourses: Course[]): Promise<Course[]> {
  try {
    const coursesRef = collection(db, 'courses');
    const snap = await getDocs(coursesRef);
    if (snap.empty) {
      for (const course of initialCourses) {
        await setDoc(doc(db, 'courses', course.id), course);
      }
      return initialCourses;
    } else {
      const dbCourses: Course[] = [];
      snap.forEach(d => dbCourses.push(d.data() as Course));
      return dbCourses;
    }
  } catch (err) {
    console.warn('Courses read/seed note:', err);
    return initialCourses;
  }
}

export { onAuthStateChanged, type User };
