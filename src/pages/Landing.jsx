
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  LayoutDashboard,
  Map,
  Sparkles,
  GraduationCap,
  Terminal,
  FileText,
  CheckSquare,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const Landing = () => {
  const features = [
    {
      icon: Map,
      title: 'Roadmap Studio',
      description: 'Plan your learning journey and track your progress.'
    },
    {
      icon: Sparkles,
      title: 'AI Workspace',
      description: 'Organize your ideas and improve your productivity.'
    },
    {
      icon: GraduationCap,
      title: 'Education Center',
      description: 'Keep your learning resources organized in one place.'
    },
    {
      icon: Terminal,
      title: 'Developer Tools',
      description: 'Access useful tools for your programming workflow.'
    },
    {
      icon: FileText,
      title: 'Document Studio',
      description: 'Create and organize your important documents.'
    },
    {
      icon: CheckSquare,
      title: 'Productivity Hub',
      description: 'Manage tasks and stay focused on your goals.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden">

      {/* Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Compass className="w-6 h-6 text-white" />
            </div>

            <div>
              <span className="block font-bold text-xl tracking-wide">
                UniSpace
              </span>
              <span className="block text-[9px] text-cyan-400 font-medium tracking-widest uppercase">
                Workspace OS
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main>
        <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-28 lg:pt-32 lg:pb-36">

          <div className="absolute top-10 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-4xl mx-auto text-center">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-8">
              <Zap size={14} />
              Your personal digital workspace
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
              Everything you need.
              <span className="block bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                One UniSpace.
              </span>
            </h1>

            <p className="mt-7 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              A unified workspace for students and developers.
              Organize your learning, manage projects, explore tools,
              and stay productive in one place.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">

              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-xl shadow-indigo-600/20"
              >
                Create Your Account
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold transition-colors"
              >
                Sign In
              </Link>

            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-6 text-xs text-slate-500">
              <span className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-emerald-400" />
                Secure authentication
              </span>

              <span className="flex items-center gap-2">
                <LayoutDashboard size={15} className="text-cyan-400" />
                Unified workspace
              </span>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-slate-800/70 bg-slate-900/30 py-24">
          <div className="max-w-7xl mx-auto px-6">

            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-xs font-bold tracking-widest uppercase text-indigo-400 mb-3">
                Explore UniSpace
              </p>

              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Your workspace, all in one place.
              </h2>

              <p className="text-sm text-slate-400 mt-4 leading-relaxed">
                Everything is organized into dedicated modules
                designed to support your learning and development.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900/80 transition-all"
                  >
                    <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-5">
                      <Icon size={22} />
                    </div>

                    <h3 className="text-lg font-semibold text-white">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="max-w-5xl mx-auto px-6 py-24 text-center">
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 p-10 sm:p-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to organize your space?
            </h2>

            <p className="mt-4 text-sm text-slate-400 max-w-xl mx-auto">
              Create your account and start building a more organized
              learning and development workspace.
            </p>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">

          <Link to="/" className="flex items-center gap-2 text-sm font-bold text-slate-300">
            <Compass size={18} className="text-indigo-400" />
            UniSpace
          </Link>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} UniSpace. All rights reserved.
          </p>

        </div>
      </footer>
    </div>
  );
};
