import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [accentColor, setAccentColor] = useState('indigo');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('unispace_user');
    return saved ? JSON.parse(saved) : {
      name: 'Alex Morgan',
      email: 'alex.morgan@workspace.local',
      role: 'Full Stack Developer & Student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      storageUsed: '1.4 GB',
      storageLimit: '10 GB'
    };
  });

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Welcome to UniSpace!', message: 'Your local frontend workspace is active and persisting data.', time: 'Just now', read: false },
    { id: 2, title: 'Roadmap Progress', message: 'You completed 3 nodes in Frontend Development.', time: '2 hours ago', read: false }
  ]);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('unispace_favorites');
    return saved ? JSON.parse(saved) : ['/roadmaps', '/ai-workspace', '/developer-tools'];
  });

  useEffect(() => {
    localStorage.setItem('unispace_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('unispace_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (path) => {
    setFavorites(prev => 
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };

  const addNotification = (title, message) => {
    const newNotif = { id: Date.now(), title, message, time: 'Just now', read: false };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const exportData = () => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('unispace_')) {
        data[key] = localStorage.getItem(key);
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unispace-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      Object.keys(data).forEach(key => {
        if (key.startsWith('unispace_')) {
          localStorage.setItem(key, data[key]);
        }
      });
      window.location.reload();
    } catch (e) {
      console.error('Invalid backup file', e);
      alert('Failed to import data. Invalid format.');
    }
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all local application data? This cannot be undone.')) {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('unispace_')) {
          localStorage.removeItem(key);
        }
      });
      window.location.reload();
    }
  };

  return (
    <AppContext.Provider value={{
      sidebarCollapsed,
      setSidebarCollapsed,
      accentColor,
      setAccentColor,
      user,
      setUser,
      notifications,
      setNotifications,
      favorites,
      toggleFavorite,
      addNotification,
      exportData,
      importData,
      clearAllData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);