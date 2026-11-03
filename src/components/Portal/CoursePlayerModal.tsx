import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  X, 
  Play, 
  Pause, 
  CheckCircle2, 
  Circle, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Award, 
  Sparkles,
  BookOpen,
  MessageSquare,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CoursePlayerModal: React.FC = () => {
  const { 
    selectedCourseForPlayer, 
    activeLessonId, 
    closeCoursePlayer, 
    completeLesson,
    openCoursePlayer,
    enrollInCourse,
    enrollments 
  } = useAppStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'syllabus' | 'notes' | 'discussion'>('syllabus');
  const [notesText, setNotesText] = useState('Key concepts: Semantic landmarks, auto-layout constraints, and fluid typography formulas.');

  if (!selectedCourseForPlayer) return null;

  const currentCourse = selectedCourseForPlayer;
  const isEnrolled = enrollments.some(e => e.courseId === currentCourse.id);
  const currentLesson = currentCourse.lessons.find(l => l.id === activeLessonId) || currentCourse.lessons[0];
  const completedLessonsCount = currentCourse.lessons.filter(l => l.completed).length;
  const progressPercent = Math.round((completedLessonsCount / currentCourse.lessons.length) * 100);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleLessonComplete = () => {
    if (currentLesson) {
      completeLesson(currentCourse.id, currentLesson.id);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-6xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        >
          {/* Top Bar */}
          <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between gap-4 border-b border-slate-800">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 shrink-0">
                {currentCourse.category}
              </span>
              <h3 className="font-bold text-sm sm:text-base text-white truncate">
                {currentCourse.title}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {!isEnrolled && (
                <button
                  onClick={() => enrollInCourse(currentCourse)}
                  className="px-3.5 py-1.5 rounded-full bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs transition cursor-pointer shadow-xs"
                >
                  Enroll in Track
                </button>
              )}
              <button
                onClick={closeCoursePlayer}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Body: Video Area (Left) + Lessons/Tabs (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
            
            {/* Video Player Column (8 cols) */}
            <div className="lg:col-span-8 bg-slate-950 flex flex-col justify-between relative group">
              
              {/* Simulated Screen with ambient image background */}
              <div className="relative aspect-video w-full bg-slate-900 flex items-center justify-center overflow-hidden">
                <img
                  src={currentCourse.thumbnail}
                  alt={currentCourse.title}
                  className={`w-full h-full object-cover opacity-60 transition-all duration-700 ${
                    isPlaying ? 'scale-105 blur-[1px]' : 'scale-100'
                  }`}
                />

                {/* Big Play overlay button */}
                <button
                  onClick={handleTogglePlay}
                  className="absolute z-10 w-20 h-20 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-indigo-600 transition-all cursor-pointer backdrop-blur-xs"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 fill-current" />
                  ) : (
                    <Play className="w-8 h-8 fill-current ml-1" />
                  )}
                </button>

                {/* Simulated Lesson Title Overlay */}
                <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Lesson: {currentLesson?.title || 'Interactive Walkthrough'}</span>
                </div>

                {progressPercent === 100 && (
                  <div className="absolute bottom-16 left-4 z-10 bg-emerald-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
                    <Award className="w-4 h-4" /> Course 100% Completed!
                  </div>
                )}
              </div>

              {/* Player Controls Bar */}
              <div className="p-4 bg-slate-900/95 border-t border-slate-800 text-white space-y-2">
                {/* Scrubber timeline */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden cursor-pointer group/scrub">
                  <div 
                    className="h-full bg-indigo-500 rounded-full relative transition-all"
                    style={{ width: isPlaying ? '65%' : '25%' }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleTogglePlay}
                      className="hover:text-white transition"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>
                    
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="hover:text-white transition"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <span className="text-[11px] font-mono">
                      {isPlaying ? '08:24' : '02:15'} / {currentLesson?.duration || '18:00'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : 1)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300"
                    >
                      {playbackSpeed}x
                    </button>

                    <button
                      onClick={handleLessonComplete}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{currentLesson?.completed ? 'Lesson Completed ✓' : 'Mark Complete'}</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Syllabus & Notes (4 cols) */}
            <div className="lg:col-span-4 bg-slate-50 flex flex-col h-full border-l border-slate-200">
              
              {/* Tabs */}
              <div className="flex border-b border-slate-200 bg-white">
                <button
                  onClick={() => setActiveTab('syllabus')}
                  className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition ${
                    activeTab === 'syllabus'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Syllabus ({currentCourse.lessons.length})
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition ${
                    activeTab === 'notes'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  My Notes
                </button>
                <button
                  onClick={() => setActiveTab('discussion')}
                  className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition ${
                    activeTab === 'discussion'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Q&A
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-4 flex-1 overflow-y-auto">
                {activeTab === 'syllabus' && (
                  <div className="space-y-2">
                    <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
                      <span>Curriculum</span>
                      <span className="font-bold text-indigo-600">{progressPercent}% Completed</span>
                    </div>

                    {currentCourse.lessons.map((lesson, index) => {
                      const isCurrent = lesson.id === activeLessonId;
                      return (
                        <div
                          key={lesson.id}
                          onClick={() => openCoursePlayer(currentCourse, lesson.id)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isCurrent
                              ? 'bg-indigo-50/80 border-indigo-200 shadow-xs'
                              : 'bg-white border-slate-200/80 hover:bg-slate-100/60'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                completeLesson(currentCourse.id, lesson.id);
                              }}
                              className="shrink-0"
                            >
                              {lesson.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-500" />
                              )}
                            </button>

                            <div className="min-w-0">
                              <p className={`text-xs font-bold truncate ${
                                isCurrent ? 'text-indigo-900' : 'text-slate-800'
                              }`}>
                                {index + 1}. {lesson.title}
                              </p>
                              <span className="text-[10px] text-slate-400">{lesson.duration}</span>
                            </div>
                          </div>

                          {isCurrent && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-600 text-white shrink-0">
                              Now
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-500">
                      Personal scratchpad for this lecture. Auto-saved locally.
                    </p>
                    <textarea
                      value={notesText}
                      onChange={(e) => setNotesText(e.target.value)}
                      rows={8}
                      className="w-full p-3 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                    />
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800">
                      💡 Pro Tip: Review your notes before taking the milestone quiz to unlock your certificate.
                    </div>
                  </div>
                )}

                {activeTab === 'discussion' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-800">Sofia Karim (Instructor)</span>
                        <span className="text-[10px] text-slate-400">Pinned</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        Welcome everyone! Make sure you duplicate the community Figma file before starting lesson 4.
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-800">Alex M.</span>
                        <span className="text-[10px] text-slate-400">1h ago</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        Should we use CSS Grid or Flexbox for the card gallery layout?
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Instructor footer */}
              <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={currentCourse.instructorAvatar}
                    alt={currentCourse.instructorName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <span className="block text-xs font-bold text-slate-900">{currentCourse.instructorName}</span>
                    <span className="text-[10px] text-slate-400">{currentCourse.instructorRole}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                  ★ {currentCourse.rating}
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
