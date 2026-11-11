
import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Star,
  Map,
  Sparkles,
  GraduationCap,
  Terminal,
  FileText,
  CheckSquare,
  ArrowRight,
  LayoutDashboard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Favorites = () => {
  const { favorites } = useApp();
  const navigate = useNavigate();

  const allModules = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard, desc: 'Overview statistics and quick access.' },
    { path: '/roadmaps', label: 'Roadmap Studio', icon: Map, desc: 'Interactive node-based skill roadmaps.' },
    { path: '/ai-workspace', label: 'AI Workspace', icon: Sparkles, desc: 'AI chats, writer, and document analyzer.' },
    { path: '/education', label: 'Education Center', icon: GraduationCap, desc: 'Quiz generator, flashcards, and notes.' },
    { path: '/developer-tools', label: 'Developer Tools', icon: Terminal, desc: 'Playground, JSON formatter, and API tester.' },
    { path: '/documents', label: 'Document Studio', icon: FileText, desc: 'Rich text editor and PDF manager.' },
    { path: '/productivity', label: 'Productivity Hub', icon: CheckSquare, desc: 'Task manager, Kanban, and Pomodoro timer.' },
  ];

  const starredModules = allModules.filter(m => favorites.includes(m.path));

  return (
    <div className="space-y-8 animate-in fade-in max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-3">
          <Star className="text-amber-400 fill-amber-400" size={24} />
          <span>Starred Favorites</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Quick access to your most frequently used workspace modules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {starredModules.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-indigo-500/50 transition-all cursor-pointer group shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-indigo-600/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Icon size={24} />
                  </div>
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-white">{item.label}</h3>
                  <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-indigo-400 group-hover:translate-x-1 transition-transform">
                <span>Launch module</span>
                <ArrowRight size={14} />
              </div>
            </div>
          );
        })}

        {starredModules.length === 0 && (
          <div className="col-span-full py-16 text-center bg-slate-900 border border-slate-800 rounded-3xl">
            <Star size={40} className="mx-auto text-slate-600 mb-3" />
            <p className="text-slate-300 font-medium">No favorites starred yet.</p>
            <p className="text-slate-500 text-xs mt-1">
              Click the star icon in the navbar on any page to add it here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
