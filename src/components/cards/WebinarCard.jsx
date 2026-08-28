import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Video, ArrowRight, UserCheck } from 'lucide-react';

export function WebinarCard({ webinar }) {
  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="glass-panel-hover rounded-2xl overflow-hidden flex flex-col group h-full">
      {/* Banner */}
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
        <img
          src={webinar.bannerImage || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=80"}
          alt={webinar.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-600/80 text-white backdrop-blur-md border border-indigo-400/30 flex items-center gap-1.5 shadow-md">
            <Video className="w-3.5 h-3.5" />
            Guest Lecture & Webinar
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Speaker preview */}
          {webinar.speaker && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800/90 mb-4">
              <img
                src={webinar.speakerPhoto || `https://api.dicebear.com/7.x/bottts/svg?seed=${webinar.speaker}`}
                alt={webinar.speaker}
                className="w-10 h-10 rounded-full object-cover border border-indigo-500/40 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-white truncate">{webinar.speaker}</h4>
                <p className="text-xs text-slate-400 truncate">{webinar.speakerDesignation || "Distinguished Guest"}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 text-xs text-indigo-400 font-medium mb-1.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(webinar.date)}
            </span>
            {webinar.time && (
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                {webinar.time}
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1 mb-1">
            {webinar.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-1 mb-2">
            {webinar.subtitle}
          </p>

          <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
            {webinar.description}
          </p>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate max-w-[60%]">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{webinar.venue || "Virtual Stage"}</span>
          </div>

          <Link
            to={`/webinars/${webinar.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
