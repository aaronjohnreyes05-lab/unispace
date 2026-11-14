
import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (authUser) => {
    if (!authUser) {
      setProfile(null);
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (error) {
      console.error('Profile loading error:', error);
      throw error;
    }

    setProfile(data);
    return data;
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (!mounted) return;

        setSession(data.session);
        setUser(data.session?.user ?? null);

        if (data.session?.user) {
          await loadProfile(data.session.user);
        }
      } catch (error) {
        console.error('Authentication initialization error:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!mounted) return;

      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (!newSession?.user) {
        setProfile(null);
      } else if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        // Load profile outside the auth callback.
        setTimeout(() => {
          if (mounted) {
            loadProfile(newSession.user).catch(console.error);
          }
        }, 0);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const register = async ({ name, email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'Student'
        }
      }
    });

    if (error) throw error;

    return data;
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    if (data.user) {
      await loadProfile(data.user);
    }

    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    setSession(null);
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates) => {
    if (!user) {
      throw new Error('You must be logged in to update your profile.');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;

    setProfile(data);

    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        register,
        login,
        logout,
        updateProfile,
        refreshProfile: () => loadProfile(user)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
};
