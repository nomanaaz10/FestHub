import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Users, 
  UserPlus, 
  Trash2, 
  Database, 
  Sparkles, 
  Trophy, 
  Bell, 
  Video, 
  Search, 
  CheckCircle2, 
  ShieldCheck,
  RefreshCw,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getAllUsers, getSubAdmins, findUserByEmail, updateUserRole } from '../services/userService';
import { getAllFests, deleteFest } from '../services/festService';
import { getAllCompetitions, deleteCompetition } from '../services/competitionService';
import { getAllAnnouncements, deleteAnnouncement } from '../services/announcementService';
import { getAllWebinars, deleteWebinar } from '../services/webinarService';
import { seedFirestoreDatabase } from '../firebase/seeder';
import { db } from '../firebase/config';
import { VerifiedBadge } from '../components/common/Badge';

export function SuperAdmin() {
  const { currentUser, isSuperAdmin, loginWithGoogle } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();

  const [subAdmins, setSubAdmins] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [fests, setFests] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [webinars, setWebinars] = useState([]);

  const [searchEmail, setSearchEmail] = useState('');
  const [searchedUser, setSearchedUser] = useState(null);
  const [isSearchingUser, setIsSearchingUser] = useState(false);

  const [isSeeding, setIsSeeding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('subadmins');

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [uList, saList, fList, cList, aList, wList] = await Promise.all([
        getAllUsers(),
        getSubAdmins(),
        getAllFests(),
        getAllCompetitions(),
        getAllAnnouncements(),
        getAllWebinars()
      ]);
      setAllUsers(uList);
      setSubAdmins(saList);
      setFests(fList);
      setCompetitions(cList);
      setAnnouncements(aList);
      setWebinars(wList);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSearchUser = async (e) => {
    e.preventDefault();
    if (!searchEmail.trim()) return;
    setIsSearchingUser(true);
    setSearchedUser(null);
    try {
      const user = await findUserByEmail(searchEmail);
      if (!user) {
        showInfo("No user found with email: " + searchEmail);
      } else {
        setSearchedUser(user);
      }
    } catch (err) {
      showError("Search failed");
    } finally {
      setIsSearchingUser(false);
    }
  };

  const handleMakeSubAdmin = async (user) => {
    try {
      await updateUserRole(user.id, 'subadmin');
      showSuccess(`Granted Sub-Admin privileges to ${user.displayName || user.email}`);
      setSearchedUser(null);
      setSearchEmail('');
      loadAllData();
    } catch (err) {
      showError("Failed to update user role");
    }
  };

  const handleRevokeSubAdmin = async (userId, name) => {
    if (!window.confirm(`Revoke Sub-Admin access for ${name}?`)) return;
    try {
      await updateUserRole(userId, 'student');
      showSuccess(`Sub-Admin access revoked for ${name}`);
      loadAllData();
    } catch (err) {
      showError("Failed to revoke role");
    }
  };

  const handleSeedDatabase = async () => {
    if (!window.confirm("Seed demo festivals, competitions, announcements, and webinars to Firestore? This will populate the portal with rich demo data.")) {
      return;
    }
    setIsSeeding(true);
    try {
      const res = await seedFirestoreDatabase(db, currentUser?.uid || "superadmin");
      showSuccess(`Successfully populated ${res.count} demo items in Firestore!`);
      loadAllData();
    } catch (err) {
      console.error(err);
      showError("Database seed failed: " + (err.message || "Unknown error"));
    } finally {
      setIsSeeding(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-6 shadow-xl">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase mb-3">
          Route: /super-admin
        </span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">
          Super Admin Authorization Required
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed mb-8">
          This portal is reserved for <strong className="text-white">nomanaaz10@gmail.com</strong> and designated super-administrators. Please log in with your super admin account to access user controls and database tools.
        </p>

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={async () => {
              try {
                await loginWithGoogle();
                showSuccess("Authenticated as Super Admin!");
                loadAllData();
              } catch (e) {
                showError("Sign in failed");
              }
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Sign In with Google (nomanaaz10@gmail.com)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border-rose-500/30 bg-rose-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-600/30 border border-rose-500/50 flex items-center justify-center text-rose-400 shrink-0 shadow-lg">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase">
                Route: /super-admin
              </span>
              <span className="text-xs text-slate-400 font-semibold">Master Authorization</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Super Admin Control Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Whitelist organizers, monitor platform metrics, manage all content, and seed database.
            </p>
          </div>
        </div>

        {/* Quick Database Seeder Action */}
        <button
          onClick={handleSeedDatabase}
          disabled={isSeeding}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white text-xs sm:text-sm font-bold shadow-xl shadow-indigo-600/30 transition-all disabled:opacity-50 shrink-0 self-stretch md:self-auto justify-center"
        >
          <Database className="w-4 h-4" />
          <span>{isSeeding ? "Seeding Database..." : "Seed / Reset Demo Data"}</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="glass-panel p-4 rounded-2xl flex flex-col">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Users</span>
          <span className="text-2xl font-extrabold text-white mt-1">{allUsers.length || 1}</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl flex flex-col border-amber-500/20">
          <span className="text-xs text-amber-400 font-semibold uppercase">Sub-Admins</span>
          <span className="text-2xl font-extrabold text-amber-300 mt-1">{subAdmins.length}</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl flex flex-col">
          <span className="text-xs text-indigo-400 font-semibold uppercase">Festivals</span>
          <span className="text-2xl font-extrabold text-indigo-300 mt-1">{fests.length}</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl flex flex-col">
          <span className="text-xs text-emerald-400 font-semibold uppercase">Competitions</span>
          <span className="text-2xl font-extrabold text-emerald-300 mt-1">{competitions.length}</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl flex flex-col">
          <span className="text-xs text-cyan-400 font-semibold uppercase">Notices</span>
          <span className="text-2xl font-extrabold text-cyan-300 mt-1">{announcements.length}</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl flex flex-col">
          <span className="text-xs text-purple-400 font-semibold uppercase">Webinars</span>
          <span className="text-2xl font-extrabold text-purple-300 mt-1">{webinars.length}</span>
        </div>
      </div>

      {/* Navigation Tabs for Admin */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('subadmins')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'subadmins'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Sub-Admin Whitelist ({subAdmins.length})</span>
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
          <span>Festivals ({fests.length})</span>
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

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'announcements'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Announcements ({announcements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('webinars')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'webinars'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Webinars ({webinars.length})</span>
        </button>
      </div>

      {/* TAB 1: SUB-ADMIN MANAGEMENT */}
      {activeTab === 'subadmins' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Grant Access Form */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 border-indigo-500/20">
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Grant Sub-Admin Role
              </h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Search a registered student by email to delegate fest and competition creation privileges.
            </p>

            <form onSubmit={handleSearchUser} className="flex flex-col gap-3">
              <input
                type="email"
                required
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="student@college.edu"
                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
              />
              <button
                type="submit"
                disabled={isSearchingUser}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                <span>{isSearchingUser ? "Searching..." : "Find User"}</span>
              </button>
            </form>

            {searchedUser && (
              <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/40 flex flex-col gap-3 mt-2">
                <div className="flex items-center gap-3">
                  <img
                    src={searchedUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${searchedUser.id}`}
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white truncate">{searchedUser.displayName || "Student"}</p>
                    <p className="text-xs text-slate-400 truncate">{searchedUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-2">
                  <span>Current Role:</span>
                  <span className="font-bold text-indigo-300 uppercase">{searchedUser.role || 'student'}</span>
                </div>

                {searchedUser.role === 'subadmin' ? (
                  <div className="text-xs text-amber-400 font-semibold text-center">
                    User is already a Sub-Admin
                  </div>
                ) : (
                  <button
                    onClick={() => handleMakeSubAdmin(searchedUser)}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Promote to Sub-Admin</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Whitelisted Sub-Admins List */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Active Sub-Administrators
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {subAdmins.length} Organizers
              </span>
            </div>

            {subAdmins.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm flex flex-col items-center justify-center">
                <Users className="w-10 h-10 mb-2 opacity-30" />
                <p>No sub-admins whitelisted yet.</p>
                <p className="text-xs text-slate-600 mt-1">Use the search form on the left to add one.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {subAdmins.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={admin.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${admin.id}`}
                        alt={admin.displayName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-white truncate">{admin.displayName || "Sub Admin"}</span>
                          <VerifiedBadge isVerified={admin.emailVerified} />
                        </div>
                        <p className="text-xs text-slate-400 truncate">{admin.email}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRevokeSubAdmin(admin.id, admin.displayName || admin.email)}
                      className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Revoke</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: FESTIVALS CONTENT MANAGEMENT */}
      {activeTab === 'fests' && (
        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-white tracking-tight pb-3 border-b border-slate-800">
            Manage All Festivals
          </h2>
          <div className="flex flex-col gap-3">
            {fests.map(f => (
              <div key={f.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800 gap-4">
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-white truncate">{f.title}</h3>
                  <p className="text-xs text-slate-400">{f.startDate} to {f.endDate} | {f.venue}</p>
                </div>
                <button
                  onClick={async () => {
                    if (window.confirm(`Delete ${f.title}?`)) {
                      await deleteFest(f.id);
                      loadAllData();
                    }
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30"
                  title="Delete Festival"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: COMPETITIONS CONTENT MANAGEMENT */}
      {activeTab === 'competitions' && (
        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-white tracking-tight pb-3 border-b border-slate-800">
            Manage All Competitions
          </h2>
          <div className="flex flex-col gap-3">
            {competitions.map(c => (
              <div key={c.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800 gap-4">
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-white truncate">{c.title}</h3>
                  <p className="text-xs text-slate-400">Date: {c.competitionDate} | Category: {c.category}</p>
                </div>
                <button
                  onClick={async () => {
                    if (window.confirm(`Delete ${c.title}?`)) {
                      await deleteCompetition(c.id);
                      loadAllData();
                    }
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30"
                  title="Delete Competition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ANNOUNCEMENTS CONTENT MANAGEMENT */}
      {activeTab === 'announcements' && (
        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-white tracking-tight pb-3 border-b border-slate-800">
            Manage All Announcements
          </h2>
          <div className="flex flex-col gap-3">
            {announcements.map(a => (
              <div key={a.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800 gap-4">
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-white truncate">{a.title}</h3>
                  <p className="text-xs text-slate-400">Date: {a.date} {a.important ? '• High Priority' : ''}</p>
                </div>
                <button
                  onClick={async () => {
                    if (window.confirm(`Delete ${a.title}?`)) {
                      await deleteAnnouncement(a.id);
                      loadAllData();
                    }
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30"
                  title="Delete Announcement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: WEBINARS CONTENT MANAGEMENT */}
      {activeTab === 'webinars' && (
        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-white tracking-tight pb-3 border-b border-slate-800">
            Manage All Webinars
          </h2>
          <div className="flex flex-col gap-3">
            {webinars.map(w => (
              <div key={w.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800 gap-4">
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-white truncate">{w.title}</h3>
                  <p className="text-xs text-slate-400">Speaker: {w.speaker} | Date: {w.date}</p>
                </div>
                <button
                  onClick={async () => {
                    if (window.confirm(`Delete ${w.title}?`)) {
                      await deleteWebinar(w.id);
                      loadAllData();
                    }
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30"
                  title="Delete Webinar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
