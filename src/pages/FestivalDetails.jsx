import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Sparkles, 
  Trophy, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  Images, 
  Share2,
  Users
} from 'lucide-react';
import { getFestById, deleteFest } from '../services/festService';
import { getCompetitionsByFestId } from '../services/competitionService';
import { ImageCarousel } from '../components/common/ImageCarousel';
import { CompetitionCard } from '../components/cards/CompetitionCard';
import { LikeButton } from '../components/interaction/LikeButton';
import { CategoryBadge } from '../components/common/Badge';
import { FestivalFormModal } from '../components/forms/FestivalFormModal';
import { CompetitionFormModal } from '../components/forms/CompetitionFormModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function FestivalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isSubAdmin, isSuperAdmin } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();

  const [fest, setFest] = useState(null);
  const [competitions, setCompetitions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddCompModalOpen, setIsAddCompModalOpen] = useState(false);

  const loadFestData = async () => {
    setIsLoading(true);
    try {
      const festData = await getFestById(id);
      if (!festData) {
        showError("Festival not found");
        navigate('/festivals');
        return;
      }
      setFest(festData);
      const compData = await getCompetitionsByFestId(id);
      setCompetitions(compData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFestData();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${fest.title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteFest(fest.id);
      showSuccess("Festival removed");
      navigate('/festivals');
    } catch (err) {
      showError("Failed to delete festival");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showInfo("Festival link copied to clipboard!");
  };

  const formatDateRange = (start, end) => {
    try {
      const s = new Date(start).toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
      const e = new Date(end).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
      return `${s} – ${e}`;
    } catch (e) {
      return `${start} to ${end}`;
    }
  };

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-slate-400">Loading festival details...</div>;
  }

  if (!fest) return null;

  const galleryList = [
    ...(fest.bannerImage ? [fest.bannerImage] : []),
    ...(fest.galleryImages || [])
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">
      
      {/* Back Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/festivals"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Festivals</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Share Fest Link"
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
                <span>Edit Fest</span>
              </button>
              <button
                onClick={handleDelete}
                className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 transition-colors"
                title="Delete Fest"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border-slate-800 shadow-2xl">
        <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-slate-900">
          <img
            src={fest.bannerImage || "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1600&q=80"}
            alt={fest.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="p-6 sm:p-10 -mt-24 sm:-mt-32 relative z-10 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CategoryBadge category={fest.category || "College Fest"} />
            <LikeButton targetId={fest.id} targetType="fest" initialLikes={fest.likesCount || 0} size="md" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {fest.title}
          </h1>

          {fest.subtitle && (
            <p className="text-lg sm:text-xl text-indigo-300 font-medium">
              {fest.subtitle}
            </p>
          )}

          {/* Quick Meta */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-slate-300 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold">{formatDateRange(fest.startDate, fest.endDate)}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>{fest.venue || "College Campus"}</span>
            </div>

            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{competitions.length} Competitions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Description & Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Col 1 & 2: Description & Photo Gallery */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* About Section */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>About the Festival</span>
            </h2>
            <p className="text-slate-300 text-base leading-relaxed whitespace-pre-line">
              {fest.description}
            </p>
          </div>

          {/* Photo Gallery Carousel */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Images className="w-5 h-5 text-indigo-400" />
                <span>Festival Photo Gallery</span>
              </h2>
              <span className="text-xs text-slate-400 font-semibold">
                {galleryList.length} Photos
              </span>
            </div>

            <ImageCarousel
              images={galleryList}
              altTitle={fest.title}
              aspectRatio="aspect-[16/9]"
            />
          </div>
        </div>

        {/* Col 3: Side Card (Organizer info & Quick actions) */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-5">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Festival Directorate
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Managed by <span className="text-indigo-300 font-semibold">{fest.createdByName || "Student Cultural Council"}</span>.
            </p>
            
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 space-y-2">
              <p>• All college departments are eligible.</p>
              <p>• Single-click registration for students.</p>
              <p>• Certificates awarded to all participants.</p>
            </div>

            {isSubAdmin && (
              <button
                onClick={() => setIsAddCompModalOpen(true)}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Competition to Fest</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Linked Competitions Section */}
      <section className="flex flex-col gap-6 pt-6 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Competitions inside {fest.title}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Participate individually or in teams to win cash prizes and recognition.
            </p>
          </div>

          {isSubAdmin && (
            <button
              onClick={() => setIsAddCompModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md self-start sm:self-center"
            >
              <Plus className="w-4 h-4" />
              <span>Add Competition</span>
            </button>
          )}
        </div>

        {competitions.length === 0 ? (
          <div className="py-16 text-center glass-panel rounded-2xl flex flex-col items-center justify-center">
            <Trophy className="w-12 h-12 text-slate-600 mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Competitions Added Yet</h3>
            <p className="text-sm text-slate-400">
              The organizing committee will publish events for this festival soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitions.map((comp) => (
              <CompetitionCard key={comp.id} competition={comp} />
            ))}
          </div>
        )}
      </section>

      {/* Edit Festival Modal */}
      <FestivalFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={fest}
        onSuccess={loadFestData}
      />

      {/* Add Competition Modal */}
      <CompetitionFormModal
        isOpen={isAddCompModalOpen}
        onClose={() => setIsAddCompModalOpen(false)}
        defaultFestId={fest.id}
        onSuccess={loadFestData}
      />
    </div>
  );
}
