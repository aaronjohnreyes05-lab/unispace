
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
  Download,
  Upload,
  Trash2,
  Save,
  Loader2,
  Camera,
  ImagePlus,
  X
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { Toast } from '../components/common/Toast';

// Extract an avatar's storage path only if it belongs to
// the current user's folder in the public avatars bucket.
const getAvatarStoragePath = (avatarUrl, userId) => {
  if (!avatarUrl || !userId) return null;

  try {
    const url = new URL(avatarUrl);
    const marker = '/storage/v1/object/public/avatars/';
    const markerIndex = url.pathname.indexOf(marker);

    if (markerIndex === -1) return null;

    const path = decodeURIComponent(
      url.pathname.slice(markerIndex + marker.length)
    );

    return path.startsWith(`${userId}/`) ? path : null;
  } catch {
    return null;
  }
};

export const Settings = () => {
  const {
    user,
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

  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  // Keep profile inputs synchronized with Supabase.
  useEffect(() => {
    setDisplayName(user.name || '');
    setRole(user.role || '');
  }, [user.name, user.role]);

  // Generate and clean up the local image preview.
  useEffect(() => {
    if (!selectedAvatar) {
      setAvatarPreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(selectedAvatar);
    setAvatarPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedAvatar]);

  // Save profile information.
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

  // Select and validate a profile picture.
  const handleAvatarSelection = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {
      showToast(
        'error',
        'Please select a JPG, PNG, or WebP image.'
      );

      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast(
        'error',
        'Profile pictures must be 5 MB or smaller.'
      );

      event.target.value = '';
      return;
    }

    setSelectedAvatar(file);
    event.target.value = '';
  };

  // Upload the selected picture and save its URL.
  const handleUploadAvatar = async () => {
    if (!user.id || !selectedAvatar) {
      showToast('error', 'Please select a profile picture first.');
      return;
    }

    const extensionByType = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp'
    };

    const extension = extensionByType[selectedAvatar.type];

    if (!extension) {
      showToast('error', 'Unsupported image format.');
      return;
    }

    const oldAvatarPath = getAvatarStoragePath(
      user.avatar,
      user.id
    );

    const newAvatarPath =
      `${user.id}/${crypto.randomUUID()}.${extension}`;

    try {
      setUploadingAvatar(true);

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(newAvatarPath, selectedAvatar, {
          cacheControl: '3600',
          upsert: false,
          contentType: selectedAvatar.type
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(newAvatarPath);

      const imageUrl = data.publicUrl;

      try {
        await updateProfile({
          avatar_url: imageUrl
        });
      } catch (profileError) {
        // Remove the newly uploaded file if the profile update fails.
        await supabase.storage
          .from('avatars')
          .remove([newAvatarPath]);

        throw profileError;
      }

      // Delete the previous image only after the new URL is saved.
      if (oldAvatarPath && oldAvatarPath !== newAvatarPath) {
        const { error: deleteError } = await supabase.storage
          .from('avatars')
          .remove([oldAvatarPath]);

        if (deleteError) {
          console.error('Old avatar cleanup error:', deleteError);
        }
      }

      setSelectedAvatar(null);

      showToast(
        'success',
        'Your profile picture has been updated successfully.'
      );
    } catch (error) {
      console.error('Avatar upload error:', error);

      showToast(
        'error',
        error.message || 'Unable to upload your profile picture.'
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Remove the current custom profile picture.
  const handleRemoveAvatar = async () => {
    if (!user.id) return;

    const confirmed = window.confirm(
      'Are you sure you want to remove your profile picture?'
    );

    if (!confirmed) return;

    const oldAvatarPath = getAvatarStoragePath(
      user.avatar,
      user.id
    );

    try {
      setUploadingAvatar(true);

      // Update the profile first.
      await updateProfile({
        avatar_url: null
      });

      // Delete the old storage object if it belongs to this user.
      if (oldAvatarPath) {
        const { error } = await supabase.storage
          .from('avatars')
          .remove([oldAvatarPath]);

        if (error) {
          console.error('Avatar deletion error:', error);

          showToast(
            'success',
            'Picture removed from your profile. Old file cleanup failed.'
          );

          return;
        }
      }

      setSelectedAvatar(null);

      showToast(
        'success',
        'Your profile picture has been removed.'
      );
    } catch (error) {
      console.error('Avatar removal error:', error);

      showToast(
        'error',
        error.message || 'Unable to remove your profile picture.'
      );
    } finally {
      setUploadingAvatar(false);
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

  const hasCustomAvatar =
    user.avatar && !user.avatar.includes('ui-avatars.com');

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">

      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3">
          <SettingsIcon className="text-indigo-400" size={26} />
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>

        <p className="text-sm text-slate-400 mt-2">
          Manage your profile and workspace data.
        </p>
      </div>

      {/* Profile Settings */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">

        <div className="flex items-center gap-3">
          <User className="text-indigo-400" size={20} />
          <h2 className="font-semibold text-white">Profile Settings</h2>
        </div>

        {/* Profile Picture */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 border-b border-slate-800 pb-6">

          <div className="relative w-28 h-28 shrink-0">
            <img
              src={avatarPreview || user.avatar}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-2 border-slate-700 bg-slate-800"
            />

            <div className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-indigo-600 border-4 border-slate-900 flex items-center justify-center">
              <Camera size={15} className="text-white" />
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-white font-medium">
                Profile Picture
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Upload a personal photo to represent your UniSpace account.
                JPG, PNG, or WebP. Maximum size: 5 MB.
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarSelection}
              disabled={uploadingAvatar}
            />

            <div className="flex flex-wrap gap-2">

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium disabled:opacity-50 transition-colors"
              >
                <ImagePlus size={16} />
                Choose Photo
              </button>

              {selectedAvatar && (
                <>
                  <button
                    type="button"
                    onClick={handleUploadAvatar}
                    disabled={uploadingAvatar}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium disabled:opacity-50 transition-colors"
                  >
                    {uploadingAvatar ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Upload size={16} />
                    )}

                    {uploadingAvatar ? 'Uploading...' : 'Save Photo'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedAvatar(null)}
                    disabled={uploadingAvatar}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm disabled:opacity-50 transition-colors"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </>
              )}

              {!selectedAvatar && hasCustomAvatar && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={uploadingAvatar}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm disabled:opacity-50 transition-colors"
                >
                  <Trash2 size={16} />
                  Remove Photo
                </button>
              )}

            </div>
          </div>
        </div>

        {/* Profile Information */}
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
          in your browser. Profile information and profile picture URLs
          are stored in Supabase. Workspace cloud synchronization and
          server-side backups are not yet implemented. Clearing browser
          storage may permanently remove local workspace data.
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
