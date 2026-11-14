
import React, { useState } from 'react';
import {
  Search,
  Bell,
  Star,
  X,
  LogOut
} from 'lucide-react';

import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { user, notifications, favorites, toggleFavorite } = useApp();
  const { logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  const isCurrentFavorite = favorites.includes(location.pathname);

  const searchResults = [
    { title: 'Dashboard', path: '/dashboard', category: 'Navigation' },
    { title: 'Roadmap Studio', path: '/roadmaps', category: 'Learning' },
    { title: 'AI Workspace', path: '/ai-workspace', category: 'Productivity' },
    { title: 'Education Center', path: '/education', category: 'Learning' },
    { title: 'Developer Tools', path: '/developer-tools', category: 'Utilities' },
    { title: 'Document Studio', path: '/documents', category: 'Productivity' },
    { title: 'Productivity Hub', path: '/productivity', category: 'Productivity' },
    { title: 'Settings', path: '/settings', category: 'System' },
  ].filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      await logout();

      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      alert(error.message || 'Unable to log out. Please try again.');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10">

        {/* Left: Search */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowSearchModal(true)}
            className="flex items-center space-x-3 bg-slate-950/60 border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-xl text-sm text-slate-400 w-72 transition-all shadow-inner group"
          >
            <Search size={16} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
            <span className="flex-1 text-left">Search workspace...</span>
            <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-400 font-mono">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right: Actions, Notifications, Profile and Logout */}
        <div className="flex items-center space-x-3">

          {/* Favorites */}
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

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-slate-950/40 border border-slate-800 text-slate-400 hover:text-white transition-colors relative"
              title="Notifications"
            >
              <Bell size={18} />

              {notifications.some(n => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-3 z-50 animate-in fade-in slide-in-from-top-2">

                <div className="px-4 pb-2 border-b border-slate-800 flex items-center justify-between">
                  <span className="font-semibold text-sm text-white">
                    Notifications
                  </span>

                  <span className="text-xs text-cyan-400">
                    Recent activity
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div key={n.id} className="p-3 hover:bg-slate-800/40 transition-colors">
                        <p className="text-xs font-semibold text-slate-200">
                          {n.title}
                        </p>

                        <p className="text-xs text-slate-400 mt-0.5">
                          {n.message}
                        </p>

                        <span className="text-[10px] text-slate-500 mt-1 block">
                          {n.time}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="p-5 text-center text-xs text-slate-500">
                      No notifications yet.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center space-x-3 pl-2 border-l border-slate-800 cursor-pointer group text-left"
            title="Open profile settings"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-xl object-cover border border-slate-700 group-hover:border-indigo-500 transition-colors"
            />

            <div className="hidden md:block">
              <span className="block text-xs font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors">
                {user.name}
              </span>

              <span className="block text-[10px] text-slate-400">
                {user.role}
              </span>
            </div>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="p-2 rounded-xl bg-slate-950/40 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-colors disabled:opacity-50"
            title="Log out"
          >
            <LogOut size={18} />
          </button>

        </div>
      </header>

      {/* Global Search Modal */}
      {showSearchModal && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4"
          onClick={() => setShowSearchModal(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95"
            onClick={e => e.stopPropagation()}
          >

            <div className="p-4 border-b border-slate-800 flex items-center space-x-3">
              <Search size={20} className="text-indigo-400" />

              <input
                type="text"
                placeholder="Type a command or search workspace..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
                className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
              />

              <button
                onClick={() => {
                  setShowSearchModal(false);
                  setSearchQuery('');
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-2 max-h-96 overflow-y-auto space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-500 uppercase">
                Quick Navigation
              </div>

              {searchResults.map(item => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setShowSearchModal(false);
                    setSearchQuery('');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-indigo-600/10 hover:text-indigo-400 text-slate-300 text-left transition-colors group"
                >
                  <span className="text-sm font-medium">
                    {item.title}
                  </span>

                  <span className="text-xs text-slate-500 group-hover:text-indigo-400/70">
                    {item.category}
                  </span>
                </button>
              ))}

              {searchResults.length === 0 && (
                <div className="py-8 text-center text-sm text-slate-500">
                  No matching workspace tools found.
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>Search workspace modules</span>
              <span>ESC to close</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
