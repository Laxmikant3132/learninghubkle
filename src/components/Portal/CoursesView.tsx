import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Play, 
  Star, 
  Clock, 
  BookOpen, 
  CheckCircle,
  MoreVertical,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CoursesView: React.FC = () => {
  const { 
    courses, 
    globalSearchQuery, 
    selectedCategory, 
    selectedSubjectFilters, 
    selectedLanguageFilters,
    setSelectedCategory,
    toggleSubjectFilter,
    toggleLanguageFilter,
    clearAllFilters,
    openCoursePlayer,
    enrollInCourse,
    enrollments
  } = useAppStore();

  const [showMoreQuickLinks, setShowMoreQuickLinks] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  // Filter courses based on search and filters
  const filteredCourses = courses.filter((course) => {
    // Search query
    if (globalSearchQuery.trim()) {
      const q = globalSearchQuery.toLowerCase();
      const matchesSearch = 
        course.title.toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q) ||
        course.instructorName.toLowerCase().includes(q) ||
        course.description.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (selectedCategory !== 'All' && course.category !== selectedCategory) {
      return false;
    }

    // Subject checkboxes
    if (selectedSubjectFilters.length > 0 && !selectedSubjectFilters.includes(course.category)) {
      return false;
    }

    // Language checkboxes
    if (selectedLanguageFilters.length > 0 && !selectedLanguageFilters.includes(course.language)) {
      return false;
    }

    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / coursesPerPage));
  const displayedCourses = filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  const quickLinkCategories = [
    { label: 'Business', count: '3,844' },
    { label: 'UI / UX Design', count: '3,844' },
    { label: 'Front End', count: '3,844' },
    { label: 'Data Science', count: '3,844' },
    { label: 'Computer Science', count: '3,844' },
    { label: 'Branding', count: '1,920' },
  ];

  const languagesList = [
    { label: 'English', count: '3,844' },
    { label: 'Spanish', count: '1,280' },
    { label: 'French', count: '890' },
    { label: 'German', count: '640' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* 2-Column layout: Course Cards Grid + Right "Filter by" Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Main Results Area (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Header matching Screenshot 2 Right */}
          <div className="flex items-center justify-between pb-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                All results
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Showing {filteredCourses.length} verified courses
                {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              </p>
            </div>

            {/* Pagination Controls matching reference */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 mr-2 hidden sm:inline">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs hover:bg-indigo-700 disabled:opacity-40 transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Filter Chips */}
          {(selectedCategory !== 'All' || selectedSubjectFilters.length > 0 || selectedLanguageFilters.length > 0 || globalSearchQuery) && (
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-400 font-medium">Active filters:</span>
              {selectedCategory !== 'All' && (
                <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 flex items-center gap-1">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')} className="hover:text-indigo-900">✕</button>
                </span>
              )}
              {selectedSubjectFilters.map(s => (
                <span key={s} className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold flex items-center gap-1">
                  {s}
                  <button onClick={() => toggleSubjectFilter(s)} className="hover:text-slate-900">✕</button>
                </span>
              ))}
              {globalSearchQuery && (
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-semibold border border-amber-200 flex items-center gap-1">
                  "{globalSearchQuery}"
                  <button onClick={clearAllFilters} className="hover:text-amber-900">✕</button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs text-rose-600 hover:underline font-semibold flex items-center gap-1 ml-2"
              >
                <RotateCcw className="w-3 h-3" /> Reset all
              </button>
            </div>
          )}

          {/* Course Cards Grid (Matching Screenshot 2 Courses View) */}
          {displayedCourses.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No courses match your filter</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try searching for a different keyword or resetting your filter selections.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedCourses.map((course, idx) => {
                const isEnrolled = enrollments.some(e => e.courseId === course.id);
                const progressValues = [60, 45, 80, 25, 90, 35];
                const progress = progressValues[idx % progressValues.length];

                return (
                  <motion.div
                    key={course.id}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Thumbnail with overlay */}
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
                          <div className="w-11 h-11 rounded-full bg-white/95 text-indigo-600 flex items-center justify-center shadow-lg">
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          </div>
                        </div>

                        {/* Category Badge Pill matching screenshot */}
                        <span className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-white/95 backdrop-blur-xs text-indigo-700 shadow-xs">
                          {course.category}
                        </span>

                        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{course.rating}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h4 
                          onClick={() => openCoursePlayer(course)}
                          className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 cursor-pointer hover:text-indigo-600 transition-colors leading-snug"
                        >
                          {course.title}
                        </h4>

                        {/* Progress Bar (Matching Screenshot 2) */}
                        <div className="mt-3">
                          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Instructor & Action */}
                    <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-50 mt-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={course.instructorAvatar}
                          alt={course.instructorName}
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-slate-800 truncate">
                            {course.instructorName}
                          </p>
                          <p className="text-[9px] text-slate-400 truncate">
                            {course.instructorRole}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => openCoursePlayer(course)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer bg-indigo-50 hover:bg-indigo-100 text-indigo-600"
                      >
                        {isEnrolled ? 'Watch' : 'Start'}
                      </button>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          )}

        </div>

        {/* Right: "Filter by" Panel matching Screenshot 2 Right */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900 tracking-tight flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-600" />
              <span>Filter by</span>
            </h3>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Links Section matching Screenshot 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              Quick Links
            </h4>
            <div className="space-y-2.5">
              {quickLinkCategories.slice(0, showMoreQuickLinks ? 6 : 5).map((item) => {
                const isSelected = selectedCategory === item.label || selectedSubjectFilters.includes(item.label);
                return (
                  <label
                    key={item.label}
                    className="flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 cursor-pointer select-none group"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          if (selectedCategory === item.label) {
                            setSelectedCategory('All');
                          } else {
                            setSelectedCategory(item.label);
                          }
                        }}
                        className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span className={isSelected ? 'font-bold text-indigo-600' : ''}>
                        {item.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      ({item.count})
                    </span>
                  </label>
                );
              })}
            </div>

            <button
              onClick={() => setShowMoreQuickLinks(!showMoreQuickLinks)}
              className="mt-3 text-xs font-semibold text-indigo-600 hover:underline block"
            >
              {showMoreQuickLinks ? 'Show less' : 'Show 7 more'}
            </button>
          </div>

          {/* Subject Filter Section matching Screenshot 2 */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              Subject
            </h4>
            <div className="space-y-2.5">
              {['Business', 'UI / UX Design', 'Front End', 'Data Science', 'Computer Science'].map((subj) => {
                const isChecked = selectedSubjectFilters.includes(subj);
                return (
                  <label
                    key={subj}
                    className="flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSubjectFilter(subj)}
                        className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span className={isChecked ? 'font-bold text-indigo-600' : ''}>
                        {subj}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      (3,844)
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Language Filter Section matching Screenshot 2 */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              Language
            </h4>
            <div className="space-y-2.5">
              {languagesList.map((lang) => {
                const isChecked = selectedLanguageFilters.includes(lang.label);
                return (
                  <label
                    key={lang.label}
                    className="flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleLanguageFilter(lang.label)}
                        className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span className={isChecked ? 'font-bold text-indigo-600' : ''}>
                        {lang.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      ({lang.count})
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Clear Button */}
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={clearAllFilters}
              className="w-full py-2.5 text-center text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
