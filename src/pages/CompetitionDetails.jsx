import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Award, 
  Clock, 
  Flag, 
  CheckCircle2, 
  Share2, 
  ArrowLeft, 
  Edit, 
  Trash2, 
  FileText, 
  LogIn,
  UserCheck
} from 'lucide-react';
import { 
  getCompetitionById, 
  deleteCompetition, 
  registerForCompetition, 
  unregisterFromCompetition, 
  checkUserRegistered, 
  getCompetitionParticipants 
} from '../services/competitionService';
import { LikeButton } from '../components/interaction/LikeButton';
import { CommentSection } from '../components/interaction/CommentSection';
import { ParticipantList } from '../components/interaction/ParticipantList';
import { CategoryBadge } from '../components/common/Badge';
import { CompetitionFormModal } from '../components/forms/CompetitionFormModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function CompetitionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userProfile, isSubAdmin, isSuperAdmin } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();

  const [competition, setCompetition] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isProcessingReg, setIsProcessingReg] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const compData = await getCompetitionById(id);
      if (!compData) {
        showError("Competition not found");
        navigate('/competitions');
        return;
      }
      setCompetition(compData);

      const partData = await getCompetitionParticipants(id);
      setParticipants(partData);

      if (currentUser) {
        const registered = await checkUserRegistered(id, currentUser.uid);
        setIsRegistered(registered);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id, currentUser]);

  const handleRegisterToggle = async () => {
    if (!currentUser) {
      showInfo("Please sign in to register for this competition!");
      navigate('/login', { state: { from: { pathname: `/competitions/${id}` } } });
      return;
    }

    if (isProcessingReg) return;
    setIsProcessingReg(true);

    try {
      if (isRegistered) {
        // Unregister
        await unregisterFromCompetition(id, currentUser.uid);
        setIsRegistered(false);
        setParticipants(prev => prev.filter(p => p.userId !== currentUser.uid));
        showInfo("You have withdrawn your registration.");
      } else {
        // Register
        const reg = await registerForCompetition(competition, currentUser, userProfile);
        setIsRegistered(true);
        setParticipants(prev => [reg, ...prev]);
        showSuccess("🎉 Successfully registered for " + competition.title + "!");
      }
    } catch (err) {
      showError("Registration action failed: " + (err.message || "Unknown error"));
    } finally {
      setIsProcessingReg(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${competition.title}"?`)) return;
    try {
      await deleteCompetition(id);
      showSuccess("Competition deleted");
      navigate('/competitions');
    } catch (err) {
      showError("Failed to delete competition");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showInfo("Competition link copied to clipboard!");
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-slate-400">Loading competition...</div>;
  }

  if (!competition) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">
      
      {/* Top Header & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          to={competition.festId ? `/festivals/${competition.festId}` : "/competitions"}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{competition.festTitle ? `Back to ${competition.festTitle}` : 'Back to Competitions'}</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {isSubAdmin && (
            <>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border-slate-800 shadow-2xl">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
          <img
            src={competition.bannerImage || "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=1600&q=80"}
            alt={competition.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="p-6 sm:p-10 -mt-20 sm:-mt-28 relative z-10 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <CategoryBadge category={competition.category || "Academic"} />
              {competition.festTitle && (
                <Link
                  to={`/festivals/${competition.festId}`}
                  className="px-3 py-0.5 rounded-full text-xs font-semibold bg-indigo-950/70 text-indigo-300 border border-indigo-500/40 hover:border-indigo-400 transition-colors flex items-center gap-1"
                >
                  <Flag className="w-3 h-3 text-indigo-400" />
                  <span>{competition.festTitle}</span>
                </Link>
              )}
            </div>

            <LikeButton 
              targetId={competition.id} 
              targetType="competition" 
              initialLikes={competition.likesCount || 0} 
              size="md" 
            />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {competition.title}
          </h1>

          {competition.subtitle && (
            <p className="text-base sm:text-lg text-indigo-300 font-medium">
              {competition.subtitle}
            </p>
          )}

          {/* Prize pool banner */}
          {competition.prizePool && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-sm w-fit shadow-md">
              <Award className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Prize: {competition.prizePool}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Details, Registration Card, Rules, Participants, Comments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Description, Rules, Comments */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* About */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>About the Competition</span>
            </h2>
            <p className="text-slate-300 text-base leading-relaxed whitespace-pre-line">
              {competition.description}
            </p>
          </div>

          {/* Rules & Guidelines */}
          {competition.rules && (
            <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-4 border-slate-800">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Rules & Regulations</span>
              </h2>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {competition.rules}
              </div>
            </div>
          )}

          {/* Participant List */}
          <ParticipantList participants={participants} />

          {/* Live Comments */}
          <CommentSection competitionId={competition.id} />
        </div>

        {/* Right Column: Registration CTA & Details Sidebar */}
        <div className="flex flex-col gap-6">
          
          {/* Registration Card */}
          <div className="glass-panel rounded-2xl p-6 sm:p-7 flex flex-col gap-5 border-indigo-500/30 shadow-xl">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Event Registration
            </h3>

            {/* Quick Meta List */}
            <div className="flex flex-col gap-3 text-sm text-slate-300 py-2 border-y border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  Event Date
                </span>
                <span className="font-semibold text-white">{formatDate(competition.competitionDate)}</span>
              </div>

              {competition.registrationDeadline && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    Deadline
                  </span>
                  <span className="font-semibold text-amber-300">{formatDate(competition.registrationDeadline)}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  Venue
                </span>
                <span className="font-semibold text-white truncate max-w-[140px]">{competition.venue || "Campus Hall"}</span>
              </div>
            </div>

            {/* Register CTA Button */}
            {currentUser ? (
              <button
                onClick={handleRegisterToggle}
                disabled={isProcessingReg}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 ${
                  isRegistered
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                }`}
              >
                {isProcessingReg ? (
                  <span>Processing...</span>
                ) : isRegistered ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Enrolled (Click to Withdraw)</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Register with 1-Click</span>
                  </>
                )}
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  state={{ from: { pathname: `/competitions/${id}` } }}
                  className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm text-center shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Register</span>
                </Link>
                <p className="text-center text-xs text-slate-500">
                  New student? <Link to="/signup" className="text-indigo-400 underline">Sign up free</Link>
                </p>
              </div>
            )}

            <p className="text-xs text-slate-500 text-center">
              {participants.length} students have already registered for this competition.
            </p>
          </div>

        </div>

      </div>

      {/* Edit Competition Modal */}
      <CompetitionFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={competition}
        onSuccess={loadData}
      />
    </div>
  );
}
