import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { subscribeToNotices } from '../../lib/firebase';
import { 
  Mail, 
  Send, 
  CheckCheck, 
  MessageSquare, 
  Sparkles, 
  Bell, 
  AlertTriangle, 
  Info, 
  ShieldCheck, 
  Calendar,
  Search,
  Filter
} from 'lucide-react';
import { NoticeItem } from '../../types';

export const InboxView: React.FC = () => {
  const { inboxMessages, notices, setNotices, markMessageAsRead, sendChatMessage } = useAppStore();
  const [selectedItem, setSelectedItem] = useState<{ type: 'notice' | 'message'; id: string } | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'notices' | 'messages'>('all');
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Subscribe to real-time admin notices from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToNotices(
      (items) => {
        setNotices(items);
        // Default select first notice if available
        if (items.length > 0 && !selectedItem) {
          setSelectedItem({ type: 'notice', id: items[0].id });
        }
      },
      (error) => {
        console.error('Failed to subscribe to notices:', error);
      }
    );
    return () => unsubscribe();
  }, [setNotices]);

  // Combine notices & messages
  const combinedItems = [
    ...notices.map((n) => ({
      id: n.id,
      type: 'notice' as const,
      title: n.title,
      senderName: n.authorName || 'Administrator',
      senderRole: 'Official Admin Notice',
      senderEmail: n.authorEmail,
      content: n.content,
      timestamp: n.createdAt ? new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent',
      priority: n.priority,
      tag: n.tag || 'Notice',
      isNotice: true,
      unread: false,
    })),
    ...inboxMessages.map((m) => ({
      id: m.id,
      type: 'message' as const,
      title: m.tag,
      senderName: m.senderName,
      senderRole: m.senderRole,
      senderEmail: '',
      content: m.content,
      timestamp: m.timestamp,
      priority: 'normal' as const,
      tag: m.tag,
      isNotice: false,
      unread: m.unread,
    }))
  ];

  // Apply filters & search
  const filteredItems = combinedItems.filter((item) => {
    if (filterType === 'notices' && item.type !== 'notice') return false;
    if (filterType === 'messages' && item.type !== 'message') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        item.senderName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeNotice = notices.find((n) => selectedItem?.type === 'notice' && n.id === selectedItem?.id);
  const activeMessage = inboxMessages.find((m) => selectedItem?.type === 'message' && m.id === selectedItem?.id);

  // If none selected, fallback to first item
  const hasSelection = activeNotice || activeMessage;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    sendChatMessage(replyText.trim(), 'Student Reply');
    setReplyText('');
  };

  const urgentNotice = notices.find((n) => n.priority === 'urgent');

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Student Inbox & Announcements</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-700">
              {filteredItems.length}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            View real-time notices posted by the Administrator and connect with course instructors.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterType === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All ({combinedItems.length})
          </button>
          <button
            onClick={() => setFilterType('notices')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              filterType === 'notices'
                ? 'bg-indigo-600 text-white'
                : 'text-indigo-700 hover:bg-indigo-50'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Admin Notices ({notices.length})</span>
          </button>
          <button
            onClick={() => setFilterType('messages')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              filterType === 'messages'
                ? 'bg-slate-800 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Messages ({inboxMessages.length})</span>
          </button>
        </div>
      </div>

      {/* Urgent Broadcast Notice Alert Banner */}
      {urgentNotice && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-transparent border border-rose-200/80 flex items-start gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <AlertTriangle className="w-4 h-4 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-600 text-white">
                Urgent Notice
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {urgentNotice.title}
              </h4>
            </div>
            <p className="text-xs text-slate-600 mt-1 line-clamp-1">
              {urgentNotice.content}
            </p>
          </div>
          <button
            onClick={() => setSelectedItem({ type: 'notice', id: urgentNotice.id })}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shrink-0 transition cursor-pointer"
          >
            Read Notice
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden min-h-[540px]">
        
        {/* Left List (5 cols) */}
        <div className="lg:col-span-5 border-r border-slate-200 flex flex-col">
          
          {/* Search Box */}
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notices or messages..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 bg-white"
              />
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No notices or messages found.
              </div>
            ) : (
              filteredItems.map((item) => {
                const isSelected = selectedItem?.id === item.id && selectedItem?.type === item.type;
                
                return (
                  <div
                    key={`${item.type}-${item.id}`}
                    onClick={() => {
                      setSelectedItem({ type: item.type, id: item.id });
                      if (item.type === 'message') {
                        markMessageAsRead(item.id);
                      }
                    }}
                    className={`p-4 cursor-pointer transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-indigo-50/80 border-l-4 border-indigo-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    {item.isNotice ? (
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs text-white ${
                        item.priority === 'urgent'
                          ? 'bg-rose-600'
                          : item.priority === 'info'
                          ? 'bg-sky-600'
                          : 'bg-indigo-600'
                      }`}>
                        <Bell className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-2xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {item.senderName.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <h4 className={`text-xs font-bold truncate ${
                            item.unread ? 'text-indigo-950 font-black' : 'text-slate-900'
                          }`}>
                            {item.isNotice ? item.title : item.senderName}
                          </h4>
                          {item.isNotice && (
                            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">{item.timestamp}</span>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                          item.priority === 'urgent'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : item.priority === 'info'
                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}>
                          {item.isNotice ? `Admin Notice: ${item.tag}` : item.tag}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 truncate mt-1">
                        {item.content}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Detail Pane (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50/30">
          {activeNotice ? (
            <div className="flex flex-col h-full justify-between">
              <div>
                {/* Notice Header */}
                <div className="p-6 bg-white border-b border-slate-200">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm ${
                        activeNotice.priority === 'urgent'
                          ? 'bg-rose-600'
                          : activeNotice.priority === 'info'
                          ? 'bg-sky-600'
                          : 'bg-indigo-600'
                      }`}>
                        <Bell className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            activeNotice.priority === 'urgent'
                              ? 'bg-rose-100 text-rose-700'
                              : activeNotice.priority === 'info'
                              ? 'bg-sky-100 text-sky-700'
                              : 'bg-indigo-100 text-indigo-700'
                          }`}>
                            {activeNotice.priority} priority
                          </span>
                          <span className="text-[11px] text-slate-400 font-semibold">• {activeNotice.tag || 'Broadcast'}</span>
                        </div>
                        <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                          {activeNotice.title}
                        </h3>
                      </div>
                    </div>

                    <div className="text-right text-[11px] text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {activeNotice.createdAt ? new Date(activeNotice.createdAt).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Recent'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Author Credential Badge */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-slate-900">{activeNotice.authorName || 'Administrator'}</span>
                      <span className="text-slate-400 font-mono text-[11px]">({activeNotice.authorEmail})</span>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                      Verified Broadcast
                    </span>
                  </div>
                </div>

                {/* Notice Body */}
                <div className="p-6 space-y-4">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Notice Announcement</h5>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                      {activeNotice.content}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center gap-3">
                    <Info className="w-4 h-4 text-indigo-600 shrink-0" />
                    <p className="text-xs text-indigo-900 font-medium">
                      This announcement was dispatched directly by the administrator to all registered Learn Hub students.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom footer */}
              <div className="p-4 bg-white border-t border-slate-200 text-right">
                <span className="text-[11px] text-slate-400">
                  Notification ID: <code className="font-mono text-slate-500">{activeNotice.id}</code>
                </span>
              </div>
            </div>
          ) : activeMessage ? (
            <>
              {/* Message Header */}
              <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={activeMessage.senderAvatar}
                    alt={activeMessage.senderName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{activeMessage.senderName}</h3>
                    <p className="text-xs text-slate-400">{activeMessage.senderRole} • {activeMessage.tag}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400">{activeMessage.timestamp}</span>
              </div>

              {/* Message Body */}
              <div className="p-6 flex-1 overflow-y-auto space-y-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs max-w-lg">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {activeMessage.content}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-2 block text-right">
                    Delivered • Verified Instructor
                  </span>
                </div>
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${activeMessage.senderName}...`}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400 text-xs">
              <Mail className="w-8 h-8 text-slate-300 mb-2" />
              <span>Select an announcement or message from the left to read.</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
