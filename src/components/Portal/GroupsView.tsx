import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Users, Clock, Check, Plus, MessageCircle } from 'lucide-react';

export const GroupsView: React.FC = () => {
  const { studyGroups, toggleJoinGroup, setPortalView } = useAppStore();

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Community Study Groups
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Join peer cohorts, attend live weekly group code reviews, and work on capstone group projects.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {studyGroups.map((group) => (
          <div
            key={group.id}
            className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl shadow-xs">
                  {group.avatar}
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                  {group.category}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{group.name}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{group.description}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium text-slate-600">
                  <Users className="w-3.5 h-3.5 text-indigo-500" />
                  {group.membersCount} active peers
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  {group.meetingTime}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => toggleJoinGroup(group.id)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  group.isJoined
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20'
                }`}
              >
                {group.isJoined ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Member (Leave)</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Join Circle</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setPortalView('inbox')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
