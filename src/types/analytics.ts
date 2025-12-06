import type { AccessibilityProfileType } from './accessibility';

export interface ProfileUsageStats {
  profileId: AccessibilityProfileType;
  totalActivations: number;
  totalTimeMs: number; // Total time this profile has been active
  lastUsed: number; // Timestamp
}

export interface FeatureUsageStats {
  featureId: string;
  enabledCount: number;
  disabledCount: number;
  lastToggled: number; // Timestamp
}

export interface AccessibilityAnalytics {
  profiles: Record<AccessibilityProfileType, ProfileUsageStats>;
  features: Record<string, FeatureUsageStats>;
  sessionStart: number; // When current session started
  totalSessions: number;
  lastUpdated: number;
}

export const ANALYTICS_STORAGE_KEY = 'help-nexus-accessibility-analytics';

export function getDefaultAnalytics(): AccessibilityAnalytics {
  const now = Date.now();
  return {
    profiles: {
      'default': {
        profileId: 'default',
        totalActivations: 0,
        totalTimeMs: 0,
        lastUsed: 0,
      },
      'dyslexia': {
        profileId: 'dyslexia',
        totalActivations: 0,
        totalTimeMs: 0,
        lastUsed: 0,
      },
      'low-vision': {
        profileId: 'low-vision',
        totalActivations: 0,
        totalTimeMs: 0,
        lastUsed: 0,
      },
      'motor-impairment': {
        profileId: 'motor-impairment',
        totalActivations: 0,
        totalTimeMs: 0,
        lastUsed: 0,
      },
      'photosensitive': {
        profileId: 'photosensitive',
        totalActivations: 0,
        totalTimeMs: 0,
        lastUsed: 0,
      },
    },
    features: {},
    sessionStart: now,
    totalSessions: 0,
    lastUpdated: now,
  };
}
