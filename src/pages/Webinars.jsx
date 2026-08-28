import React, { useState, useEffect } from 'react';
import { Video, Plus, Search, Calendar, User } from 'lucide-react';
import { getAllWebinars } from '../services/webinarService';
import { WebinarCard } from '../components/cards/WebinarCard';
import { WebinarFormModal } from '../components/forms/WebinarFormModal';
import { useAuth } from '../context/AuthContext';

export function Webinars() {
  const { isSubAdmin } = useAuth();
  const [webinars, setWebinars] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getAllWebinars();
      setWebinars(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = webinars.filter((web) => {
    return (
      web.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      web.speaker?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      web.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Video className="w-4 h-4" />
            <span>Distinguished Speaker Series</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Webinars & Guest Lectures
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Attend live interactive masterclasses, industry insights, and career sessions with tech leaders.
          </p>
        </div>

        {isSubAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Webinar</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative w-full sm:w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by topic or speaker..."
          className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
        />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400">Loading scheduled webinars...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center justify-center glass-panel rounded-2xl">
          <Video className="w-12 h-12 text-slate-600 mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Webinars Found</h3>
          <p className="text-sm text-slate-400">Try changing your search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filtered.map((web) => (
            <WebinarCard key={web.id} webinar={web} />
          ))}
        </div>
      )}

      {/* Modal */}
      <WebinarFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
