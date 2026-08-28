import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Globe, Mail, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-rose-500 flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Fest<span className="text-indigo-400">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              The centralized college fest & competition portal. Discover events, register with one click, connect with fellow participants, and celebrate campus culture.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official Campus Event Network</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Explore Portal
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/festivals" className="hover:text-indigo-400 transition-colors">Annual Festivals</Link>
              </li>
              <li>
                <Link to="/competitions" className="hover:text-indigo-400 transition-colors">Live Competitions</Link>
              </li>
              <li>
                <Link to="/announcements" className="hover:text-indigo-400 transition-colors">Notice Board</Link>
              </li>
              <li>
                <Link to="/webinars" className="hover:text-indigo-400 transition-colors">Guest Lectures & Webinars</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Event Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Event Categories
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-slate-400">
              <li><span className="hover:text-slate-300">Academic & Quizzing</span></li>
              <li><span className="hover:text-slate-300">Fine Arts & Digital Design</span></li>
              <li><span className="hover:text-slate-300">Music & Concerts</span></li>
              <li><span className="hover:text-slate-300">Debates & Model UN</span></li>
              <li><span className="hover:text-slate-300">Photography & Short Films</span></li>
            </ul>
          </div>

          {/* Col 4: Quick Auth & Info */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Student Account
            </h4>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Create an account using your college email or Google sign-in to register for events instantly.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                to="/signup"
                className="w-full text-center py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
              >
                Create Student Account
              </Link>
              <Link
                to="/login"
                className="w-full text-center py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FestHub Portal. Designed for college campus celebrations.</p>
          <div className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="text-slate-300 font-semibold">React + Firebase Firestore</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
