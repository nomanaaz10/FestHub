import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Trophy, 
  Sparkles, 
  Users, 
  Plus, 
  Trash2, 
  Pencil,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getAllFests, deleteFest } from '../services/festService';
import { getAllCompetitions, deleteCompetition } from '../services/competitionService';
import { getAllRegistrations } from '../services/userService';
import { FestivalFormModal } from '../components/forms/FestivalFormModal';
import { CompetitionFormModal } from '../components/forms/CompetitionFormModal';

export function AdminDashboard() {
  const { isSubAdmin, isSuperAdmin } = useAuth();
  const { showError, showSuccess } = useToast();

  const [activeTab, setActiveTab] = useState('enrollments');
  const [fests, setFests] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isFestModalOpen, setIsFestModalOpen] = useState(false);
  const [editingFest, setEditingFest] = useState(null);

  const [isCompModalOpen, setIsCompModalOpen] = useState(false);
  const [editingComp, setEditingComp] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fData, cData, rData] = await Promise.all([
        getAllFests(),
        getAllCompetitions(),
        getAllRegistrations()
      ]);
      setFests(fData);
      setCompetitions(cData);
      setRegistrations(rData);
    } catch (error) {
      console.error(error);
      showError("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  // If they are neither a sub-admin nor a super-admin, deny access.
  if (!isSubAdmin && !isSuperAdmin) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-slate-400">You must be an organizer to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border-indigo-500/30 bg-indigo-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400 shrink-0 shadow-lg">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase">
                Route: /admin
              </span>
              <span className="text-xs text-slate-400 font-semibold">Organizer Access</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Admin Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Manage festivals, competitions, and view enrolled students.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('enrollments')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'enrollments'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Enrolled Students ({registrations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('fests')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'fests'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Fests ({fests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('competitions')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'competitions'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Competitions ({competitions.length})</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-400">Loading dashboard...</div>
      ) : (
        <>
          {/* TAB 1: ENROLLMENTS */}
          {activeTab === 'enrollments' && (
            <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
              <h2 className="text-lg font-bold text-white tracking-tight pb-3 border-b border-slate-800">
                All Student Enrollments
              </h2>
              {registrations.length === 0 ? (
                <div className="text-center py-10 text-slate-400">No students enrolled yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700 text-xs font-semibold text-slate-400 uppercase">
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Competition</th>
                        <th className="py-3 px-4">Registered On</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-slate-300">
                      {registrations.map(reg => (
                        <tr key={reg.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4 font-medium text-white">{reg.userName}</td>
                          <td className="py-3 px-4">{reg.userEmail}</td>
                          <td className="py-3 px-4 text-indigo-300">{reg.competitionTitle}</td>
                          <td className="py-3 px-4">{formatDate(reg.registeredAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FESTS */}
          {activeTab === 'fests' && (
            <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h2 className="text-lg font-bold text-white tracking-tight">Manage Festivals</h2>
                <button
                  onClick={() => {
                    setEditingFest(null);
                    setIsFestModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Fest</span>
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {fests.map(f => (
                  <div key={f.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800 gap-4">
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-white truncate">{f.title}</h3>
                      <p className="text-xs text-slate-400">{f.startDate} to {f.endDate} | {f.venue}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingFest(f);
                          setIsFestModalOpen(true);
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-950/30"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm(`Delete ${f.title}?`)) {
                            await deleteFest(f.id);
                            showSuccess("Festival deleted");
                            loadData();
                          }
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: COMPETITIONS */}
          {activeTab === 'competitions' && (
            <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h2 className="text-lg font-bold text-white tracking-tight">Manage Competitions</h2>
                <button
                  onClick={() => {
                    setEditingComp(null);
                    setIsCompModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Competition</span>
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {competitions.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800 gap-4">
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-white truncate">{c.title}</h3>
                      <p className="text-xs text-slate-400">Date: {c.competitionDate} | Fest: {fests.find(f => f.id === c.festId)?.title || "N/A"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingComp(c);
                          setIsCompModalOpen(true);
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-950/30"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm(`Delete ${c.title}?`)) {
                            await deleteCompetition(c.id);
                            showSuccess("Competition deleted");
                            loadData();
                          }
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <FestivalFormModal
        isOpen={isFestModalOpen}
        onClose={() => {
          setIsFestModalOpen(false);
          setEditingFest(null);
        }}
        onSuccess={loadData}
        initialData={editingFest}
      />

      <CompetitionFormModal
        isOpen={isCompModalOpen}
        onClose={() => {
          setIsCompModalOpen(false);
          setEditingComp(null);
        }}
        onSuccess={loadData}
        initialData={editingComp}
      />

    </div>
  );
}
