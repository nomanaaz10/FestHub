import React from 'react';
import { Users, UserCheck } from 'lucide-react';
import { VerifiedBadge } from '../common/Badge';

export function ParticipantList({ participants = [], maxDisplay = 20 }) {
  const displayList = participants.slice(0, maxDisplay);

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <Users className="w-5 h-5 text-indigo-400" />
          <h3 className="text-xl font-bold text-white tracking-tight">Registered Participants</h3>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5" />
          {participants.length} {participants.length === 1 ? 'Participant' : 'Participants'}
        </span>
      </div>

      {participants.length === 0 ? (
        <div className="py-10 text-center flex flex-col items-center justify-center text-slate-500">
          <Users className="w-10 h-10 mb-2 opacity-30" />
          <p className="text-sm font-medium">No registrations yet.</p>
          <p className="text-xs text-slate-600 mt-1">Be the first student to enroll in this competition!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {displayList.map((participant, idx) => (
            <div
              key={participant.id || idx}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/60 transition-all"
            >
              <img
                src={participant.userPhoto || `https://api.dicebear.com/7.x/bottts/svg?seed=${participant.userName || idx}`}
                alt={participant.userName}
                className="w-9 h-9 rounded-full bg-slate-800 shrink-0 border border-slate-700 object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-slate-200 truncate">
                    {participant.userName}
                  </span>
                  <VerifiedBadge isVerified={participant.emailVerified} />
                </div>
                <p className="text-xs text-slate-500 truncate">
                  {participant.userEmail || "Student"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {participants.length > maxDisplay && (
        <p className="text-center text-xs text-slate-500 pt-2">
          + {participants.length - maxDisplay} more registered students
        </p>
      )}
    </div>
  );
}
