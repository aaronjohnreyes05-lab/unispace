
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Sparkles,
  GraduationCap,
  Terminal,
  FileText,
  CheckSquare,
  Star,
  Settings,
  ChevronLeft,
  ChevronRight,
  Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar = () => {
  const { sidebarCollapsed, setSidebarCollapsed, favorites } = useApp();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/roadmaps', label: 'Roadmap Studio', icon: Map },
    { path: '/ai-workspace', label: 'AI Workspace', icon: Sparkles },
    { path: '/education', label: 'Education Center', icon: GraduationCap },
    { path: '/developer-tools', label: 'Developer Tools', icon: Terminal },
    { path: '/documents', label: 'Document Studio', icon: FileText },
    { path: '/productivity', label: 'Productivity Hub', icon: CheckSquare },
    { path: '/favorites', label: 'Favorites', icon: Star },
  ];

  return (
    <aside className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col z-20 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>

      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">

        <NavLink
          to="/dashboard"
          className="flex items-center gap-3 min-w-0"
          title="Go to Dashboard"
        >
          {!sidebarCollapsed ? (
            <>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                <Compass className="w-5 h-5 text-white" />
              </div>

              <div>
                <span className="font-bold text-lg tracking-wide bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  UniSpace
                </span>
                <span className="block text-[10px] text-cyan-400 font-medium tracking-widest uppercase">
                  Workspace OS
                </span>
              </div>
            </>
          ) : (
            <div className="mx-auto w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Compass className="w-5 h-5 text-white" />
            </div>
          )}
        </NavLink>

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        <div className={`px-3 py-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider ${sidebarCollapsed ? 'text-center' : ''}`}>
          {sidebarCollapsed ? 'Menu' : 'Core Modules'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) => `
                flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative
                ${isActive
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}
                ${sidebarCollapsed ? 'justify-center px-0' : ''}
              `}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon size={20} className="shrink-0 transition-transform group-hover:scale-110" />
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}

              {favorites.includes(item.path) && item.path !== '/favorites' && !sidebarCollapsed && (
                <Star size={12} className="ml-auto text-amber-400 fill-amber-400" />
              )}
            </NavLink>
          );
        })}

        {/* Starred Module Shortcuts */}
        {!sidebarCollapsed && (
          <div className="pt-6">
            <div className="px-3 py-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Starred Modules</span>
              <Star size={12} className="text-slate-500" />
            </div>

            <div className="mt-2 space-y-1">
              {favorites.map(favPath => {
                const found = navItems.find(n => n.path === favPath);

                if (!found || favPath === '/favorites') return null;

                const Icon = found.icon;

                return (
                  <NavLink
                    key={`fav-${favPath}`}
                    to={favPath}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 transition-colors"
                  >
                    <Icon size={15} className="text-indigo-400" />
                    <span className="truncate">{found.label}</span>
                  </NavLink>
                );
              })}

              {favorites.filter(path => path !== '/favorites').length === 0 && (
                <p className="px-3 text-xs text-slate-600 italic">
                  No modules starred yet.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        <NavLink
          to="/settings"
          className={({ isActive }) => `
            flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors
            ${isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}
            ${sidebarCollapsed ? 'justify-center' : ''}
          `}
          title={sidebarCollapsed ? 'Settings' : undefined}
        >
          <Settings size={20} className="shrink-0" />
          {!sidebarCollapsed && <span>Settings</span>}
        </NavLink>

        {!sidebarCollapsed && (
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60 text-xs text-slate-400 space-y-1">
            <div className="flex justify-between font-medium">
              <span>Local Storage</span>
              <span className="text-cyan-400">Active</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Data persists locally in your browser.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
