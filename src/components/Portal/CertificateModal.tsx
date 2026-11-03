import React, { useRef, useState } from 'react';
import { QuizSubmission } from '../../types';
import { 
  Award, 
  CheckCircle2, 
  Printer, 
  Copy, 
  Check, 
  X, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles,
  Calendar,
  ExternalLink
} from 'lucide-react';

interface CertificateModalProps {
  submission: QuizSubmission | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ submission, onClose }) => {
  const [copied, setCopied] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!submission) return null;

  // Generate deterministic certificate ID if not present
  const certId = `LH-${submission.quizId.slice(0, 4).toUpperCase()}-${submission.id.slice(0, 6).toUpperCase()}`;
  
  const issueDate = submission.submittedAt 
    ? new Date(submission.submittedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

  const handleCopyId = () => {
    navigator.clipboard.writeText(certId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 print:shadow-none print:border-none print:max-w-none print:rounded-none">
        
        {/* Top Header - Hidden in Print */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base tracking-tight">Verified Academic Credential</h3>
              <p className="text-[11px] text-slate-400">Official Learn Hub Certificate of Completion</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Body Container */}
        <div className="p-6 sm:p-10 bg-slate-100 flex justify-center print:p-0 print:bg-white">
          <div 
            ref={certificateRef}
            className="w-full bg-linear-to-b from-amber-50/40 via-white to-amber-50/30 border-8 border-amber-600/30 rounded-2xl p-6 sm:p-12 relative shadow-lg overflow-hidden print:border-4 print:shadow-none"
            style={{
              backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.95) 0%, rgba(253,250,243,0.98) 100%)'
            }}
          >
            {/* Subtle Inner Decorative Filigree Border */}
            <div className="absolute inset-2 border-2 border-dashed border-amber-500/30 rounded-xl pointer-events-none" />
            
            {/* Corner Badges */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-600" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-600" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-600" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-600" />

            {/* Header: Crest and Title */}
            <div className="text-center relative z-10 space-y-3">
              <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-widest shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Learn Hub Academic Board</span>
              </div>

              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div className="text-left">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    LEARN HUB
                  </h1>
                  <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Institute of Modern Technology & AI Education
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <h2 className="text-xl sm:text-3xl font-serif font-black text-amber-900 tracking-wide uppercase">
                  Certificate of Achievement
                </h2>
                <div className="w-32 h-1 bg-linear-to-r from-transparent via-amber-600 to-transparent mx-auto mt-2" />
              </div>
            </div>

            {/* Recipient Details */}
            <div className="my-6 text-center space-y-4 relative z-10">
              <p className="text-xs sm:text-sm font-medium text-slate-600 italic">
                This document certifies that
              </p>

              <div className="py-2">
                <div className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 underline decoration-amber-400 decoration-2 underline-offset-8">
                  {submission.studentName || 'Distinguished Scholar'}
                </div>
                <p className="text-xs text-slate-500 mt-2 font-mono">{submission.studentEmail}</p>
              </div>

              <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-xl mx-auto leading-relaxed">
                has successfully completed all curricular benchmarks, evaluations, and comprehensive examinations in
              </p>

              <div className="inline-block px-6 py-2.5 bg-indigo-50 border border-indigo-200/80 rounded-xl text-indigo-950 font-extrabold text-base sm:text-xl shadow-xs">
                {submission.quizTitle}
              </div>

              <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-700 pt-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Grade: {submission.percentage}% (Score: {submission.score}/{submission.totalQuestions})
                </span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Completed: {issueDate}
                </span>
              </div>
            </div>

            {/* Signatures & Seal Section */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-center relative z-10">
              
              {/* Signature 1 */}
              <div className="space-y-1">
                <div className="font-serif italic text-lg sm:text-xl text-slate-800 font-bold border-b border-slate-400 pb-1 max-w-[180px] mx-auto">
                  Laxmikant Talli
                </div>
                <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                  Lead Administrator
                </p>
                <p className="text-[10px] text-slate-500">Learn Hub Academic Director</p>
              </div>

              {/* Gold Holographic Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-linear-to-tr from-amber-500 via-amber-300 to-amber-600 p-1 shadow-lg shadow-amber-500/20 flex items-center justify-center">
                  <div className="w-full h-full rounded-full border-2 border-dashed border-white/80 flex flex-col items-center justify-center bg-linear-to-b from-amber-600 to-amber-700 text-white text-center p-1">
                    <ShieldCheck className="w-6 h-6 text-amber-200 drop-shadow-sm" />
                    <span className="text-[8px] font-black uppercase tracking-tighter mt-0.5">VERIFIED</span>
                    <span className="text-[7px] font-bold text-amber-200 uppercase tracking-widest">OFFICIAL</span>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wider mt-1.5">
                  Accredited Credential
                </span>
              </div>

              {/* Signature 2 */}
              <div className="space-y-1">
                <div className="font-serif italic text-lg sm:text-xl text-slate-800 font-bold border-b border-slate-400 pb-1 max-w-[180px] mx-auto">
                  Dr. Elena Rostova
                </div>
                <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                  Dean of AI Research
                </p>
                <p className="text-[10px] text-slate-500">Global AI Literacy Council</p>
              </div>

            </div>

            {/* Bottom Credential Verification ID */}
            <div className="mt-8 pt-4 border-t border-slate-200/50 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold">Credential ID:</span>
                <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {certId}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Digitally Verified & Stored on Learn Hub Ledger</span>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Bottom Actions - Hidden in Print */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyId}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold text-xs text-slate-700 flex items-center gap-1.5 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'ID Copied!' : `Copy Credential ID (${certId})`}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Certificate</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
