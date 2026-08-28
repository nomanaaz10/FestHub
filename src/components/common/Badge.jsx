import React from 'react';
import { CheckCircle2, ShieldCheck, Sparkles, Clock, MapPin } from 'lucide-react';

export function VerifiedBadge({ isVerified, size = "sm", showText = false }) {
  if (!isVerified) return null;

  return (
    <span 
      className="inline-flex items-center gap-1 text-emerald-400 font-semibold"
      title="Verified Account"
    >
      <CheckCircle2 className={`${size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} fill-emerald-500/20`} />
      {showText && <span className="text-xs">Verified</span>}
    </span>
  );
}

export function RoleBadge({ role }) {
  if (role === 'superadmin') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
        <Sparkles className="w-3 h-3" />
        Super Admin
      </span>
    );
  }
  if (role === 'subadmin') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
        <ShieldCheck className="w-3 h-3" />
        Organizer
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
      Student
    </span>
  );
}

export function CategoryBadge({ category }) {
  const colorMap = {
    'Academic': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'Cultural & Arts': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'Fine Arts': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    'Literary': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    'Music': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'Photography': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    'Film & Media': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  };

  const badgeClass = colorMap[category] || 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm ${badgeClass}`}>
      {category}
    </span>
  );
}
