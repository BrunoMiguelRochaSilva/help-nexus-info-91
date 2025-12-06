import { useState, useEffect, useCallback } from 'react';
import type { AccessibilitySettings, FontSizeLevel, ContrastMode, ColorScheme, FontFamily } from '@/types/accessibility';
import { defaultAccessibilitySettings, STORAGE_KEY } from '@/lib/accessibility';

const scaleMap: Record<FontSizeLevel, string> = {
  'default': '1',
  'medium': '1.125',
  'large': '1.25',
  'extra-large': '1.5',
};

const fontFamilyMap: Record<FontFamily, string> = {
  'default': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  'readable': 'Georgia, "Times New Roman", serif',
  'dyslexia-friendly': '"Comic Sans MS", "OpenDyslexic", sans-serif',
};

function applySettingsToDom(settings: AccessibilitySettings) {
  const root = document.documentElement;

  // Font size - use scale multiplier
  root.style.setProperty('--accessibility-scale-multiplier', scaleMap[settings.fontSize]);

  // Line height
  root.style.setProperty('--accessibility-line-height', settings.lineHeight.toString());

  // Letter spacing
  root.style.setProperty('--accessibility-letter-spacing', `${settings.letterSpacing}px`);

  // Font family
  root.style.setProperty('--accessibility-font-family', fontFamilyMap[settings.fontFamily]);

  // Contrast mode
  root.setAttribute('data-contrast', settings.contrast);

  // Color scheme
  root.setAttribute('data-color-scheme', settings.colorScheme);

  // Grayscale filter
  if (settings.grayscale) {
    root.style.filter = 'grayscale(100%)';
  } else {
    root.style.filter = '';
  }

  // Highlight links
  root.setAttribute('data-highlight-links', settings.highlightLinks.toString());

  // Underline links
  root.setAttribute('data-underline-links', settings.underlineLinks.toString());

  // Hide images
  root.setAttribute('data-hide-images', settings.hideImages.toString());

  // Pause animations
  if (settings.pauseAnimations) {
    root.style.setProperty('--animation-duration', '0s');
    root.style.setProperty('--transition-duration', '0s');
  } else {
    root.style.removeProperty('--animation-duration');
    root.style.removeProperty('--transition-duration');
  }

  // Reading guide
  root.setAttribute('data-reading-guide', settings.readingGuide.toString());

  // Large pointer
  if (settings.largePointer) {
    root.style.cursor = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\'%3E%3Cpath d=\'M2 2l10 26 4-10 10-4z\' fill=\'black\'/%3E%3C/svg%3E"), auto';
  } else {
    root.style.cursor = '';
  }
}

function loadSettingsFromStorage(): AccessibilitySettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultAccessibilitySettings, ...parsed };
    }
  } catch (error) {
    console.error('Failed to load accessibility settings:', error);
  }
  return defaultAccessibilitySettings;
}

function saveSettingsToStorage(settings: AccessibilitySettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save accessibility settings:', error);
  }
}

export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>(loadSettingsFromStorage);

  useEffect(() => {
    applySettingsToDom(settings);
    saveSettingsToStorage(settings);
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultAccessibilitySettings);
  }, []);

  return {
    settings,
    updateSetting,
    resetSettings,
  };
}
