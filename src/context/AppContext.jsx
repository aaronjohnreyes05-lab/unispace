
import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import { useAuth } from './AuthContext';
import {
  getUserItem,
  setUserItem,
  migrateLegacyUserData
} from '../lib/userStorage';

const AppContext = createContext();

const guestUser = {
  id: null,
  name: 'Guest',
  email: '',
  role: 'Visitor',
  avatar: 'https://ui-avatars.com/api/?name=Guest&background=1e293b&color=fff',
  storageUsed: '1.4 GB',
  storageLimit: '10 GB'
};

const defaultFavorites = [
  '/roadmaps',
  '/ai-workspace',
  '/developer-tools'
];

const validAccentColors = [
  'indigo',
  'cyan',
  'emerald',
  'violet',
  'amber'
];

const isValidAccentColor = (color) =>
  validAccentColors.includes(color);

export const AppProvider = ({ children }) => {
  const {
    user: authUser,
    profile,
    loading: authLoading,
    updateProfile
  } = useAuth();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [accentColor, setAccentColor] = useState('indigo');
  const [user, setUserState] = useState(guestUser);

  const [storageUserId, setStorageUserId] = useState(null);

  const storageReady = authUser
    ? storageUserId === authUser.id
    : storageUserId === null;

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Welcome to UniSpace!',
      message: 'Your workspace is ready.',
      time: 'Just now',
      read: false
    },
    {
      id: 2,
      title: 'Roadmap Progress',
      message: 'You completed 3 nodes in Frontend Development.',
      time: '2 hours ago',
      read: false
    }
  ]);

  const [favorites, setFavorites] = useState(defaultFavorites);

  // Load and migrate data for the currently signed-in account.
  useEffect(() => {
    if (authLoading) return;

    if (!authUser) {
      setUserState(guestUser);
      setFavorites(defaultFavorites);
      setAccentColor('indigo');
      setStorageUserId(null);
      return;
    }

    const loadAccountData = () => {
      try {
        const migration = migrateLegacyUserData(authUser.id);

        if (migration.migrated > 0) {
          console.info(
            `Migrated ${migration.migrated} UniSpace data items into this account.`
          );
        }

        if (migration.skipped) {
          console.info('Legacy data migration skipped:', migration.reason);
        }

        const savedFavorites = getUserItem(authUser.id, 'favorites');
        const savedAccent = getUserItem(authUser.id, 'accent_color');

        if (savedFavorites !== null) {
          try {
            const parsedFavorites = JSON.parse(savedFavorites);

            setFavorites(
              Array.isArray(parsedFavorites)
                ? parsedFavorites
                : defaultFavorites
            );
          } catch {
            setFavorites(defaultFavorites);
          }
        } else {
          setFavorites(defaultFavorites);
        }

        setAccentColor(
          isValidAccentColor(savedAccent) ? savedAccent : 'indigo'
        );
      } catch (error) {
        console.error('Account storage initialization failed:', error);
        setFavorites(defaultFavorites);
        setAccentColor('indigo');
      } finally {
        setStorageUserId(authUser.id);
      }
    };

    loadAccountData();
  }, [authUser?.id, authLoading]);

  // Build the application profile from Supabase.
  useEffect(() => {
    if (!authUser) {
      setUserState(guestUser);
      return;
    }

    setUserState({
      id: authUser.id,
      name:
        profile?.name ||
        authUser.user_metadata?.name ||
        authUser.email?.split('@')[0] ||
        'User',
      email: authUser.email || '',
      role: profile?.role || authUser.user_metadata?.role || 'Student',
      avatar:
        profile?.avatar_url ||
        authUser.user_metadata?.avatar_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          profile?.name || 'User'
        )}&background=1e293b&color=fff`,
      storageUsed: '1.4 GB',
      storageLimit: '10 GB'
    });
  }, [authUser, profile]);

  // Remove the old locally stored profile.
  useEffect(() => {
    localStorage.removeItem('unispace_user');
  }, []);

  // Keep compatibility with existing components.
  const setUser = (updater) => {
    setUserState(previous =>
      typeof updater === 'function' ? updater(previous) : updater
    );
  };

  // Apply and save the account's appearance preference.
  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accentColor);

    if (!authUser || !storageReady) return;

    try {
      setUserItem(authUser.id, 'accent_color', accentColor);
    } catch (error) {
      console.error('Unable to save appearance preference:', error);
    }
  }, [accentColor, authUser?.id, storageReady]);

  // Save favorites for the current account.
  useEffect(() => {
    if (!authUser || !storageReady) return;

    try {
      setUserItem(
        authUser.id,
        'favorites',
        JSON.stringify(favorites)
      );
    } catch (error) {
      console.error('Unable to save favorites:', error);
    }
  }, [favorites, authUser?.id, storageReady]);

  const toggleFavorite = (path) => {
    setFavorites(previous =>
      previous.includes(path)
        ? previous.filter(item => item !== path)
        : [...previous, path]
    );
  };

  const addNotification = (title, message) => {
    const newNotification = {
      id: Date.now(),
      title,
      message,
      time: 'Just now',
      read: false
    };

    setNotifications(previous => [newNotification, ...previous]);
  };

  // Export only the current account's UniSpace data.
  const exportData = () => {
    if (!authUser || !storageReady) {
      alert('Your account data is not ready to export.');
      return;
    }

    const data = {};
    const accountPrefix = `unispace_user_${authUser.id}_`;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key && key.startsWith(accountPrefix)) {
        data[key] = localStorage.getItem(key);
      }
    }

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: 'application/json' }
    );

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = `unispace-backup-${new Date().toISOString().split('T')[0]}.json`;
    anchor.click();

    URL.revokeObjectURL(url);
  };

  // Import data only into the current account's storage.
  const importData = (jsonData) => {
    if (!authUser || !storageReady) {
      alert('Your account data is not ready to import.');
      return;
    }

    try {
      const data = JSON.parse(jsonData);

      if (
        !data ||
        typeof data !== 'object' ||
        Array.isArray(data)
      ) {
        throw new Error('Invalid backup format.');
      }

      const accountPrefix = `unispace_user_${authUser.id}_`;

      Object.entries(data).forEach(([key, value]) => {
        if (
          key.startsWith(accountPrefix) &&
          typeof value === 'string'
        ) {
          localStorage.setItem(key, value);
        }
      });

      window.location.reload();
    } catch (error) {
      console.error('Invalid backup file:', error);
      alert('Failed to import data. Invalid format.');
    }
  };

  // Clear only the current account's local workspace data.
  const clearAllData = () => {
    if (!authUser || !storageReady) {
      alert('Your account data is not ready to clear.');
      return;
    }

    const confirmed = confirm(
      'Are you sure you want to clear all local UniSpace data for this account? This cannot be undone.'
    );

    if (!confirmed) return;

    const accountPrefix = `unispace_user_${authUser.id}_`;
    const keysToRemove = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key && key.startsWith(accountPrefix)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));

    window.location.reload();
  };

  return (
    <AppContext.Provider
      value={{
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
        clearAllData,
        authLoading,
        storageReady,
        updateProfile
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
