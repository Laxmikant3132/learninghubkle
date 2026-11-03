import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { subscribeToLiveSessions } from '../../lib/firebase';
import { LiveSession } from '../../types';
import { 
  Radio, 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  Play, 
  Mic, 
  MicOff, 
  VideoOff, 
  Hand, 
  MessageSquare, 
  Send, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles,
  ScreenShare,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LiveSessionsView: React.FC = () => {
  const { currentUser, liveSessions, setLiveSessions } = useAppStore();
  const [activeSession, setActiveSession] = useState<LiveSession | null>(null);
  
  // Interactive Live Room State
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ id: string; user: string; text: string; time: string }[]>([
    { id: '1', user: 'Admin Instructor', text: 'Welcome everyone! Today we are discussing practical Prompt Engineering and Agent Workflows.', time: '10:02 AM' },
    { id: '2', user: 'Jason Duello', text: 'Excited for today\'s session!', time: '10:03 AM' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Subscribe to live sessions from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToLiveSessions(
      (sessions) => {
        setLiveSessions(sessions);
        // If a session is currently live and none active, select it
        const currentLive = sessions.find((s) => s.status === 'live');
        if (currentLive && !activeSession) {
          setActiveSession(currentLive);
        }
      },
      (error) => {
        console.error('Failed to load live sessions:', error);
      }
    );
    return () => unsubscribe();
  }, [setLiveSessions]);

  const handleSendLiveChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setChatMessages((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        user: currentUser?.name || 'Student',
        text: chatInput.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setChatInput('');
  };

  const handleToggleHand = () => {
    setIsHandRaised((prev) => !prev);
    if (!isHandRaised) {
      try {
        confetti({
          particleCount: 40,
          spread: 45,
          origin: { y: 0.8 }
        });
      } catch {
        // ignore
      }
    }
  };

  const liveNowSessions = liveSessions.filter((s) => s.status === 'live');
  const upcomingSessions = liveSessions.filter((s) => s.status === 'scheduled');
  const pastSessions = liveSessions.filter((s) => s.status === 'completed');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <Radio className="w-4 h-4 animate-pulse" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Live Classroom & Masterclasses
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Attend live interactive lectures hosted by the administrator, participate in real-time Q&A, and raise your hand.
          </p>
        </div>

        {liveNowSessions.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            <span>{liveNowSessions.length} Session{liveNowSessions.length > 1 ? 's' : ''} Live Now</span>
          </div>
        )}
      </div>

      {/* Interactive Virtual Classroom Modal / Viewer */}
      {activeSession && (
        <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl text-white">
          
          {/* Top Bar */}
          <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-extrabold flex items-center gap-1.5 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                Live Broadcast
              </span>
              <div>
                <h3 className="text-sm font-bold truncate max-w-md">{activeSession.title}</h3>
                <span className="text-[11px] text-slate-400">Host: {activeSession.hostName} • Topic: {activeSession.topic}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activeSession.meetingUrl && (
                <a
                  href={activeSession.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in External Tab</span>
                </a>
              )}
              <button
                onClick={() => setActiveSession(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold transition cursor-pointer"
              >
                Close Room
              </button>
            </div>
          </div>

          {/* Interactive Screen & Live Chat */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
            
            {/* Screen / Presentation Stage (8 cols) */}
            <div className="lg:col-span-8 bg-slate-950 flex flex-col justify-between p-6 relative">
              
              {/* Virtual Video Screen */}
              <div className="flex-1 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 border border-slate-800 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-radial from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

                {/* Simulated Presenter Avatar */}
                <div className="w-24 h-24 rounded-full bg-indigo-600/30 border-2 border-indigo-400 flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4 ring-8 ring-indigo-500/10">
                  <Video className="w-10 h-10 text-indigo-300" />
                </div>

                <div className="space-y-1 relative z-10">
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                    Host Presenting: {activeSession.hostName}
                  </span>
                  <h4 className="text-xl font-black text-white">
                    {activeSession.title}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    {activeSession.description}
                  </p>
                </div>

                {/* Hand Raised Banner */}
                {isHandRaised && (
                  <div className="absolute top-4 left-4 bg-amber-500/90 text-slate-950 px-3 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md">
                    <Hand className="w-3.5 h-3.5" />
                    <span>Your Hand is Raised! The host will unmute you soon.</span>
                  </div>
                )}
              </div>

              {/* Media Controls Bar */}
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMicMuted((prev) => !prev)}
                    className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      isMicMuted
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    <span>{isMicMuted ? 'Muted' : 'Unmuted'}</span>
                  </button>

                  <button
                    onClick={() => setIsVideoOff((prev) => !prev)}
                    className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      isVideoOff
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                    <span>{isVideoOff ? 'Video Off' : 'Video On'}</span>
                  </button>

                  <button
                    onClick={handleToggleHand}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      isHandRaised
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <Hand className="w-4 h-4" />
                    <span>{isHandRaised ? 'Lower Hand' : 'Raise Hand'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Users className="w-4 h-4" />
                  <span>{activeSession.attendeesCount || 14} Students Connected</span>
                </div>
              </div>

            </div>

            {/* Live Chat & Q&A Stream (4 cols) */}
            <div className="lg:col-span-4 bg-slate-900 border-l border-slate-800 flex flex-col justify-between h-[460px]">
              
              <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Live Meeting Chat</span>
                </span>
                <span className="text-[10px] text-slate-500">{chatMessages.length} messages</span>
              </div>

              {/* Chat Log */}
              <div className="p-4 flex-1 overflow-y-auto space-y-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="text-xs space-y-0.5">
                    <div className="flex items-center justify-between text-slate-400 text-[10px]">
                      <span className="font-bold text-slate-200">{msg.user}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="text-slate-300 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                      {msg.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendLiveChat} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a question or chat..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

            </div>

          </div>

        </div>
      )}

      {/* Scheduled & Live Sessions List */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900">
          All Scheduled & Live Masterclasses
        </h2>

        {liveSessions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs bg-white rounded-3xl border border-slate-200">
            <Radio className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-slate-700">No scheduled sessions at this time</p>
            <p className="mt-1">The administrator will schedule upcoming masterclasses and workshop meetings here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveSessions.map((session) => {
              const isLive = session.status === 'live';
              const formattedDate = session.scheduledAt 
                ? new Date(session.scheduledAt).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'TBD';

              return (
                <div
                  key={session.id}
                  className={`bg-white rounded-3xl border shadow-xs p-6 flex flex-col justify-between transition-all ${
                    isLive
                      ? 'border-rose-300 ring-2 ring-rose-500/20 shadow-md'
                      : 'border-slate-200 hover:shadow-md'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                        isLive
                          ? 'bg-rose-100 text-rose-700'
                          : session.status === 'completed'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-indigo-50 text-indigo-700'
                      }`}>
                        {isLive && <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />}
                        <span>{isLive ? 'Live Now' : session.status}</span>
                      </span>

                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{session.durationMinutes} min</span>
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base">
                      {session.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {session.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium">{formattedDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>Host: <strong className="text-slate-800">{session.hostName}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100">
                    {isLive ? (
                      <button
                        onClick={() => setActiveSession(session)}
                        className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs animate-pulse"
                      >
                        <Radio className="w-4 h-4" />
                        <span>Join Live Classroom</span>
                      </button>
                    ) : session.status === 'completed' ? (
                      <button
                        disabled
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed Session</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveSession(session)}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Preview Meeting Room</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
