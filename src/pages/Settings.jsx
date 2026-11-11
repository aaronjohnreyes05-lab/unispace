
import React, { useRef, useState, useCallback } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Database,
  Palette,
  Download,
  Upload,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Toast } from '../components/common/Toast';

export const Settings = () => {
  const {
    user,
    setUser,
    accentColor,
    setAccentColor,
    exportData,
    importData,
    clearAllData
  } = useApp();

  const fileInputRef = useRef(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

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

  const updateUser = (field, value) => {
    setUser(previous => ({
      ...previous,
      [field]: value
    }));
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
              value={user.name || ''}
              onChange={event => updateUser('name', event.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Email Address</label>
            <input
              type="email"
              className={inputClass}
              value={user.email || ''}
              onChange={event => updateUser('email', event.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Role / Occupation</label>
            <input
              className={inputClass}
              value={user.role || ''}
              onChange={event => updateUser('role', event.target.value)}
            />
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Profile changes are saved automatically in your browser.
        </p>
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
            This preference is stored in the current application state.
            Applying it throughout the interface will be implemented separately.
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
          UniSpace currently stores supported data locally in your browser.
          It does not provide cloud synchronization or server-side backup.
          Clearing browser storage may permanently remove your local data.
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
