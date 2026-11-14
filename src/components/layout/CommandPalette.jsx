
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  Map,
  Sparkles,
  BookOpen,
  Terminal,
  FileText,
  CheckSquare,
  Star,
  Settings,
  ArrowUpRight
} from 'lucide-react';

const commands = [
  { title: 'Dashboard', description: 'Open your workspace overview', path: '/dashboard', icon: LayoutDashboard },
  { title: 'Roadmap Studio', description: 'Manage your learning roadmaps', path: '/roadmaps', icon: Map },
  { title: 'AI Workspace', description: 'Open your AI conversations', path: '/ai-workspace', icon: Sparkles },
  { title: 'Education Center', description: 'Access notes and flashcards', path: '/education', icon: BookOpen },
  { title: 'Developer Tools', description: 'Open your developer utilities', path: '/developer-tools', icon: Terminal },
  { title: 'Document Studio', description: 'Manage your documents', path: '/documents', icon: FileText },
  { title: 'Productivity Hub', description: 'Manage tasks and productivity', path: '/productivity', icon: CheckSquare },
  { title: 'Favorites', description: 'View your favorite modules', path: '/favorites', icon: Star },
  { title: 'Settings', description: 'Manage your workspace settings', path: '/settings', icon: Settings }
];

export const CommandPalette = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef(null);

  const filteredCommands = commands.filter(command => {
    const searchText = `${command.title} ${command.description}`.toLowerCase();
    return searchText.includes(query.toLowerCase());
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'p') {
        event.preventDefault();
        setIsOpen(true);
      }

      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);

      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;

    const handleNavigation = (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex(index =>
          filteredCommands.length
            ? (index + 1) % filteredCommands.length
            : 0
        );
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex(index =>
          filteredCommands.length
            ? (index - 1 + filteredCommands.length) % filteredCommands.length
            : 0
        );
      }

      if (event.key === 'Enter' && filteredCommands.length > 0) {
        event.preventDefault();
        navigateToCommand(filteredCommands[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleNavigation);

    return () => {
      window.removeEventListener('keydown', handleNavigation);
    };
  }, [isOpen, filteredCommands, selectedIndex]);

  const navigateToCommand = (command) => {
    if (!command) return;

    navigate(command.path);
    setIsOpen(false);
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-start justify-center px-4 pt-[15vh] animate-in fade-in duration-150"
      onClick={() => setIsOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={event => event.stopPropagation()}
      >
        {/* Search */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-800">
          <Search size={20} className="text-indigo-400 shrink-0" />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search commands or pages..."
            className="flex-1 min-w-0 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
          />

          <kbd className="text-[10px] text-slate-500 border border-slate-700 rounded px-2 py-1">
            ESC
          </kbd>
        </div>

        {/* Commands */}
        <div className="p-2 max-h-[55vh] overflow-y-auto">
          <p className="px-3 py-2 text-[10px] uppercase tracking-wider font-semibold text-slate-500">
            Workspace Commands
          </p>

          {filteredCommands.length > 0 ? (
            filteredCommands.map((command, index) => {
              const Icon = command.icon;
              const isSelected = selectedIndex === index;

              return (
                <button
                  key={command.path}
                  onClick={() => navigateToCommand(command)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl text-left transition-all duration-150 ${
                    isSelected
                      ? 'bg-indigo-600/15 border border-indigo-500/30'
                      : 'border border-transparent hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg ${
                      isSelected
                        ? 'bg-indigo-500/20 text-indigo-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      <Icon size={17} />
                    </div>

                    <div className="min-w-0">
                      <p className={`text-sm font-medium ${
                        isSelected ? 'text-indigo-300' : 'text-slate-200'
                      }`}>
                        {command.title}
                      </p>

                      <p className="text-xs text-slate-500 truncate">
                        {command.description}
                      </p>
                    </div>
                  </div>

                  <ArrowUpRight
                    size={15}
                    className={`shrink-0 ${
                      isSelected ? 'text-indigo-400' : 'text-slate-600'
                    }`}
                  />
                </button>
              );
            })
          ) : (
            <div className="py-10 text-center">
              <Search size={24} className="mx-auto text-slate-600 mb-2" />
              <p className="text-sm text-slate-400">No commands found.</p>
              <p className="text-xs text-slate-600 mt-1">
                Try searching for another page.
              </p>
            </div>
          )}
        </div>

        {/* Keyboard shortcuts */}
        <div className="px-4 py-3 border-t border-slate-800 bg-slate-950/50 flex flex-wrap items-center gap-4 text-[10px] text-slate-500">
          <span><kbd className="border border-slate-700 rounded px-1.5 py-0.5">↑</kbd> <kbd className="border border-slate-700 rounded px-1.5 py-0.5">↓</kbd> Navigate</span>
          <span><kbd className="border border-slate-700 rounded px-1.5 py-0.5">Enter</kbd> Open</span>
          <span><kbd className="border border-slate-700 rounded px-1.5 py-0.5">Esc</kbd> Close</span>
        </div>
      </div>
    </div>
  );
};
