import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function Login() {
  const { login, loginWithGoogle } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    try {
      await login(email, password);
      showSuccess("Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      let msg = "Failed to sign in";
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = "Invalid email or password";
      } else if (err.code === 'auth/too-many-requests') {
        msg = "Too many failed attempts. Try again later.";
      }
      showError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleSubmitting(true);
    try {
      await loginWithGoogle();
      showSuccess("Successfully signed in with Google!");
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        showError("Google sign-in failed: " + (err.message || "Unknown error"));
      }
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 sm:p-10 border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Header */}
        <div className="text-center flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-rose-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sign In to FestHub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Access your registrations, bookmarks, and festival alerts
          </p>
        </div>

        {/* Google 1-Click Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isGoogleSubmitting || isSubmitting}
          className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-3 disabled:opacity-50 mb-6"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-slate-800" />
          <span className="text-xs text-slate-500 uppercase font-semibold">Or with email</span>
          <div className="h-px flex-1 bg-slate-800" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@college.edu"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isGoogleSubmitting}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{isSubmitting ? "Signing in..." : "Sign In"}</span>
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-400 font-bold hover:underline">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}
