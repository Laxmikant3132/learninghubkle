import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Sparkles, 
  GraduationCap, 
  MoreVertical, 
  ArrowRight, 
  UserPlus, 
  Check, 
  Flame, 
  TrendingUp,
  Clock,
  Layers,
  Code2,
  PenTool,
  Bell,
  Radio,
  Brain,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';

export const DashboardView: React.FC = () => {
  const { 
    currentUser, 
    courses, 
    enrollments, 
    mentors, 
    notices, 
    liveSessions, 
    quizzes, 
    quizSubmissions,
    toggleFollowMentor, 
    openCoursePlayer, 
    setPortalView 
  } = useAppStore();

  const [activeSlide, setActiveSlide] = useState(0);

  const liveNow = liveSessions.find((s) => s.status === 'live');
  const urgentNotice = notices.find((n) => n.priority === 'urgent');

  // Filter courses for continue watching
  const continueWatchingCourses = courses.slice(3, 6);
  const relatedCourses = courses.slice(0, 3);

  // Quick stats categories matching Screenshot 2
  const categoryPills = [
    {
      title: 'UI/UX Design',
      watched: '3/8 watched',
      color: 'bg-indigo-50 border-indigo-100 text-indigo-700',
      iconColor: 'text-indigo-600 bg-white',
      icon: PenTool
    },
    {
      title: 'Branding',
      watched: '2/6 watched',
      color: 'bg-pink-50 border-pink-100 text-pink-700',
      iconColor: 'text-pink-600 bg-white',
      icon: Layers
    },
    {
      title: 'Front End',
      watched: '5/8 watched',
      color: 'bg-teal-50 border-teal-100 text-teal-700',
      iconColor: 'text-teal-600 bg-white',
      icon: Code2
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* 2-Column Layout: Main Dashboard Content (Left) + Right Stats Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left / Center Main Content (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-6">

          {/* Live Session Alert Banner */}
          {liveNow && (
            <div 
              onClick={() => setPortalView('live')}
              className="p-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-indigo-600 text-white shadow-lg flex items-center justify-between cursor-pointer hover:opacity-95 transition"
            >
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Radio className="w-5 h-5 animate-pulse" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-white text-rose-700 text-[10px] font-black uppercase tracking-wider">
                      LIVE NOW
                    </span>
                    <h4 className="font-extrabold text-sm">{liveNow.title}</h4>
                  </div>
                  <p className="text-[11px] text-rose-100 mt-0.5">
                    Conducted by {liveNow.hostName} • Click to enter virtual classroom room
                  </p>
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-xs flex items-center gap-1 shrink-0">
                <span>Join</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          )}

          {/* Urgent Admin Notice Alert */}
          {urgentNotice && (
            <div
              onClick={() => setPortalView('inbox')}
              className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between cursor-pointer hover:bg-amber-100/70 transition"
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-xs font-bold truncate">
                  Admin Notice: {urgentNotice.title}
                </span>
              </div>
              <span className="text-[11px] font-bold text-amber-700 underline shrink-0">
                View Inbox
              </span>
            </div>
          )}
          
          {/* Vibrant Purple/Indigo Hero Banner (Matching Screenshot 2 Left) */}
          <div className="relative rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 p-8 text-white overflow-hidden shadow-xl shadow-indigo-600/20">
            
            {/* Background 3D Cap / Geometric Shapes */}
            <div className="absolute right-4 -bottom-6 w-56 h-56 opacity-20 pointer-events-none">
              <GraduationCap className="w-full h-full stroke-1" />
            </div>
            <div className="absolute right-24 top-6 w-20 h-20 rounded-2xl bg-white/10 rotate-12 backdrop-blur-xs pointer-events-none" />
            <div className="absolute right-12 bottom-12 w-14 h-14 rounded-full bg-indigo-400/20 blur-lg pointer-events-none" />

            <div className="relative z-10 max-w-md">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-wider mb-4 border border-white/25">
                ONLINE COURSE
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                Sharpen Your Skills with Professional Online Courses
              </h2>

              <p className="mt-2 text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
                Unlock specialized modules in modern web applications, scalable design systems, and data pipelines.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => setPortalView('courses')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-lg transition-transform hover:scale-105 cursor-pointer"
                >
                  <span>Join Now</span>
                  <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                    <ArrowRight className="w-2.5 h-2.5" />
                  </div>
                </button>

                <button
                  onClick={() => setPortalView('quizzes')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 backdrop-blur-sm transition-transform hover:scale-105 cursor-pointer"
                >
                  <Brain className="w-3.5 h-3.5 text-indigo-200" />
                  <span>AI Quizzes</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Category Progress Pills Row (Matching Screenshot 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {categoryPills.map((pill) => {
              const Icon = pill.icon;
              return (
                <div
                  key={pill.title}
                  onClick={() => setPortalView('courses')}
                  className={`p-4 rounded-2xl border ${pill.color} flex items-center justify-between cursor-pointer hover:shadow-md transition-all group`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${pill.iconColor} shadow-xs flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] opacity-75 font-medium block">
                        {pill.watched}
                      </span>
                      <h4 className="text-sm font-bold tracking-tight">
                        {pill.title}
                      </h4>
                    </div>
                  </div>

                  <button className="text-slate-400 hover:text-slate-600 p-1">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Continue Watching Section (Matching Screenshot 2) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Continue Watching
                </h3>
                <p className="text-xs text-slate-400">Pick up right where you left off</p>
              </div>

              {/* Slider Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
                  className="w-7 h-7 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveSlide(Math.min(1, activeSlide + 1))}
                  className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs hover:bg-indigo-700 transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3 Course Cards Grid matching Screenshot 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {continueWatchingCourses.map((course, idx) => {
                const progressValues = [62, 40, 85];
                const progress = progressValues[idx % 3];

                return (
                  <motion.div
                    key={course.id}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Thumbnail with hover play overlay */}
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div 
                          onClick={() => openCoursePlayer(course)}
                          className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-full bg-white/90 text-indigo-600 flex items-center justify-center shadow-md">
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          </div>
                        </div>

                        <span className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-indigo-700">
                          {course.category}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h4 
                          onClick={() => openCoursePlayer(course)}
                          className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 cursor-pointer hover:text-indigo-600 transition-colors"
                        >
                          {course.title}
                        </h4>

                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium mb-1">
                            <span>Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Instructor */}
                    <div className="p-4 pt-0 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={course.instructorAvatar}
                          alt={course.instructorName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-[11px] font-bold text-slate-800 leading-tight">
                            {course.instructorName}
                          </p>
                          <p className="text-[9px] text-slate-400 leading-none">Instructor</p>
                        </div>
                      </div>

                      <button
                        onClick={() => openCoursePlayer(course)}
                        className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition text-[11px] font-bold"
                      >
                        Resume
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Related Courses Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Related Courses
              </h3>
              <button
                onClick={() => setPortalView('courses')}
                className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <span>Browse All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => openCoursePlayer(course)}
                  className="p-3 bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition cursor-pointer flex gap-3 items-center group"
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold text-indigo-600 block truncate">
                      {course.category}
                    </span>
                    <h5 className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                      {course.title}
                    </h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {course.instructorName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Stats & People You May Know Column (4 cols on lg matching Screenshot 2) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Statistic Widget matching Screenshot 2 Right Panel */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 tracking-tight">
                Statistic
              </h3>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Circular Gauge + Avatar Center */}
            <div className="flex flex-col items-center text-center my-4">
              <div className="relative w-28 h-28 flex items-center justify-center">
                {/* SVG Radial Gauge */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#F1F5F9"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#4F46E5"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset="170" /* approx 32% */
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                {/* Center User Avatar */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <img
                    src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={currentUser?.name || 'Student'}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-white shadow-md"
                  />
                </div>

                {/* Badge 32% */}
                <div className="absolute -top-1 right-1 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  32%
                </div>
              </div>

              <h4 className="mt-3 font-bold text-sm text-slate-900">
                Good Morning {currentUser?.name ? currentUser.name.split(' ')[0] : 'Learner'}
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mt-0.5">
                Continue your learning to achieve your target.
              </p>
            </div>

            {/* Weekly Learning Hours Bar Chart matching Screenshot 2 */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-4 font-medium">
                <span>Learning Hours</span>
                <span className="text-indigo-600 font-bold">12.5 hrs this week</span>
              </div>

              {/* Bar Chart Visual */}
              <div className="h-28 flex items-end justify-around gap-4 pt-2">
                {/* Bar 1: 1-10 May */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full max-w-[32px] bg-indigo-100 rounded-lg relative overflow-hidden h-12 flex items-end">
                    <div className="w-full bg-indigo-400 h-full rounded-lg" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 whitespace-nowrap">
                    1-10 May
                  </span>
                </div>

                {/* Bar 2: 11-20 May */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full max-w-[32px] bg-indigo-100 rounded-lg relative overflow-hidden h-24 flex items-end">
                    <div className="w-full bg-indigo-600 h-full rounded-lg" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 whitespace-nowrap">
                    11-20 May
                  </span>
                </div>

                {/* Bar 3: 21-30 May */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full max-w-[32px] bg-indigo-100 rounded-lg relative overflow-hidden h-20 flex items-end">
                    <div className="w-full bg-indigo-500 h-full rounded-lg" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 whitespace-nowrap">
                    21-30 May
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Accredited Credentials Highlight Card */}
          {quizSubmissions.filter((s) => s.passed).length > 0 ? (
            <div 
              onClick={() => setPortalView('certificates')}
              className="bg-linear-to-br from-amber-500 via-amber-400 to-amber-600 rounded-3xl p-5 text-slate-950 shadow-md cursor-pointer hover:shadow-lg transition group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-white/40 backdrop-blur-md flex items-center justify-center font-bold">
                  <Award className="w-5 h-5 text-slate-950" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/50 px-2.5 py-1 rounded-full text-slate-950">
                  {quizSubmissions.filter((s) => s.passed).length} {quizSubmissions.filter((s) => s.passed).length === 1 ? 'Credential' : 'Credentials'}
                </span>
              </div>
              <h4 className="font-extrabold text-sm mt-3 text-slate-950 group-hover:underline flex items-center gap-1.5">
                <span>Accredited AI Certificates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </h4>
              <p className="text-[11px] text-amber-950/80 mt-0.5 font-medium leading-relaxed">
                Click to view, print, or share your official verified credentials.
              </p>
            </div>
          ) : (
            <div 
              onClick={() => setPortalView('quizzes')}
              className="bg-slate-900 rounded-3xl p-5 text-white shadow-md cursor-pointer hover:bg-slate-800 transition group border border-slate-800"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                  AI Quiz
                </span>
              </div>
              <h4 className="font-extrabold text-sm mt-3 group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                <span>Earn AI Literacy Credentials</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Pass AI quizzes (70%+) to earn digitally verified certificates of excellence.
              </p>
            </div>
          )}

          {/* People you may know Widget matching Screenshot 2 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 tracking-tight">
                  People you may know
                </h3>
                <p className="text-[11px] text-slate-400">Mentors & peer study buddies</p>
              </div>
            </div>

            <div className="space-y-3.5">
              {mentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                    />
                    <div className="min-w-0">
                      <h5 className="font-bold text-xs text-slate-800 truncate">
                        {mentor.name}
                      </h5>
                      <p className="text-[11px] text-slate-400 truncate">
                        {mentor.mutualCount} mutuals • {mentor.role}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFollowMentor(mentor.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition cursor-pointer shrink-0 ${
                      mentor.isFollowing
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600'
                    }`}
                  >
                    {mentor.isFollowing ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3 h-3" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
