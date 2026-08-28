import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function Signup() {
  const { signup, loginWithGoogle } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !displayName) return;

    if (password !== confirmPassword) {
      showError("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      showError("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(email, password, displayName);
      showSuccess("🎉 Account created successfully!");
      navigate('/profile');
    } catch (err) {
      console.error(err);
      let msg = "Failed to create account";
      if (err.code === 'auth/email-already-in-use') {
        msg = "An account with this email already exists.";
      } else if (err.code === 'auth/invalid-email') {
        msg = "Invalid email address format.";
      } else if (err.code === 'auth/weak-password') {
        msg = "Password is too weak. Use at least 6 characters.";
      }
      showError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleSubmitting(true);
    try {
      await loginWithGoogle();
      showSuccess("Signed up with Google!");
      navigate('/profile');
    } catch (err) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        showError("Google sign-up failed");
      }
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 sm:p-10 border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Header */}
        <div className="text-center flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-rose-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Create Student Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Join FestHub to register for events & compete
          </p>
        </div>

        {/* Google Button */}
        <button
          type="button"
          onClick={handleGoogleSignup}
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
          <span>Quick Sign Up with Google</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-slate-800" />
          <span className="text-xs text-slate-500 uppercase font-semibold">Or with email</span>
          <div className="h-px flex-1 bg-slate-800" />
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter name"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              College Email Address
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
              Password (min 6 characters)
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

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            <UserPlus className="w-4 h-4" />
            <span>{isSubmitting ? "Creating Account..." : "Create Account"}</span>
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Already registered?{' '}
          <Link to="/login" className="text-indigo-400 font-bold hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
