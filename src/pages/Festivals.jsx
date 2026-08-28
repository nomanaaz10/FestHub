import React, { useState, useEffect } from 'react';
import { Search, Plus, Sparkles, Filter, Calendar } from 'lucide-react';
import { getAllFests } from '../services/festService';
import { getAllCompetitions } from '../services/competitionService';
import { FestivalCard } from '../components/cards/FestivalCard';
import { FestivalFormModal } from '../components/forms/FestivalFormModal';
import { useAuth } from '../context/AuthContext';

export function Festivals() {
  const { isSubAdmin } = useAuth();
  const [fests, setFests] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fData, cData] = await Promise.all([
        getAllFests(),
        getAllCompetitions()
      ]);
      setFests(fData);
      setCompetitions(cData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const categories = ['All', 'National & Cultural', 'Cultural & Arts', 'Technical & Coding', 'Sports & Athletics'];

  const filteredFests = fests.filter((fest) => {
    const matchesSearch = 
      fest.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fest.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fest.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || fest.category === selectedCategory;

    const now = new Date().toISOString().split('T')[0];
    let matchesTime = true;
    if (selectedTimeFilter === 'Upcoming') {
      matchesTime = fest.endDate >= now;
    } else if (selectedTimeFilter === 'Past') {
      matchesTime = fest.endDate < now;
    }

    return matchesSearch && matchesCategory && matchesTime;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Campus Extravaganza</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Annual College Festivals
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse full festival schedules, flagship themes, linked competitions, and photo archives.
          </p>
        </div>

        {isSubAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Fest</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search festivals by name or theme..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
          />
        </div>

        {/* Categories Pill list */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/25'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Festivals Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400">Loading college festivals...</div>
      ) : filteredFests.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center justify-center glass-panel rounded-2xl">
          <Sparkles className="w-12 h-12 text-slate-600 mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Festivals Found</h3>
          <p className="text-sm text-slate-400">Try changing your search query or category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredFests.map((fest) => {
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
      )}

      {/* Creation Modal */}
      <FestivalFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
