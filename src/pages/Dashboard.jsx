
import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Map,
  Terminal,
  CheckSquare,
  ArrowUpRight,
  Clock,
  Trophy,
  BookOpen,
  FileText,
  ListTodo
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  const quickStats = [
    {
      label: 'Roadmap Progress',
      value: '64%',
      change: '+12% this week',
      icon: Map,
      color: 'text-indigo-400 bg-indigo-500/10',
      path: '/roadmaps'
    },
    {
      label: 'Active AI Chats',
      value: '8',
      change: '3 saved drafts',
      icon: Sparkles,
      color: 'text-cyan-400 bg-cyan-500/10',
      path: '/ai-workspace'
    },
    {
      label: 'Dev Snippets',
      value: '24',
      change: '4 languages',
      icon: Terminal,
      color: 'text-emerald-400 bg-emerald-500/10',
      path: '/developer-tools'
    },
    {
      label: 'Completed Tasks',
      value: '18/22',
      change: '82% on track',
      icon: CheckSquare,
      color: 'text-amber-400 bg-amber-500/10',
      path: '/productivity'
    }
  ];

  const quickActions = [
    {
      title: 'AI Workspace',
      description: 'Continue your AI conversations',
      icon: Sparkles,
      color: 'text-cyan-400 bg-cyan-500/10',
      path: '/ai-workspace'
    },
    {
      title: 'Education Center',
      description: 'Open your learning materials',
      icon: BookOpen,
      color: 'text-indigo-400 bg-indigo-500/10',
      path: '/education'
    },
    {
      title: 'Documents',
      description: 'Manage your saved documents',
      icon: FileText,
      color: 'text-emerald-400 bg-emerald-500/10',
      path: '/documents'
    },
    {
      title: 'Productivity',
      description: 'Manage your tasks and plans',
      icon: ListTodo,
      color: 'text-amber-400 bg-amber-500/10',
      path: '/productivity'
    }
  ];

  return (
    <div className="dashboard-page relative isolate min-h-full">

      {/* Alien X-inspired cosmic background */}
      <div className="dashboard-cosmos" aria-hidden="true">
        <div className="dashboard-stars" />
        <div className="dashboard-nebula dashboard-nebula-one" />
        <div className="dashboard-nebula dashboard-nebula-two" />
        <div className="dashboard-nebula dashboard-nebula-three" />
        <div className="dashboard-energy dashboard-energy-one" />
        <div className="dashboard-energy dashboard-energy-two" />
      </div>

      {/* Dashboard content */}
      <div className="dashboard-content space-y-8 max-w-7xl mx-auto">

        {/* Welcome Hero */}
        <section className="dashboard-hero ui-card bg-gradient-to-r from-indigo-950/60 via-slate-950/90 to-emerald-950/30 border border-white/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">

          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/3 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold border border-emerald-400/20">
                <Trophy size={12} />
                <span>Workspace Active & Synchronized</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Welcome back, {user.name} 👋
              </h1>

              <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
                Your all-in-one frontend workspace is ready. Pick up where you left off in Roadmap Studio or test snippets in Developer Tools.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => navigate('/ai-workspace')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <Sparkles size={16} />
                <span>Launch AI Studio</span>
              </button>

              <button
                onClick={() => navigate('/roadmaps')}
                className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-all duration-200 border border-slate-700 hover:border-slate-600 hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
              >
                <span>Explore Roadmaps</span>
                <ArrowUpRight size={15} />
              </button>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="dashboard-section">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white">
                Workspace Overview
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Your current workspace statistics
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {quickStats.map((stat) => {
              const Icon = stat.icon;

              return (
                <button
                  key={stat.label}
                  onClick={() => navigate(stat.path)}
                  aria-label={`Open ${stat.label}`}
                  className="ui-card dashboard-stat group text-left bg-slate-950/75 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl hover:border-emerald-400/30 hover:bg-slate-900/90 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
                      {stat.label}
                    </span>

                    <div className={`p-2.5 rounded-xl ${stat.color} transition-all duration-200 group-hover:scale-110 group-hover:rotate-3`}>
                      <Icon size={20} />
                    </div>
                  </div>

                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        {stat.value}
                      </h3>

                      <p className="text-xs text-slate-400 mt-1">
                        {stat.change}
                      </p>
                    </div>

                    <ArrowUpRight
                      size={16}
                      className="text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="dashboard-section">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-white">
              Quick Actions
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              Jump directly into your workspace tools
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.path}
                  onClick={() => navigate(action.path)}
                  className="ui-card dashboard-action group flex items-center gap-4 text-left p-4 rounded-2xl bg-slate-950/75 border border-white/10 hover:border-emerald-400/30 hover:bg-slate-900/90 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  <div className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center ${action.color} transition-transform duration-200 group-hover:scale-110`}>
                    <Icon size={20} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                      {action.title}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {action.description}
                    </p>
                  </div>

                  <ArrowUpRight
                    size={16}
                    className="shrink-0 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                  />
                </button>
              );
            })}
          </div>
        </section>

        {/* Recent Modules & Storage */}
        <section className="dashboard-section grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Active Learning */}
          <div className="ui-card dashboard-panel lg:col-span-2 bg-slate-950/75 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="font-bold text-lg text-white">
                  Active Learning & Roadmaps
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  Continue your learning journey
                </p>
              </div>

              <button
                onClick={() => navigate('/roadmaps')}
                className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
              >
                <span>View all</span>
                <ArrowUpRight size={14} />
              </button>
            </div>

            <button
              onClick={() => navigate('/roadmaps')}
              className="group w-full text-left p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-emerald-400/30 hover:bg-slate-900/80 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold transition-transform duration-200 group-hover:scale-110">
                  FE
                </div>

                <div className="min-w-0">
                  <h4 className="font-semibold text-sm text-slate-200 group-hover:text-white transition-colors">
                    Frontend Development Roadmap
                  </h4>

                  <p className="text-xs text-slate-400 mt-1">
                    React, State Management, Tailwind CSS, Vite
                  </p>
                </div>
              </div>

              <div className="sm:text-right sm:min-w-28">
                <span className="text-xs font-semibold text-emerald-400">
                  75% Completed
                </span>

                <div
                  className="w-full sm:w-24 h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden"
                  role="progressbar"
                  aria-label="Frontend Development Roadmap progress"
                  aria-valuenow={75}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div className="w-3/4 h-full bg-emerald-400 rounded-full transition-all duration-500 group-hover:w-4/5" />
                </div>
              </div>
            </button>
          </div>

          {/* Local Storage Status */}
          <div className="ui-card dashboard-panel bg-slate-950/75 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-white mb-2">
                Local Storage Status
              </h3>

              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Your workspace preferences and saved application data are stored locally in your browser.
              </p>

              <div className="space-y-3 bg-black/40 p-4 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center gap-3 text-xs">
                  <span className="text-slate-400">
                    Persistence Engine
                  </span>

                  <span className="text-emerald-400 font-medium">
                    LocalStorage
                  </span>
                </div>

                <div className="flex justify-between items-center gap-3 text-xs">
                  <span className="text-slate-400">
                    Storage Used
                  </span>

                  <span className="text-slate-200 font-medium">
                    {user.storageUsed || '0 GB'} / {user.storageLimit || '10 GB'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-slate-400">
              <Clock size={14} />
              <span>Local data storage active</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
