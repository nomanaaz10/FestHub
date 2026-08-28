import React, { useState } from 'react';
import { Bell, AlertTriangle, Calendar, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';

export function AnnouncementCard({ announcement }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className={`glass-panel-hover rounded-2xl overflow-hidden flex flex-col transition-all ${
      announcement.important
        ? 'border-amber-500/40 bg-slate-900/90 shadow-lg shadow-amber-500/5'
        : 'border-slate-800'
    }`}>
      {/* Top Banner Bar if Important */}
      {announcement.important && (
        <div className="bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/20 border-b border-amber-500/30 px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>High Priority Notice</span>
          </div>
          <span className="text-[10px] font-semibold tracking-wide uppercase text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded">
            Official
          </span>
        </div>
      )}

      <div className="p-6 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>Posted: {formatDate(announcement.date || announcement.createdAt)}</span>
            </div>
            {announcement.category && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                {announcement.category}
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-white mb-2 leading-snug">
            {announcement.title}
          </h3>

          {announcement.imageUrl && (
            <div className="my-3 rounded-xl overflow-hidden max-h-48 w-full bg-slate-900 border border-slate-800">
              <img
                src={announcement.imageUrl}
                alt={announcement.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          <p className={`text-sm text-slate-300 leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
            {announcement.description}
          </p>
        </div>

        {announcement.description && announcement.description.length > 180 && (
          <div className="pt-4 mt-2 border-t border-slate-800/60 flex justify-end">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <span>{isExpanded ? 'Show Less' : 'Read Full Notice'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
