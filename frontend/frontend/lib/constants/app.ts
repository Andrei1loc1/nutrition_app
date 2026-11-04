/**
 * App constants — routing, storage keys, timeouts.
 */

export const ROUTES = {
  HOME: "/",
  JOURNAL: "/journal",
  PROFILE: "/profile",
  REPORTS: "/reports",
  VISION_AI: "/vision-ai",
  ONBOARDING: "/onboarding",
} as const;

export const STORAGE_KEYS = {
  USER: "neurosnap_user",
  TARGETS: "neurosnap_targets",
  PROFILE: "neurosnap_profile",
} as const;

export const APP_CONFIG = {
  APP_NAME: "NeuroSnap Vision",
  DEFAULT_TIMEOUT_MS: 30000,
} as const;
