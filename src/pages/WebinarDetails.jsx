import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  ExternalLink, 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Share2, 
  UserCheck 
} from 'lucide-react';
import { getWebinarById, deleteWebinar } from '../services/webinarService';
import { WebinarFormModal } from '../components/forms/WebinarFormModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function WebinarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isSubAdmin, isSuperAdmin } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();

  const [webinar, setWebinar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadWebinar = async () => {
    setIsLoading(true);
    try {
      const data = await getWebinarById(id);
      if (!data) {
        showError("Webinar not found");
        navigate('/webinars');
        return;
      }
      setWebinar(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWebinar();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Delete webinar "${webinar.title}"?`)) return;
    try {
      await deleteWebinar(id);
      showSuccess("Webinar deleted");
      navigate('/webinars');
    } catch (err) {
      showError("Failed to delete webinar");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showInfo("Webinar link copied!");
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-slate-400">Loading webinar details...</div>;
  }

  if (!webinar) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/webinars"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Webinars</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {isSubAdmin && (
            <>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40"
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
            src={webinar.bannerImage || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1600&q=80"}
            alt={webinar.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        <div className="p-6 sm:p-10 -mt-20 sm:-mt-28 relative z-10 flex flex-col gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-600/80 text-white backdrop-blur-md border border-indigo-400/30 w-fit flex items-center gap-1.5 shadow-md">
            <Video className="w-3.5 h-3.5" />
            Distinguished Guest Lecture
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {webinar.title}
          </h1>

          {webinar.subtitle && (
            <p className="text-lg text-indigo-300 font-medium">
              {webinar.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Grid: Speaker Profile, Agenda, and Session Join Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main 2 Cols */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Speaker Bio */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-5">
            <img
              src={webinar.speakerPhoto || `https://api.dicebear.com/7.x/bottts/svg?seed=${webinar.speaker}`}
              alt={webinar.speaker}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-indigo-500/40 shrink-0 shadow-lg"
            />
            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Featured Guest Speaker
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5 mb-1">
                {webinar.speaker}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                {webinar.speakerDesignation || "Guest Lecturer"}
              </p>
            </div>
          </div>

          {/* Description & Agenda */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Session Overview & Agenda
            </h2>
            <p className="text-slate-300 text-base leading-relaxed whitespace-pre-line">
              {webinar.description}
            </p>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-5 border-indigo-500/30 shadow-xl">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Schedule & Access
            </h3>

            <div className="flex flex-col gap-3 text-sm text-slate-300 py-2 border-y border-slate-800">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-500 block">Date</span>
                  <span className="font-semibold text-white">{formatDate(webinar.date)}</span>
                </div>
              </div>

              {webinar.time && (
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-500 block">Time</span>
                    <span className="font-semibold text-white">{webinar.time}</span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-500 block">Location</span>
                  <span className="font-semibold text-white">{webinar.venue || "Virtual Stage"}</span>
                </div>
              </div>
            </div>

            {webinar.meetingLink ? (
              <a
                href={webinar.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm text-center shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Video className="w-4 h-4" />
                <span>Join Live Session</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center text-xs text-slate-400">
                Meeting link will be activated 30 mins before the scheduled start.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Edit Modal */}
      <WebinarFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={webinar}
        onSuccess={loadWebinar}
      />
    </div>
  );
}
