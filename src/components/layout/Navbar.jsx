import React, { useState } from 'react';
import { Search, Bell, Star, User as UserIcon, ShieldAlert, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { user, notifications, favorites, toggleFavorite } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isCurrentFavorite = favorites.includes(location.pathname);

  const searchResults = [
    { title: 'Dashboard', path: '/', category: 'Navigation' },
    { title: 'Roadmap Studio', path: '/roadmaps', category: 'Learning' },
    { title: 'AI Workspace', path: '/ai-workspace', category: 'Productivity' },
    { title: 'Education Center', path: '/education', category: 'Learning' },
    { title: 'Developer Tools', path: '/developer-tools', category: 'Utilities' },
    { title: 'Document Studio', path: '/documents', category: 'Productivity' },
    { title: 'Productivity Hub', path: '/productivity', category: 'Productivity' },
    { title: 'Settings', path: '/settings', category: 'System' },
  ].filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10">
        {/* Left: Search trigger / Breadcrumb */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowSearchModal(true)}
            className="flex items-center space-x-3 bg-slate-950/60 border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-xl text-sm text-slate-400 w-72 transition-all shadow-inner group"
          >
            <Search size={16} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
            <span className="flex-1 text-left">Search workspace...</span>
            <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-400 font-mono">⌘K</kbd>
          </button>
        </div>

        {/* Right: Actions, Notifications, Profile */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => toggleFavorite(location.pathname)}
            className={`p-2 rounded-xl border transition-colors ${
              isCurrentFavorite 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={isCurrentFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star size={18} className={isCurrentFavorite ? 'fill-amber-400' : ''} />
          </button>

          {/* Notifications dropdown trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-slate-950/40 border border-slate-800 text-slate-400 hover:text-white transition-colors relative"
            >
              <Bell size={18} />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 pb-2 border-b border-slate-800 flex items-center justify-between">
                  <span className="font-semibold text-sm text-white">Notifications</span>
                  <span className="text-xs text-cyan-400 cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                  {notifications.map(n => (
                    <div key={n.id} className="p-3 hover:bg-slate-800/40 transition-colors">
                      <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>
                      <span className="text-[10px] text-slate-500 mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User profile avatar */}
          <div 
            onClick={() => navigate('/settings')}
            className="flex items-center space-x-3 pl-2 border-l border-slate-800 cursor-pointer group"
          >
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-9 h-9 rounded-xl object-cover border border-slate-700 group-hover:border-indigo-500 transition-colors"
            />
            <div className="hidden md:block text-left">
              <span className="block text-xs font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors">{user.name}</span>
              <span className="block text-[10px] text-slate-400">{user.role}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Global Command / Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-800 flex items-center space-x-3">
              <Search size={20} className="text-indigo-400" />
              <input
                type="text"
                placeholder="Type a command or search workspace..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
              />
              <button 
                onClick={() => setShowSearchModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-2 max-h-96 overflow-y-auto space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-500 uppercase">Quick Navigation</div>
              {searchResults.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    navigate(item.path);
                    setShowSearchModal(false);
                  }}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-indigo-600/10 hover:text-indigo-400 text-slate-300 cursor-pointer transition-colors group"
                >
                  <span className="text-sm font-medium">{item.title}</span>
                  <span className="text-xs text-slate-500 group-hover:text-indigo-400/70">{item.category}</span>
                </div>
              ))}
              {searchResults.length === 0 && (
                <div className="py-8 text-center text-sm text-slate-500">No matching workspace tools found.</div>
              )}
            </div>
            <div className="p-3 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>Use arrow keys to navigate</span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};