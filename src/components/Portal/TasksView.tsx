import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  Square, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  BookOpen,
  ClipboardList
} from 'lucide-react';

export const TasksView: React.FC = () => {
  const { tasks, toggleTask } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Study Tasks & Assignments
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Milestones and assignments assigned by course instructors and administrators.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-1.5">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Assigned by Instructors</span>
          </span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Assigned</span>
            <h4 className="text-xl font-bold text-slate-900">{tasks.length}</h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Completed</span>
            <h4 className="text-xl font-bold text-emerald-600">{completedCount}</h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Pending Tasks</span>
            <h4 className="text-xl font-bold text-indigo-600">{tasks.length - completedCount}</h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
            filter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          All ({tasks.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
            filter === 'pending' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Pending ({tasks.length - completedCount})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
            filter === 'completed' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            No tasks found in this view.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const priorityColors = {
              high: 'bg-rose-50 text-rose-700 border-rose-200',
              medium: 'bg-amber-50 text-amber-700 border-amber-200',
              low: 'bg-slate-100 text-slate-700 border-slate-200',
            };

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl bg-white border transition-all flex items-center justify-between gap-4 ${
                  task.completed ? 'border-slate-200 bg-slate-50/50 opacity-70' : 'border-slate-200/90 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="shrink-0 cursor-pointer"
                    title={task.completed ? 'Mark as incomplete' : 'Mark as completed'}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 hover:text-indigo-600" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <h4 className={`text-xs sm:text-sm font-bold truncate ${
                      task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}>
                      {task.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{task.courseName}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {task.dueDate}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
