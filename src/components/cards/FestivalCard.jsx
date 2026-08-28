import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Sparkles, ArrowRight, Trophy } from 'lucide-react';
import { LikeButton } from '../interaction/LikeButton';
import { CategoryBadge } from '../common/Badge';

export function FestivalCard({ fest, competitionsCount = 0 }) {
  const formatDateRange = (start, end) => {
    try {
      const s = new Date(start).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const e = new Date(end).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      return `${s} – ${e}`;
    } catch (e) {
      return `${start} to ${end}`;
    }
  };

  return (
    <div className="glass-panel-hover rounded-2xl overflow-hidden flex flex-col group h-full">
      {/* Banner */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        <img
          src={fest.bannerImage || "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1200&q=80"}
          alt={fest.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1200&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {fest.category ? (
            <CategoryBadge category={fest.category} />
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 backdrop-blur-md border border-indigo-500/40">
              College Fest
            </span>
          )}
          <div onClick={(e) => e.stopPropagation()}>
            <LikeButton targetId={fest.id} targetType="fest" initialLikes={fest.likesCount || 0} size="sm" />
          </div>
        </div>

        {/* Competitions Counter Tag */}
        {competitionsCount > 0 && (
          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-white/10 text-xs font-semibold text-amber-300 flex items-center gap-1.5 shadow-md">
            <Trophy className="w-3.5 h-3.5" />
            <span>{competitionsCount} Competitions</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDateRange(fest.startDate, fest.endDate)}</span>
          </div>

          <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
            {fest.title}
          </h3>

          <p className="text-xs text-slate-400 font-medium mt-1 mb-3 line-clamp-1">
            {fest.subtitle}
          </p>

          <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
            {fest.description}
          </p>
        </div>

        {/* Bottom meta & CTA */}
        <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 max-w-[60%] truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{fest.venue || "College Campus"}</span>
          </div>

          <Link
            to={`/festivals/${fest.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors"
          >
            <span>Explore Fest</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
