import React, { useState, useEffect } from 'react';
import { Search, Trophy, Plus, Filter, Calendar } from 'lucide-react';
import { getAllCompetitions } from '../services/competitionService';
import { getAllFests } from '../services/festService';
import { CompetitionCard } from '../components/cards/CompetitionCard';
import { CompetitionFormModal } from '../components/forms/CompetitionFormModal';
import { useAuth } from '../context/AuthContext';

export function Competitions() {
  const { isSubAdmin } = useAuth();
  const [competitions, setCompetitions] = useState([]);
  const [fests, setFests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFest, setSelectedFest] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [cData, fData] = await Promise.all([
        getAllCompetitions(),
        getAllFests()
      ]);
      setCompetitions(cData);
      setFests(fData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const categories = ['All', 'Academic', 'Fine Arts', 'Music', 'Literary', 'Photography', 'Film & Media'];

  const filteredCompetitions = competitions.filter((comp) => {
    const matchesSearch = 
      comp.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || comp.category === selectedCategory;
    const matchesFest = selectedFest === 'All' || comp.festId === selectedFest;

    return matchesSearch && matchesCategory && matchesFest;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>Campus Leaderboards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            All Competitions
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Discover challenges, register with a single click, connect with teammates, and win prizes.
          </p>
        </div>

        {isSubAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Create Competition</span>
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search competitions..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
          />
        </div>

        {/* Filters Dropdowns & Pills */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Fest filter dropdown */}
          <select
            value={selectedFest}
            onChange={(e) => setSelectedFest(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-200 outline-none focus:border-indigo-500"
          >
            <option value="All">All Festivals</option>
            {fests.map(f => (
              <option key={f.id} value={f.id}>{f.title}</option>
            ))}
          </select>

          {/* Category pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
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
      </div>

      {/* Competitions Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400">Loading competitions...</div>
      ) : filteredCompetitions.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center justify-center glass-panel rounded-2xl">
          <Trophy className="w-12 h-12 text-slate-600 mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Competitions Found</h3>
          <p className="text-sm text-slate-400">Try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompetitions.map((comp) => (
            <CompetitionCard key={comp.id} competition={comp} />
          ))}
        </div>
      )}

      {/* Creation Modal */}
      <CompetitionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
