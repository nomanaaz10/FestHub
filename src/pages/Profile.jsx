import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Calendar, 
  Trophy, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowRight, 
  Sparkles,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getUserRegistrations } from '../services/userService';
import { unregisterFromCompetition } from '../services/competitionService';
import { VerifiedBadge, RoleBadge } from '../components/common/Badge';

export function Profile() {
  const { currentUser, userProfile, isSuperAdmin, isSubAdmin } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadRegistrations = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const list = await getUserRegistrations(currentUser.uid);
      setRegistrations(list);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, [currentUser]);

  const handleWithdraw = async (competitionId, title) => {
    if (!window.confirm(`Withdraw registration from "${title}"?`)) return;
    try {
      await unregisterFromCompetition(competitionId, currentUser.uid);
      setRegistrations(prev => prev.filter(r => r.competitionId !== competitionId));
      showSuccess("Withdrawn from " + title);
    } catch (err) {
      showError("Failed to withdraw");
    }
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">
      
      {/* Header Profile Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 border-indigo-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <img
          src={userProfile?.photoURL || currentUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.uid}`}
          alt={userProfile?.displayName || "User"}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover bg-slate-900 border-2 border-indigo-500/40 shrink-0 shadow-lg"
        />

        <div className="flex-1 text-center sm:text-left flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {userProfile?.displayName || currentUser.email?.split('@')[0]}
            </h1>
            <VerifiedBadge isVerified={userProfile?.emailVerified || currentUser.emailVerified} size="md" showText={true} />
            <RoleBadge role={userProfile?.role || 'student'} />
          </div>

          <p className="text-sm text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
            <Mail className="w-4 h-4 text-slate-500" />
            <span>{currentUser.email}</span>
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Member since: {formatDate(currentUser.metadata?.creationTime || userProfile?.createdAt || new Date())}
          </p>

          {isSuperAdmin && (
            <div className="pt-2">
              <Link
                to="/super-admin"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/50 text-rose-200 text-xs font-bold transition-all shadow-md"
              >
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Open Super Admin Control Center (/super-admin)</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Registered Competitions Section */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-2xl font-bold text-white tracking-tight">
              My Enrolled Competitions
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {registrations.length} {registrations.length === 1 ? 'Event' : 'Events'}
          </span>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-slate-400">Loading your registrations...</div>
        ) : registrations.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center glass-panel rounded-2xl">
            <Trophy className="w-12 h-12 text-slate-600 mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Active Registrations</h3>
            <p className="text-sm text-slate-400 mb-6 max-w-sm">
              You haven't enrolled in any competitions yet. Explore open competitions and register with one click!
            </p>
            <Link
              to="/competitions"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
            >
              Browse Competitions
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {registrations.map((reg) => (
              <div
                key={reg.id || reg.competitionId}
                className="glass-panel p-5 rounded-2xl flex flex-col justify-between border-slate-800 hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Enrolled
                    </span>
                    <span className="text-xs text-slate-500">
                      {formatDate(reg.registeredAt)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white line-clamp-1 mb-1">
                    {reg.competitionTitle || "Competition"}
                  </h3>

                  {reg.festTitle && (
                    <p className="text-xs text-indigo-400 font-medium line-clamp-1 mb-3">
                      Part of {reg.festTitle}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => handleWithdraw(reg.competitionId, reg.competitionTitle)}
                    className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Withdraw</span>
                  </button>

                  <Link
                    to={`/competitions/${reg.competitionId}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
