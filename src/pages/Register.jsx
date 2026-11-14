
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (name.trim().length < 2) {
      setError('Please enter a name with at least 2 characters.');
      return;
    }

    if (password.length < 8) {
      setError('Your password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Your passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const data = await register({
        name: name.trim(),
        email: email.trim(),
        password
      });

      if (data.session) {
        navigate('/dashboard', { replace: true });
      } else {
        setSuccess(
          'Your account has been created! Please check your email and click the confirmation link before signing in.'
        );
      }
    } catch (err) {
      setError(err.message || 'Unable to create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300';

  return (
    <div className="auth-page relative min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10 overflow-hidden">

      {/* Space background */}
     <div className="auth-background">
  <div className="auth-stars" />
  <div className="auth-orb auth-orb-one" />
  <div className="auth-orb auth-orb-two" />
  <div className="auth-orb auth-orb-three" />
</div>

      <div className="relative z-10 w-full max-w-md space-y-8">

        {/* Brand */}
        <Link to="/" className="auth-logo flex items-center justify-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <Compass className="w-6 h-6 text-white" />
          </div>

          <div>
            <span className="block text-2xl font-bold text-white tracking-tight">
              UniSpace
            </span>
            <span className="block text-[10px] text-cyan-400 tracking-widest uppercase">
              Workspace OS
            </span>
          </div>
        </Link>

        {/* Registration card */}
        <div className="auth-card bg-slate-900/85 backdrop-blur-xl border border-slate-700/70 rounded-3xl p-8 shadow-2xl shadow-indigo-950/30">

          <div className="auth-heading mb-8">
            <div className="inline-flex items-center gap-2 text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Start your journey
            </div>

            <h1 className="text-2xl font-bold text-white">
              Create your account<span className="text-indigo-400">.</span>
            </h1>

            <p className="text-sm text-slate-400 mt-2">
              Join UniSpace and organize your learning and development workspace.
            </p>
          </div>

          {error && (
            <div className="auth-message mb-5 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-sm text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="auth-message mb-5 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-sm text-emerald-300">
              <div className="flex items-center gap-2 font-semibold mb-2">
                <CheckCircle size={17} />
                Registration successful
              </div>

              {success}

              <Link
                to="/login"
                className="block mt-3 text-emerald-200 underline font-medium"
              >
                Go to Sign In
              </Link>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="auth-field">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full name
              </label>

              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your full name"
                  className={inputClass}
                  autoComplete="name"
                  required
                  disabled={loading || Boolean(success)}
                />
              </div>
            </div>

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
                  disabled={loading || Boolean(success)}
                />
              </div>
            </div>

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
                  placeholder="At least 8 characters"
                  className={`${inputClass} pr-12`}
                  autoComplete="new-password"
                  minLength={8}
                  required
                  disabled={loading || Boolean(success)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={loading || Boolean(success)}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className="auth-field">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confirm password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Re-enter your password"
                  className={inputClass}
                  autoComplete="new-password"
                  required
                  disabled={loading || Boolean(success)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || Boolean(success)}
              className="auth-submit w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-indigo-600/20"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-7 auth-footer">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-indigo-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-600 auth-footer">
          © {new Date().getFullYear()} UniSpace. All rights reserved.
        </p>
      </div>
    </div>
  );
};
