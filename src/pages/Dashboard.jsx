
import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Map,
  Terminal,
  CheckSquare,
  ArrowUpRight,
  Clock,
  Trophy
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
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Welcome Hero */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-slate-900 to-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <Trophy size={12} />
              <span>Workspace Active & Synchronized</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white">
              Welcome back, {user.name} 👋
            </h1>

            <p className="text-slate-400 max-w-xl text-sm">
              Your all-in-one frontend workspace is ready. Pick up where you left off in Roadmap Studio or test snippets in Developer Tools.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/ai-workspace')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center space-x-2"
            >
              <Sparkles size={16} />
              <span>Launch AI Studio</span>
            </button>

            <button
              onClick={() => navigate('/roadmaps')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-all border border-slate-700 flex items-center space-x-2"
            >
              <span>Explore Roadmaps</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {quickStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <button
              key={stat.label}
              onClick={() => navigate(stat.path)}
              className="text-left bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-indigo-500/50 hover:bg-slate-800/70 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">
                  {stat.label}
                </span>

                <div className={`p-2.5 rounded-xl ${stat.color}`}>
                  <Icon size={20} />
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-2xl font-bold text-white">
                  {stat.value}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {stat.change}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Recent Modules & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-white">
              Active Learning & Roadmaps
            </h3>

            <button
              onClick={() => navigate('/roadmaps')}
              className="text-xs text-indigo-400 hover:underline flex items-center space-x-1"
            >
              <span>View all</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="space-y-4">
            <div
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between hover:border-indigo-500/50 transition-all cursor-pointer"
              onClick={() => navigate('/roadmaps')}
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                  FE
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-slate-200">
                    Frontend Development Roadmap
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    React, State Management, Tailwind CSS, Vite
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-cyan-400">
                  75% Completed
                </span>

                <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div className="w-3/4 h-full bg-cyan-400 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-white mb-2">
              Local Storage Status
            </h3>

            <p className="text-xs text-slate-400 mb-6">
              Your workspace preferences and saved application data are stored locally in your browser.
            </p>

            <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Persistence Engine</span>
                <span className="text-emerald-400 font-medium">
                  LocalStorage
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Storage Used</span>
                <span className="text-slate-200 font-medium">
                  {user.storageUsed || '0 GB'} / {user.storageLimit || '10 GB'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center space-x-2 text-xs text-slate-500">
            <Clock size={14} />
            <span>Local data storage active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
