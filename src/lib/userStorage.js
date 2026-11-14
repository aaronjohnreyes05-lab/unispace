const LEGACY_STORAGE_KEYS = {
  ai_conversations: 'unispace_ai_conversations',
  dev_snippets: 'unispace_dev_snippets',
  documents: 'unispace_documents',
  edu_notes: 'unispace_edu_notes',
  edu_flashcards: 'unispace_edu_flashcards',
  edu_assignments: 'unispace_edu_assignments',
  tasks: 'unispace_tasks',
  roadmaps: 'unispace_roadmaps',
  favorites: 'unispace_favorites',
  accent_color: 'unispace_accent_color'
};

const MIGRATION_OWNER_KEY = 'unispace_legacy_migration_owner';

export const getUserStorageKey = (userId, key) => {
  if (!userId) {
    throw new Error('A user ID is required for account-specific storage.');
  }

  return `unispace_user_${userId}_${key}`;
};

export const getUserItem = (userId, key) => {
  if (!userId) return null;

  return localStorage.getItem(getUserStorageKey(userId, key));
};

export const setUserItem = (userId, key, value) => {
  if (!userId) {
    throw new Error('A user ID is required for account-specific storage.');
  }

  localStorage.setItem(getUserStorageKey(userId, key), value);
};

export const migrateLegacyUserData = (userId) => {
  if (!userId) {
    return { migrated: 0, skipped: true };
  }

  const migrationOwner = localStorage.getItem(MIGRATION_OWNER_KEY);

  // Never copy another account's legacy data.
  if (migrationOwner && migrationOwner !== userId) {
    return {
      migrated: 0,
      skipped: true,
      reason: 'Legacy data already belongs to another account.'
    };
  }

  let migrated = 0;
  let foundLegacyData = false;

  Object.entries(LEGACY_STORAGE_KEYS).forEach(([key, legacyKey]) => {
    const legacyValue = localStorage.getItem(legacyKey);

    if (legacyValue === null) return;

    foundLegacyData = true;

    const userKey = getUserStorageKey(userId, key);

    // Never overwrite data already saved in this account.
    if (localStorage.getItem(userKey) !== null) return;

    localStorage.setItem(userKey, legacyValue);
    migrated += 1;
  });

  // Claim the legacy data for this account only if legacy data exists.
  if (foundLegacyData && !migrationOwner) {
    localStorage.setItem(MIGRATION_OWNER_KEY, userId);
  }

  return {
    migrated,
    skipped: false
  };
};
