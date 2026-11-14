
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
    'w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors';

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-8">

        <Link to="/" className="flex items-center justify-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="block text-2xl font-bold text-white">
              UniSpace
            </span>
            <span className="block text-[10px] text-cyan-400 tracking-widest uppercase">
              Workspace OS
            </span>
          </div>
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">
              Welcome back
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              Sign in to continue to your UniSpace workspace.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
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

            <div>
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors shadow-lg shadow-indigo-600/20"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-7">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Create one
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-600">
          © {new Date().getFullYear()} UniSpace. All rights reserved.
        </p>
      </div>
    </div>
  );
};
