import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Menu, 
  X, 
  User, 
  LogOut, 
  ShieldAlert, 
  Flame, 
  Trophy, 
  Bell, 
  Video, 
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { VerifiedBadge, RoleBadge } from './Badge';

export function Navbar() {
  const { currentUser, userProfile, isSuperAdmin, isSubAdmin, logout } = useAuth();
  const { showSuccess } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess("Successfully logged out");
      setIsUserMenuOpen(false);
      setIsMobileMenuOpen(false);
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Flame },
    { to: '/festivals', label: 'Festivals', icon: Sparkles },
    { to: '/competitions', label: 'Competitions', icon: Trophy },
    { to: '/announcements', label: 'Announcements', icon: Bell },
    { to: '/webinars', label: 'Webinars', icon: Video },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-rose-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                Fest<span className="text-indigo-400">Hub</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                College Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}

            {/* Super Admin Nav Link (if Super Admin) */}
            {isSuperAdmin && (
              <NavLink
                to="/super-admin"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-rose-600/30 text-rose-200 border border-rose-500/50 shadow-sm'
                      : 'text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 border border-rose-500/20'
                  }`
                }
              >
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Super Admin</span>
              </NavLink>
            )}
          </div>

          {/* Desktop Right / User Profile */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all"
                >
                  <img
                    src={userProfile?.photoURL || currentUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.uid}`}
                    alt="Avatar"
                    className="w-8 h-8 rounded-xl object-cover bg-slate-800 border border-slate-700"
                  />
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-white max-w-[100px] truncate">
                        {userProfile?.displayName || currentUser.email?.split('@')[0]}
                      </span>
                      <VerifiedBadge isVerified={userProfile?.emailVerified || currentUser.emailVerified} />
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 glass-modal rounded-2xl border border-slate-700/80 p-2 shadow-2xl z-20 animate-fade-in flex flex-col gap-1">
                      <div className="px-3 py-2.5 border-b border-slate-800 mb-1">
                        <p className="text-sm font-bold text-white truncate">
                          {userProfile?.displayName || "Student"}
                        </p>
                        <p className="text-xs text-slate-400 truncate mb-1.5">
                          {currentUser.email}
                        </p>
                        <RoleBadge role={userProfile?.role || 'student'} />
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-200 hover:bg-slate-800/80 hover:text-white transition-colors"
                      >
                        <User className="w-4 h-4 text-indigo-400" />
                        <span>My Profile & Registered Events</span>
                      </Link>

                      {isSuperAdmin && (
                        <Link
                          to="/super-admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-rose-300 hover:bg-rose-950/40 transition-colors"
                        >
                          <ShieldAlert className="w-4 h-4 text-rose-400" />
                          <span>Admin Control Center</span>
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-xl text-sm text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800/60 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-modal border-t border-slate-800 px-4 pt-3 pb-6 animate-fade-in flex flex-col gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}

          {isSuperAdmin && (
            <NavLink
              to="/super-admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-rose-300 bg-rose-950/30 border border-rose-500/30"
            >
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>Super Admin</span>
            </NavLink>
          )}

          <div className="pt-4 mt-2 border-t border-slate-800 flex flex-col gap-2">
            {currentUser ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-slate-200 hover:bg-slate-900"
                >
                  <User className="w-5 h-5 text-indigo-400" />
                  <span>My Profile & Registrations</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-rose-400 hover:bg-rose-950/40"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-semibold bg-slate-900 border border-slate-800 text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
