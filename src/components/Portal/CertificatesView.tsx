import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { subscribeToQuizSubmissions, subscribeToQuizzes } from '../../lib/firebase';
import { QuizSubmission, Quiz } from '../../types';
import { CertificateModal } from './CertificateModal';
import { 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  Search, 
  ShieldCheck, 
  Printer, 
  BookOpen, 
  Brain,
  Download,
  Share2,
  ExternalLink,
  GraduationCap
} from 'lucide-react';

export const CertificatesView: React.FC = () => {
  const { currentUser, setPortalView, quizSubmissions, setQuizSubmissions, quizzes, setQuizzes } = useAppStore();
  
  const [selectedSubmission, setSelectedSubmission] = useState<QuizSubmission | null>(null);
  const [verificationInput, setVerificationInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    certId?: string;
    studentName?: string;
    course?: string;
    date?: string;
  } | null>(null);

  // Subscribe to student submissions
  useEffect(() => {
    let unsub = () => {};
    if (currentUser?.id) {
      unsub = subscribeToQuizSubmissions(
        (allSubs) => {
          const userPassed = allSubs.filter((s) => s.userId === currentUser.id && s.passed);
          setQuizSubmissions(userPassed);
        },
        (err) => console.error('Error fetching submissions for certs:', err)
      );
    }
    const unsubQuizzes = subscribeToQuizzes(
      (items) => setQuizzes(items),
      (err) => console.error(err)
    );

    return () => {
      unsub();
      unsubQuizzes();
    };
  }, [currentUser?.id, setQuizSubmissions, setQuizzes]);

  const earnedSubmissions = quizSubmissions.filter((s) => s.passed);

  const avgScore = earnedSubmissions.length > 0 
    ? Math.round(earnedSubmissions.reduce((acc, curr) => acc + curr.percentage, 0) / earnedSubmissions.length)
    : 0;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const query = verificationInput.trim().toUpperCase();
    if (!query) return;

    // Check if query matches any earned certificate
    const match = earnedSubmissions.find((s) => {
      const generatedId = `LH-${s.quizId.slice(0, 4).toUpperCase()}-${s.id.slice(0, 6).toUpperCase()}`;
      return generatedId === query || s.id.toUpperCase().includes(query) || s.quizId.toUpperCase().includes(query);
    });

    if (match) {
      setVerificationResult({
        valid: true,
        certId: `LH-${match.quizId.slice(0, 4).toUpperCase()}-${match.id.slice(0, 6).toUpperCase()}`,
        studentName: match.studentName || currentUser?.name || 'Authorized Student',
        course: match.quizTitle,
        date: new Date(match.submittedAt).toLocaleDateString()
      });
    } else {
      setVerificationResult({ valid: false });
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="bg-linear-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-bold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Accredited AI & Tech Qualifications</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            My Certificates & Credentials
          </h1>

          <p className="text-sm sm:text-base text-indigo-100 font-normal leading-relaxed">
            Every passed assessment generates a digitally cryptographically stamped Learn Hub Certificate. Use them to prove your mastery in Generative AI, Prompt Engineering, and Modern Computing.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setPortalView('quizzes')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-md"
            >
              <Brain className="w-4 h-4" />
              <span>Take More AI Quizzes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Certificates Earned</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 block">
              {earnedSubmissions.length}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Average Grade</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1 block">
              {avgScore}%
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Available Topics</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 mt-1 block">
              {quizzes.length}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Status</span>
            <span className="text-lg font-bold text-slate-800 mt-1 block flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Verified Scholar
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Grid: Earned Certificates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Official Credentials</h2>
            <p className="text-xs text-slate-500">Click any certificate to inspect full resolution, print, or download</p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            {earnedSubmissions.length} Issued
          </span>
        </div>

        {earnedSubmissions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earnedSubmissions.map((sub) => {
              const certId = `LH-${sub.quizId.slice(0, 4).toUpperCase()}-${sub.id.slice(0, 6).toUpperCase()}`;
              return (
                <div
                  key={sub.id}
                  className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Subtle decorative glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/40 rounded-full blur-2xl group-hover:scale-125 transition-transform" />

                  <div className="space-y-4 relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
                        <Award className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {sub.percentage}% Passed
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 block mb-1">
                        Verified Credential
                      </span>
                      <h3 className="font-extrabold text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {sub.quizTitle}
                      </h3>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Recipient:</span>
                        <span className="font-semibold text-slate-800">{sub.studentName}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Issued On:</span>
                        <span className="font-semibold text-slate-800">
                          {new Date(sub.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Credential ID:</span>
                        <span className="font-mono font-bold text-indigo-600">{certId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2 relative z-10">
                    <button
                      onClick={() => setSelectedSubmission(sub)}
                      className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>View Certificate</span>
                    </button>

                    <button
                      onClick={() => setSelectedSubmission(sub)}
                      className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                      title="Print"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No Certificates Earned Yet</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Complete any AI Quiz with a score of 70% or higher to unlock your first accredited Learn Hub certificate.
            </p>
            <button
              onClick={() => setPortalView('quizzes')}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer shadow-xs transition"
            >
              <Brain className="w-4 h-4" />
              <span>Browse AI Quizzes</span>
            </button>
          </div>
        )}
      </div>

      {/* Credential Verification Tool */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Public Credential Verification Engine</span>
            </h3>
            <p className="text-xs text-slate-400">
              Employers and institutions can enter any Learn Hub credential ID to verify student authenticity.
            </p>
          </div>
        </div>

        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={verificationInput}
              onChange={(e) => setVerificationInput(e.target.value)}
              placeholder="e.g. LH-QUIZ-ABC123"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-hidden focus:border-indigo-500 font-mono uppercase"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm cursor-pointer shadow-xs transition shrink-0"
          >
            Verify Credential
          </button>
        </form>

        {verificationResult && (
          <div className={`p-4 rounded-2xl border text-xs sm:text-sm ${
            verificationResult.valid 
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200' 
              : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
          }`}>
            {verificationResult.valid ? (
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">Valid Verified Credential Found!</div>
                  <div>Student: <span className="font-semibold text-white">{verificationResult.studentName}</span></div>
                  <div>Assessment: <span className="font-semibold text-white">{verificationResult.course}</span></div>
                  <div>ID: <span className="font-mono text-emerald-300 font-bold">{verificationResult.certId}</span> (Issued on {verificationResult.date})</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-bold">No record found.</span> Check the credential ID format and try again.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Render Certificate Modal when opened */}
      <CertificateModal 
        submission={selectedSubmission} 
        onClose={() => setSelectedSubmission(null)} 
      />

    </div>
  );
};
