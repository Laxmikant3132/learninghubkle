import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  subscribeToQuizzes, 
  subscribeToQuizSubmissions, 
  submitQuizAttempt, 
  seedInitialQuizzesIfEmpty 
} from '../../lib/firebase';
import { Quiz, QuizSubmission } from '../../types';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  Brain, 
  ArrowRight, 
  RotateCcw, 
  ChevronRight, 
  Check, 
  X, 
  Search,
  BookOpen,
  HelpCircle,
  BarChart3
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CertificateModal } from './CertificateModal';

const AI_TOPICS = [
  'All',
  'AI Readiness & Literacy',
  'AI Fundamentals',
  'Generative AI',
  'Prompt Engineering',
  'AI Tools & Applications',
  'AI Ethics & Responsible AI'
] as const;

export const QuizzesView: React.FC = () => {
  const { currentUser, quizzes, setQuizzes, quizSubmissions, setQuizSubmissions } = useAppStore();
  
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active Quiz State for Student Taking it
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmissionResult, setLastSubmissionResult] = useState<QuizSubmission | null>(null);
  const [certModalSubmission, setCertModalSubmission] = useState<QuizSubmission | null>(null);

  // Subscribe to real-time quizzes & seed if empty
  useEffect(() => {
    seedInitialQuizzesIfEmpty().catch(console.error);

    const unsubQuizzes = subscribeToQuizzes(
      (items) => setQuizzes(items),
      (err) => console.error('Quizzes sub error:', err)
    );

    let unsubSubs = () => {};
    if (currentUser?.id) {
      unsubSubs = subscribeToQuizSubmissions(
        (subs) => setQuizSubmissions(subs.filter((s) => s.userId === currentUser.id)),
        (err) => console.error('Submissions sub error:', err)
      );
    }

    return () => {
      unsubQuizzes();
      unsubSubs();
    };
  }, [currentUser?.id, setQuizzes, setQuizSubmissions]);

  // Timer countdown while taking quiz
  useEffect(() => {
    if (!activeQuiz || lastSubmissionResult) return;
    if (timeRemainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeQuiz, lastSubmissionResult, timeRemainingSeconds]);

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(quiz.questions.length).fill(-1));
    setTimeRemainingSeconds(quiz.durationMinutes * 60);
    setLastSubmissionResult(null);
  };

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    const updated = [...selectedAnswers];
    updated[questionIdx] = optionIdx;
    setSelectedAnswers(updated);
  };

  const handleAutoSubmit = async () => {
    await handleSubmitQuiz();
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz || !currentUser) return;
    setIsSubmitting(true);

    // Calculate score
    let correctCount = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        correctCount += 1;
      }
    });

    const percentage = Math.round((correctCount / activeQuiz.questions.length) * 100);
    const passed = percentage >= activeQuiz.passingScore;

    try {
      const submission = await submitQuizAttempt({
        quizId: activeQuiz.id,
        quizTitle: activeQuiz.title,
        userId: currentUser.id,
        studentName: currentUser.name || 'Student',
        studentEmail: currentUser.email || '',
        score: correctCount,
        totalQuestions: activeQuiz.questions.length,
        percentage,
        passed,
        selectedAnswers
      });

      setLastSubmissionResult(submission);

      if (passed) {
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error('Failed to submit quiz attempt:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter quizzes
  const filteredQuizzes = quizzes.filter((q) => {
    if (selectedTopic !== 'All' && q.topic !== selectedTopic) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        q.title.toLowerCase().includes(query) ||
        q.description.toLowerCase().includes(query) ||
        q.topic.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Brain className="w-4 h-4" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              AI Literacy & Readiness Quizzes
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Evaluate your knowledge in Generative AI, Prompt Engineering, AI Fundamentals, Tools, and Responsible AI.
          </p>
        </div>

        {/* Quick Student Stats */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Quizzes Passed
              </span>
              <span className="text-sm font-extrabold text-slate-900">
                {quizSubmissions.filter((s) => s.passed).length} / {quizzes.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Topics Filter & Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Topic Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {AI_TOPICS.map((topic) => {
            const isSelected = selectedTopic === topic;
            return (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AI quizzes..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
          />
        </div>
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 text-xs bg-white rounded-3xl border border-slate-200">
            <HelpCircle className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-slate-700">No quizzes available for this category</p>
            <p className="mt-1">The administrator hasn't added any quizzes under this topic yet.</p>
          </div>
        ) : (
          filteredQuizzes.map((quiz) => {
            // Find existing submission for current student
            const bestSubmission = quizSubmissions
              .filter((s) => s.quizId === quiz.id)
              .sort((a, b) => b.percentage - a.percentage)[0];

            const topicColors: Record<string, string> = {
              'AI Readiness & Literacy': 'bg-purple-50 text-purple-700 border-purple-200',
              'AI Fundamentals': 'bg-blue-50 text-blue-700 border-blue-200',
              'Generative AI': 'bg-pink-50 text-pink-700 border-pink-200',
              'Prompt Engineering': 'bg-amber-50 text-amber-700 border-amber-200',
              'AI Tools & Applications': 'bg-emerald-50 text-emerald-700 border-emerald-200',
              'AI Ethics & Responsible AI': 'bg-rose-50 text-rose-700 border-rose-200',
            };

            return (
              <div
                key={quiz.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group p-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border uppercase tracking-wider ${
                      topicColors[quiz.topic] || 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {quiz.topic}
                    </span>

                    {bestSubmission && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                        bestSubmission.passed
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {bestSubmission.passed ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Passed ({bestSubmission.percentage}%)</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Try Again ({bestSubmission.percentage}%)</span>
                          </>
                        )}
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                    {quiz.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {quiz.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-slate-600 text-xs">
                    <div className="flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                      <span>{quiz.questions.length} Qs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{quiz.durationMinutes}m</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      <span>Pass: {quiz.passingScore}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => handleStartQuiz(quiz)}
                    className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs ${
                      bestSubmission?.passed 
                        ? 'flex-1 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700' 
                        : 'w-full bg-slate-900 hover:bg-indigo-600 text-white'
                    }`}
                  >
                    <span>{bestSubmission ? 'Retake Quiz' : 'Start Assessment'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {bestSubmission?.passed && (
                    <button
                      onClick={() => setCertModalSubmission(bestSubmission)}
                      className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs shrink-0"
                      title="View Official Certificate"
                    >
                      <Award className="w-4 h-4" />
                      <span>Certificate</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Interactive Quiz Assessment Modal */}
      {activeQuiz && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                  {activeQuiz.topic}
                </span>
                <h2 className="text-lg font-extrabold">{activeQuiz.title}</h2>
              </div>

              {!lastSubmissionResult && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 text-amber-400 font-mono text-xs font-bold border border-slate-700">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTimer(timeRemainingSeconds)}</span>
                </div>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-6 flex-1 overflow-y-auto">
              {!lastSubmissionResult ? (
                // In-Progress Quiz Question
                <div className="space-y-6">
                  {/* Progress Indicator */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                      <span>Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}</span>
                      <span>{Math.round(((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100)}% Completed</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Question Prompt */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                      {activeQuiz.questions[currentQuestionIndex].question}
                    </h3>
                  </div>

                  {/* Options List */}
                  <div className="space-y-2.5">
                    {activeQuiz.questions[currentQuestionIndex].options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                          className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-500'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>

                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-slate-300'
                          }`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                // Results Screen
                <div className="py-6 space-y-6 text-center">
                  <div className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center shadow-lg text-white ${
                    lastSubmissionResult.passed ? 'bg-emerald-600' : 'bg-rose-600'
                  }">
                    {lastSubmissionResult.passed ? (
                      <CheckCircle2 className="w-8 h-8" />
                    ) : (
                      <XCircle className="w-8 h-8" />
                    )}
                  </div>

                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                      lastSubmissionResult.passed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {lastSubmissionResult.passed ? 'Assessment Passed! 🎉' : 'Assessment Needs Work'}
                    </span>

                    <h3 className="text-3xl font-black text-slate-900 mt-2">
                      {lastSubmissionResult.percentage}% Score
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      You answered {lastSubmissionResult.score} of {lastSubmissionResult.totalQuestions} questions correctly. 
                      Passing benchmark is {activeQuiz.passingScore}%.
                    </p>

                    {lastSubmissionResult.passed && (
                      <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                            <Award className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-amber-950">Accredited Certificate Unlocked!</h4>
                            <p className="text-[11px] text-amber-800">Your official completion credential has been digitally verified.</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setCertModalSubmission(lastSubmissionResult)}
                          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs shrink-0"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>View Certificate</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Answers Explanation Review */}
                  <div className="text-left mt-6 space-y-4 max-h-72 overflow-y-auto p-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Question Explanations & Solutions
                    </h4>
                    {activeQuiz.questions.map((q, idx) => {
                      const studentPick = lastSubmissionResult.selectedAnswers[idx];
                      const isCorrect = studentPick === q.correctAnswerIndex;

                      return (
                        <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-slate-900">
                              Q{idx + 1}: {q.question}
                            </span>
                            {isCorrect ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold shrink-0">
                                Correct
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold shrink-0">
                                Incorrect
                              </span>
                            )}
                          </div>

                          <div className="text-slate-600">
                            <div>Your choice: <span className="font-bold">{q.options[studentPick] || 'None'}</span></div>
                            <div className="text-emerald-700 font-bold">Correct answer: {q.options[q.correctAnswerIndex]}</div>
                          </div>

                          <p className="text-[11px] text-slate-500 italic bg-white p-2.5 rounded-xl border border-slate-100">
                            💡 {q.explanation}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              {!lastSubmissionResult ? (
                <>
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white font-bold text-xs text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveQuiz(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-200 transition cursor-pointer"
                    >
                      Exit
                    </button>

                    {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                        className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={isSubmitting}
                        className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        {isSubmitting ? 'Evaluating...' : 'Submit Assessment'}
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="w-full flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleStartQuiz(activeQuiz)}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white font-bold text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Quiz</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {lastSubmissionResult.passed && (
                      <button
                        onClick={() => setCertModalSubmission(lastSubmissionResult)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>View Certificate</span>
                      </button>
                    )}

                    <button
                      onClick={() => setActiveQuiz(null)}
                      className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-xs"
                    >
                      Done & Close
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Verified Certificate Modal */}
      <CertificateModal 
        submission={certModalSubmission} 
        onClose={() => setCertModalSubmission(null)} 
      />

    </div>
  );
};
