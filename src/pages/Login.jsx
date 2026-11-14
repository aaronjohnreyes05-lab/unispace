
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-slate-950/80 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300';

  return (
    <div className="auth-page min-h-screen relative flex items-center justify-center px-4 py-10">

      {/* Animated space background */}
      <div className="auth-background">
        <div className="auth-stars" />
        <div className="auth-nebula auth-nebula-one" />
        <div className="auth-nebula auth-nebula-two" />
        <div className="auth-nebula auth-nebula-three" />
        <div className="auth-grid" />
      </div>

      {/* Login content */}
      <div className="auth-content relative w-full max-w-md">

        {/* Brand */}
        <Link to="/" className="auth-logo flex items-center justify-center gap-3 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <Compass className="w-7 h-7 text-white" />
          </div>

          <div>
            <span className="block text-2xl font-bold text-white tracking-tight">
              UniSpace
            </span>
            <span className="block text-[10px] text-cyan-400 tracking-[0.25em] uppercase">
              Workspace OS
            </span>
          </div>
        </Link>

        {/* Login card */}
        <div className="auth-card mt-8 bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-indigo-950/40">

          <div className="auth-heading mb-8">
            <div className="inline-flex items-center gap-2 text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Welcome to your workspace
            </div>

            <h1 className="text-3xl font-bold text-white">
              Welcome back<span className="text-indigo-400">.</span>
            </h1>

            <p className="text-sm text-slate-400 mt-3">
              Sign in to continue to your UniSpace workspace.
            </p>
          </div>

          {error && (
            <div className="auth-message mb-5 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div className="auth-field">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-field">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className={`${inputClass} pr-12`}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="auth-submit w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-indigo-600/20"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-7 auth-footer">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-indigo-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-500 mt-7 auth-footer">
          © {new Date().getFullYear()} UniSpace. All rights reserved.
        </p>
      </div>
    </div>
  );
};
