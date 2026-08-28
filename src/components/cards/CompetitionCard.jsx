import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Award, Clock, ArrowRight, Flag } from 'lucide-react';
import { LikeButton } from '../interaction/LikeButton';
import { CategoryBadge } from '../common/Badge';

export function CompetitionCard({ competition }) {
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
      {/* Banner Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        <img
          src={competition.bannerImage || "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=1000&q=80"}
          alt={competition.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=1000&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <CategoryBadge category={competition.category || "General"} />
          <div onClick={(e) => e.stopPropagation()}>
            <LikeButton targetId={competition.id} targetType="competition" initialLikes={competition.likesCount || 0} size="sm" />
          </div>
        </div>

        {/* Parent Fest Tag */}
        {competition.festTitle && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/10 text-xs font-medium text-slate-300 flex items-center gap-1.5 truncate max-w-[85%]">
            <Flag className="w-3 h-3 text-indigo-400 shrink-0" />
            <span className="truncate">{competition.festTitle}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium mb-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Event Date: {formatDate(competition.competitionDate)}</span>
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
            {competition.title}
          </h3>

          <p className="text-xs text-slate-400 font-medium mt-1 mb-2 line-clamp-1">
            {competition.subtitle}
          </p>

          <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed mb-3">
            {competition.description}
          </p>

          {/* Prize pool indicator */}
          {competition.prizePool && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-300 mb-3 w-fit">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{competition.prizePool}</span>
            </div>
          )}
        </div>

        {/* Footer Meta */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate max-w-[60%]">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{competition.venue || "Campus Venue"}</span>
          </div>

          <Link
            to={`/competitions/${competition.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors"
          >
            <span>View & Register</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
