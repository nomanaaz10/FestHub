import React, { useState, useEffect } from 'react';
import { Bell, Plus, Search, AlertTriangle, Filter } from 'lucide-react';
import { getAllAnnouncements } from '../services/announcementService';
import { AnnouncementCard } from '../components/cards/AnnouncementCard';
import { AnnouncementFormModal } from '../components/forms/AnnouncementFormModal';
import { useAuth } from '../context/AuthContext';

export function Announcements() {
  const { isSubAdmin } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlyImportant, setOnlyImportant] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getAllAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const categories = ['All', 'Academics', 'Events', 'Campus Notice', 'Volunteering'];

  const filtered = announcements.filter((ann) => {
    const matchesSearch = 
      ann.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCategory === 'All' || ann.category === selectedCategory;
    const matchesImp = !onlyImportant || Boolean(ann.important);

    return matchesSearch && matchesCat && matchesImp;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4" />
            <span>Official Circulars</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Announcements & Notices
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Stay informed with real-time schedule updates, fest notices, exam circulars, and volunteer calls.
          </p>
        </div>

        {isSubAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Post Notice</span>
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search circulars..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
          />
        </div>

        {/* Categories & Urgent Toggle */}
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setOnlyImportant(!onlyImportant)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
              onlyImportant
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Urgent Only</span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements Feed */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400">Loading notices...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center justify-center glass-panel rounded-2xl">
          <Bell className="w-12 h-12 text-slate-600 mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Announcements Found</h3>
          <p className="text-sm text-slate-400">There are no circulars matching your active filter criteria.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {filtered.map((ann) => (
            <AnnouncementCard key={ann.id} announcement={ann} />
          ))}
        </div>
      )}

      {/* Modal */}
      <AnnouncementFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
