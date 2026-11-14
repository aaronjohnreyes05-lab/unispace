
import React, { useEffect, useRef, useState } from 'react';
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
  const [avatarError, setAvatarError] = useState(false);

  const searchInputRef = useRef(null);

  const isCurrentFavorite = favorites.includes(location.pathname);

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user.name || 'User'
  )}&background=1e293b&color=fff`;

  const avatarSource = avatarError
    ? fallbackAvatar
    : user.avatar || fallbackAvatar;

  // Reset image fallback when the user's avatar changes.
  useEffect(() => {
    setAvatarError(false);
  }, [user.avatar]);

  // Searchable workspace modules.
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

  // Keyboard shortcuts: Ctrl/Cmd + K and Escape.
  useEffect(() => {
    const handleKeyDown = (event) => {
      const isSearchShortcut =
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === 'k';

      if (isSearchShortcut) {
        event.preventDefault();
        setShowSearchModal(true);
        setShowNotifications(false);
      }

      if (event.key === 'Escape') {
        setShowSearchModal(false);
        setShowNotifications(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Focus search input when modal opens.
  useEffect(() => {
    if (showSearchModal) {
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [showSearchModal]);

  // Logout.
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

  const closeSearch = () => {
    setShowSearchModal(false);
    setSearchQuery('');
  };

  return (
    <>
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 gap-3">

        {/* Left: Search */}
        <div className="flex items-center min-w-0">
          <button
            onClick={() => {
              setShowSearchModal(true);
              setShowNotifications(false);
            }}
            aria-label="Search workspace"
            className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-950 px-3 sm:px-4 py-2 rounded-xl text-sm text-slate-400 w-full sm:w-72 max-w-[280px] transition-all duration-200 shadow-inner group hover:shadow-lg hover:shadow-indigo-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
          >
            <Search
              size={16}
              className="text-slate-500 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-200 shrink-0"
            />

            <span className="flex-1 text-left truncate">
              Search workspace...
            </span>

            <kbd className="hidden sm:inline-block bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-400 font-mono whitespace-nowrap">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">

          {/* Favorites */}
          <button
            onClick={() => toggleFavorite(location.pathname)}
            aria-label={isCurrentFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={isCurrentFavorite}
            className={`p-2 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 ${
              isCurrentFavorite
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/15'
                : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/30'
            }`}
            title={isCurrentFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star
              size={18}
              className={`transition-all duration-200 ${
                isCurrentFavorite
                  ? 'fill-amber-400 scale-110'
                  : 'hover:rotate-12'
              }`}
            />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowSearchModal(false);
              }}
              aria-label="Notifications"
              aria-expanded={showNotifications}
              className="p-2 rounded-xl bg-slate-950/40 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 hover:bg-slate-800/70 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
              title="Notifications"
            >
              <Bell
                size={18}
                className={`transition-transform duration-200 ${
                  showNotifications ? 'rotate-12 text-indigo-400' : ''
                }`}
              />

              {notifications.some(n => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse ring-2 ring-slate-900" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-[min(320px,calc(100vw-32px))] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">

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
                      <div
                        key={n.id}
                        className="p-3 hover:bg-slate-800/50 transition-colors duration-200"
                      >
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
            aria-label={`Open profile settings for ${user.name}`}
            className="flex items-center gap-2 sm:gap-3 pl-2 border-l border-slate-800 cursor-pointer group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 rounded-lg"
            title="Open profile settings"
          >
            <div className="relative shrink-0">
              <img
                src={avatarSource}
                alt={`${user.name}'s profile`}
                onError={() => setAvatarError(true)}
                className="w-9 h-9 rounded-full object-cover border border-slate-700 group-hover:border-emerald-400 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-emerald-500/20 transition-all duration-300"
              />

              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
            </div>

            <div className="hidden md:block">
              <span className="block text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors duration-200">
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
            aria-label={loggingOut ? 'Logging out' : 'Log out'}
            className="p-2 rounded-xl bg-slate-950/40 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/5 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
            title={loggingOut ? 'Logging out...' : 'Log out'}
          >
            <LogOut
              size={18}
              className={`transition-transform duration-200 ${
                loggingOut ? 'animate-pulse' : ''
              }`}
            />
          </button>

        </div>
      </header>

      {/* Global Search Modal */}
      {showSearchModal && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20 sm:pt-24 px-4 animate-in fade-in duration-150"
          onClick={closeSearch}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search workspace"
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >

            <div className="p-4 border-b border-slate-800 flex items-center gap-3">
              <Search size={20} className="text-indigo-400 shrink-0" />

              <input
                ref={searchInputRef}
                type="text"
                placeholder="Type a command or search workspace..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 min-w-0 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
              />

              <button
                onClick={closeSearch}
                aria-label="Close search"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200 hover:rotate-90"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-2 max-h-96 overflow-y-auto space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Quick Navigation
              </div>

              {searchResults.map(item => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    closeSearch();
                  }}
                  className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-indigo-600/10 hover:text-indigo-400 text-slate-300 text-left transition-all duration-200 group hover:translate-x-1"
                >
                  <span className="text-sm font-medium">
                    {item.title}
                  </span>

                  <span className="text-xs text-slate-500 group-hover:text-indigo-400/70 shrink-0 transition-colors">
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
