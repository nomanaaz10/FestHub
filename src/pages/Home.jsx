import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Flame, 
  Trophy, 
  Bell, 
  Video, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Calendar, 
  Award,
  Plus,
  Compass
} from 'lucide-react';
import { getAllFests } from '../services/festService';
import { getAllCompetitions } from '../services/competitionService';
import { getAllAnnouncements } from '../services/announcementService';
import { getAllWebinars } from '../services/webinarService';
import { FestivalCard } from '../components/cards/FestivalCard';
import { CompetitionCard } from '../components/cards/CompetitionCard';
import { AnnouncementCard } from '../components/cards/AnnouncementCard';
import { WebinarCard } from '../components/cards/WebinarCard';
import { FestivalFormModal } from '../components/forms/FestivalFormModal';
import { useAuth } from '../context/AuthContext';

export function Home() {
  const { isSubAdmin } = useAuth();
  const [fests, setFests] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [webinars, setWebinars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFestModalOpen, setIsFestModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fData, cData, aData, wData] = await Promise.all([
        getAllFests(),
        getAllCompetitions(),
        getAllAnnouncements(),
        getAllWebinars()
      ]);
      setFests(fData);
      setCompetitions(cData);
      setAnnouncements(aData);
      setWebinars(wData);
    } catch (err) {
      console.error("Error loading home data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const importantNotices = announcements.filter(a => a.important);

  return (
    <div className="flex flex-col gap-16 sm:gap-24 pb-12">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 sm:pt-16 pb-12 overflow-hidden">
        {/* Glow ambient background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-rose-600/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center flex flex-col items-center px-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-semibold mb-6 animate-fade-in shadow-inner">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>The Official College Fest & Events Network</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
            Discover. Participate. <br className="hidden sm:inline" />
            <span className="gradient-text">Celebrate Campus Life.</span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl leading-relaxed mb-8 sm:mb-10">
            One central platform for all college festivals, competitive events, guest webinars, and official circulars. Register with one click and join the leaderboards.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              to="/festivals"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-5 h-5" />
              <span>Explore Festivals</span>
            </Link>

            <Link
              to="/competitions"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white font-semibold text-base transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Live Competitions</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 w-full mt-14 pt-10 border-t border-slate-800/80">
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">2+</span>
              <span className="text-xs text-slate-400 font-medium mt-0.5">Grand Annual Fests</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-indigo-400">12+</span>
              <span className="text-xs text-slate-400 font-medium mt-0.5">Competitions</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">₹1,50,000+</span>
              <span className="text-xs text-slate-400 font-medium mt-0.5">Prize Pools</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">2,500+</span>
              <span className="text-xs text-slate-400 font-medium mt-0.5">Active Students</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. IMPORTANT NOTICES MARQUEE / HIGHLIGHT */}
      {importantNotices.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="glass-panel border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-950/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Priority Announcement
                </span>
                <p className="text-sm font-semibold text-slate-200 line-clamp-1">
                  {importantNotices[0].title}
                </p>
              </div>
            </div>
            <Link
              to="/announcements"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-white shrink-0 self-end sm:self-center"
            >
              <span>View All Notices ({announcements.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      )}

      {/* 3. FEATURED FESTIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4" />
              <span>Campus Celebrations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Annual College Festivals
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {isSubAdmin && (
              <button
                onClick={() => setIsFestModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Fest</span>
              </button>
            )}
            <Link
              to="/festivals"
              className="inline-flex items-center gap-1 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <span>View All Fests</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {fests.slice(0, 2).map((fest) => {
            const festComps = competitions.filter(c => c.festId === fest.id);
            return (
              <FestivalCard
                key={fest.id}
                fest={fest}
                competitionsCount={festComps.length}
              />
            );
          })}
        </div>
      </section>

      {/* 4. LIVE & UPCOMING COMPETITIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Trophy className="w-4 h-4" />
              <span>Compete & Win</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Live Competitions & Challenges
            </h2>
          </div>

          <Link
            to="/competitions"
            className="inline-flex items-center gap-1 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>Browse All ({competitions.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitions.slice(0, 3).map((comp) => (
            <CompetitionCard key={comp.id} competition={comp} />
          ))}
        </div>
      </section>

      {/* 5. WEBINARS & GUEST LECTURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Video className="w-4 h-4" />
              <span>Knowledge Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Webinars & Distinguished Guest Lectures
            </h2>
          </div>

          <Link
            to="/webinars"
            className="inline-flex items-center gap-1 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>View All Webinars</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {webinars.slice(0, 2).map((webinar) => (
            <WebinarCard key={webinar.id} webinar={webinar} />
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-3xl overflow-hidden glass-panel p-8 sm:p-12 border-indigo-500/30 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/30">
            <Sparkles className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Showcase Your Talent?
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
            Create your student account in under 30 seconds with Google Sign-In or your college email to enroll in all live competitions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              Sign Up Now
            </Link>
            <Link
              to="/festivals"
              className="px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-base transition-all"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </section>

      {/* Festival Creation Modal */}
      <FestivalFormModal
        isOpen={isFestModalOpen}
        onClose={() => setIsFestModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
