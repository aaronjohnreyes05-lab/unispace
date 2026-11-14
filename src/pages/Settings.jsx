
import React, {
  useRef,
  useState,
  useCallback,
  useEffect
} from 'react';

import {
  Settings as SettingsIcon,
  User,
  Database,
  Palette,
  Download,
  Upload,
  Trash2,
  Save,
  Loader2
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import { Toast } from '../components/common/Toast';

export const Settings = () => {
  const {
    user,
    accentColor,
    setAccentColor,
    exportData,
    importData,
    clearAllData,
    updateProfile
  } = useApp();

  const fileInputRef = useRef(null);

  const [toast, setToast] = useState(null);
  const [displayName, setDisplayName] = useState(user.name || '');
  const [role, setRole] = useState(user.role || '');
  const [savingProfile, setSavingProfile] = useState(false);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  // Keep the form synchronized with the authenticated profile.
  useEffect(() => {
    setDisplayName(user.name || '');
    setRole(user.role || '');
  }, [user.name, user.role]);

  // Save profile information to Supabase.
  const handleSaveProfile = async () => {
    const trimmedName = displayName.trim();
    const trimmedRole = role.trim();

    if (trimmedName.length < 2) {
      showToast('error', 'Display name must contain at least 2 characters.');
      return;
    }

    if (!trimmedRole) {
      showToast('error', 'Please enter your role or occupation.');
      return;
    }

    try {
      setSavingProfile(true);

      await updateProfile({
        name: trimmedName,
        role: trimmedRole
      });

      showToast('success', 'Your profile has been updated successfully.');
    } catch (error) {
      console.error('Profile update error:', error);

      showToast(
        'error',
        error.message || 'Unable to update your profile.'
      );
    } finally {
      setSavingProfile(false);
    }
  };

  // Import an existing JSON backup.
  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.json')) {
      showToast('error', 'Please select a JSON backup file.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        try {
          const parsedData = JSON.parse(reader.result);

          if (
            !parsedData ||
            typeof parsedData !== 'object' ||
            Array.isArray(parsedData)
          ) {
            throw new Error('Invalid backup format.');
          }

          const hasWorkspaceData = Object.keys(parsedData).some(
            key => key.startsWith('unispace_')
          );

          if (!hasWorkspaceData) {
            throw new Error('No UniSpace backup data found.');
          }

          importData(reader.result);
        } catch (error) {
          showToast('error', error.message || 'Invalid backup file.');
        }
      }
    };

    reader.onerror = () => {
      showToast('error', 'Unable to read the selected backup file.');
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  const handleExport = () => {
    exportData();
    showToast('success', 'Backup export started.');
  };

  const inputClass =
    'w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500';

  const labelClass =
    'block text-xs font-medium text-slate-400 mb-2';

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">

      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3">
          <SettingsIcon className="text-indigo-400" size={26} />
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>

        <p className="text-sm text-slate-400 mt-2">
          Manage your profile, appearance, and locally stored workspace data.
        </p>
      </div>

      {/* Profile Settings */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">

        <div className="flex items-center gap-3">
          <User className="text-indigo-400" size={20} />
          <h2 className="font-semibold text-white">Profile Settings</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <label className={labelClass}>Display Name</label>

            <input
              className={inputClass}
              value={displayName}
              onChange={event => setDisplayName(event.target.value)}
              placeholder="Enter your display name"
              maxLength={80}
              disabled={savingProfile}
            />
          </div>

          <div>
            <label className={labelClass}>Email Address</label>

            <input
              type="email"
              className={`${inputClass} opacity-60 cursor-not-allowed`}
              value={user.email || ''}
              readOnly
              disabled
            />

            <p className="text-[11px] text-slate-500 mt-2">
              Your email is managed by Supabase authentication.
            </p>
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Role / Occupation</label>

            <input
              className={inputClass}
              value={role}
              onChange={event => setRole(event.target.value)}
              placeholder="Example: Student, Developer"
              maxLength={60}
              disabled={savingProfile}
            />
          </div>

        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-5">

          <p className="text-xs text-slate-500">
            Profile information is saved to your UniSpace account.
          </p>

          <button
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
          >
            {savingProfile ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Profile
              </>
            )}
          </button>

        </div>
      </section>

      {/* Appearance */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">

        <div className="flex items-center gap-3">
          <Palette className="text-cyan-400" size={20} />
          <h2 className="font-semibold text-white">Appearance</h2>
        </div>

        <div>
          <label className={labelClass}>Accent Color Preference</label>

          <select
            className={inputClass}
            value={accentColor}
            onChange={event => setAccentColor(event.target.value)}
          >
            <option value="indigo">Indigo</option>
            <option value="cyan">Cyan</option>
            <option value="emerald">Emerald</option>
            <option value="violet">Violet</option>
            <option value="amber">Amber</option>
          </select>

          <p className="text-xs text-slate-500 mt-2">
            Accent color selection is available. Applying it consistently
            throughout the interface will be handled in the Appearance stage.
          </p>
        </div>
      </section>

      {/* Data Management */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">

        <div className="flex items-center gap-3">
          <Database className="text-emerald-400" size={20} />
          <h2 className="font-semibold text-white">Data Management</h2>
        </div>

        <p className="text-sm text-slate-400">
          Export your UniSpace browser data as a JSON backup or restore it
          from a previous backup.
        </p>

        <div className="flex flex-wrap gap-3">

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          >
            <Download size={16} />
            Export Backup
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium transition-colors"
          >
            <Upload size={16} />
            Import Backup
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleImport}
          />

        </div>

        {/* Danger Zone */}
        <div className="border-t border-slate-800 pt-5">

          <h3 className="text-sm font-semibold text-red-400 flex items-center gap-2">
            <Trash2 size={16} />
            Danger Zone
          </h3>

          <p className="text-xs text-slate-500 mt-2 mb-4">
            This permanently clears UniSpace data stored in this browser.
            Export a backup first if you need to keep it.
          </p>

          <button
            onClick={clearAllData}
            className="px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-colors"
          >
            Clear All Workspace Data
          </button>

        </div>
      </section>

      {/* Storage Information */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
        <p className="text-xs text-slate-500 leading-5">
          UniSpace currently stores supported workspace module data locally
          in your browser. Profile information is stored in Supabase.
          Workspace cloud synchronization and server-side backups are not
          yet implemented. Clearing browser storage may permanently remove
          local workspace data.
        </p>
      </section>

      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={closeToast}
        />
      )}

    </div>
  );
};
