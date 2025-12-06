import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AccessibilityProvider, useAccessibility } from '../AccessibilityContext';
import { defaultAccessibilitySettings, STORAGE_KEY } from '@/lib/accessibility';
import type { AccessibilitySettings } from '@/types/accessibility';

describe('AccessibilityContext', () => {
  // Clear localStorage before each test
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Provider Initialization', () => {
    it('initializes with default settings when localStorage is empty', () => {
      const { result } = renderHook(() => useAccessibility(), {
        wrapper: AccessibilityProvider,
      });

      expect(result.current.settings).toEqual(defaultAccessibilitySettings);
      expect(result.current.activeProfile).toBeNull();
    });

    it('loads settings from localStorage when available', () => {
      const savedSettings: AccessibilitySettings = {
        ...defaultAccessibilitySettings,
        fontSize: 'large',
        contrast: 'high',
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSettings));

      const { result } = renderHook(() => useAccessibility(), {
        wrapper: AccessibilityProvider,
      });

      expect(result.current.settings.fontSize).toBe('large');
      expect(result.current.settings.contrast).toBe('high');
    });

    it('uses default settings when localStorage has invalid data', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid json');

      const { result } = renderHook(() => useAccessibility(), {
        wrapper: AccessibilityProvider,
      });

      expect(result.current.settings).toEqual(defaultAccessibilitySettings);
    });
  });

  describe('updateSetting', () => {
    it('updates a single setting', () => {
      const { result } = renderHook(() => useAccessibility(), {
        wrapper: AccessibilityProvider,
      });

      act(() => {
        result.current.updateSetting('fontSize', 'large');
      });

      expect(result.current.settings.fontSize).toBe('large');
    });

    it('updates multiple settings independently', () => {
      const { result } = renderHook(() => useAccessibility(), {
        wrapper: AccessibilityProvider,
      });

      act(() => {
        result.current.updateSetting('fontSize', 'large');
      });

      act(() => {
        result.current.updateSetting('contrast', 'high');
      });

      expect(result.current.settings.fontSize).toBe('large');
      expect(result.current.settings.contrast).toBe('high');
    });

    it('clears active profile when setting is manually changed', () => {
      const { result } = renderHook(() => useAccessibility(), {
        wrapper: AccessibilityProvider,
      });

      // Apply a profile first
      act(() => {
        result.current.applyProfile('dyslexia', { fontSize: 'large', readingGuide: true });
      });

      expect(result.current.activeProfile).toBe('dyslexia');

      // Manually change a setting
      act(() => {
        result.current.updateSetting('fontSize', 'medium');
      });

      // Active profile should be cleared
      expect(result.current.activeProfile).toBeNull();
    });

    it('saves settings to localStorage', () => {
      const { result } = renderHook(() => useAccessibility(), {
        wrapper: AccessibilityProvider,
      });

      act(() => {
        result.current.updateSetting('fontSize', 'extra-large');
      });

      const saved = localStorage.getItem(STORAGE_KEY);
      expect(saved).toBeTruthy();

      const parsed = JSON.parse(saved!);
      expect(parsed.fontSize).toBe('extra-large');
    });

    it('applies settings to DOM', () => {
      const { result } = renderHook(() => useAccessibility(), {
        wrapper: AccessibilityProvider,
      });

      act(() => {
        result.current.updateSetting('fontSize', 'large');
      });

      const root = document.documentElement;
      expect(root.style.getPropertyValue('--accessibility-scale-multiplier')).toBe('1.25');
    });
  });

  describe('resetSettings', () => {
    it('resets all settings to defaults', () => {
      const { result } = renderHook(() => useAccessibility(), {
        wrapper: AccessibilityProvider,
      });

      // Change some settings
      act(() => {
        result.current.updateSetting('fontSize', 'large');
        result.current.updateSetting('contrast', 'high');
        result.current.updateSetting('readingGuide', true);
      });

      // Reset
      act(() => {
        result.current.resetSettings();
      });

      expect(result.current.settings).toEqual(defaultAccessibilitySettings);
    });

    it('sets active profile to "default" when reset', () => {
      const { result } = renderHook(() => useAccessibility(), {
        wrapper: AccessibilityProvider,
      });

      act(() => {
        result.current.applyProfile('dyslexia', { fontSize: 'large' });
      });

      expect(result.current.activeProfile).toBe('dyslexia');

      act(() => {
        result.current.resetSettings();
      });

      expect(result.current.activeProfile).toBe('default');
    });

    it('saves reset settings to localStorage', () => {
      const { result } = renderHook(() => useAccessibility(), {
        wrapper: AccessibilityProvider,
      });

      act(() => {
        result.current.updateSetting('fontSize', 'large');
      });

      act(() => {
        result.current.resetSettings();
      });

      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = JSON.parse(saved!);
      expect(parsed).toEqual(defaultAccessibilitySettings);
    });
  });

  describe('applyProfile - Mutually Exclusive Behavior', () => {
    it('applies profile settings', () => {
      const { result } = renderHook(() => useAccessibility(), {
        wrapper: AccessibilityProvider,
      });

      const profileSettings = {
        fontSize: 'large' as const,
        readingGuide: true,
        fontFamily: 'dyslexia-friendly' as const,
      };

      act(() => {
        result.current.applyProfile('dyslexia', profileSettings);
      });

      expect(result.current.settings.fontSize).toBe('large');
      expect(result.current.settings.readingGuide).toBe(true);
      expect(result.current.settings.fontFamily).toBe('dyslexia-friendly');
    });

    it('sets active profile', () => {
      const { result } = renderHook(() => useAccessibility(), {
        wrapper: AccessibilityProvider,
      });

      act(() => {
        result.current.applyProfile('dyslexia', { fontSize: 'large' });
      });

      expect(result.current.activeProfile).toBe('dyslexia');
    });

    it('resets to defaults before applying profile (mutually exclusive)', () => {
      const { result } = renderHook(() => useAccessibility(), {
        wrapper: AccessibilityProvider,
      });

      // Manually set some settings
      act(() => {
        result.current.updateSetting('fontSize', 'extra-large');
        result.current.updateSetting('contrast', 'high');
        result.current.updateSetting('grayscale', true);
      });

      expect(result.current.settings.fontSize).toBe('extra-large');
      expect(result.current.settings.contrast).toBe('high');
      expect(result.current.settings.grayscale).toBe(true);

      // Apply dyslexia profile (which only sets fontSize: large and readingGuide: true)
      act(() => {
        result.current.applyProfile('dyslexia', {
          fontSize: 'large',
          readingGuide: true,
        });
      });

      // Settings should be reset to defaults first, then profile applied
      expect(result.current.settings.fontSize).toBe('large'); // From profile
      expect(result.current.settings.readingGuide).toBe(true); // From profile
      expect(result.current.settings.contrast).toBe('default'); // Reset to default
      expect(result.current.settings.grayscale).toBe(false); // Reset to default
    });

    it('switching profiles resets previous profile settings', () => {
      const { result } = renderHook(() => useAccessibility(), {
        wrapper: AccessibilityProvider,
      });

      // Apply dyslexia profile
      act(() => {
        result.current.applyProfile('dyslexia', {
          fontSize: 'large',
          readingGuide: true,
          fontFamily: 'dyslexia-friendly',
        });
      });

      expect(result.current.settings.fontSize).toBe('large');
      expect(result.current.settings.readingGuide).toBe(true);
      expect(result.current.settings.fontFamily).toBe('dyslexia-friendly');
      expect(result.current.activeProfile).toBe('dyslexia');

      // Apply low-vision profile (different settings)
      act(() => {
        result.current.applyProfile('low-vision', {
          fontSize: 'extra-large',
          contrast: 'high',
          largePointer: true,
        });
      });

      // Only low-vision settings should be active, dyslexia settings reset
      expect(result.current.settings.fontSize).toBe('extra-large'); // From low-vision
      expect(result.current.settings.contrast).toBe('high'); // From low-vision
      expect(result.current.settings.largePointer).toBe(true); // From low-vision
      expect(result.current.settings.readingGuide).toBe(false); // Reset to default
      expect(result.current.settings.fontFamily).toBe('default'); // Reset to default
      expect(result.current.activeProfile).toBe('low-vision');
    });

    it('saves profile settings to localStorage', () => {
      const { result } = renderHook(() => useAccessibility(), {
        wrapper: AccessibilityProvider,
      });

      act(() => {
        result.current.applyProfile('dyslexia', {
          fontSize: 'large',
          readingGuide: true,
        });
      });

      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = JSON.parse(saved!);
      expect(parsed.fontSize).toBe('large');
      expect(parsed.readingGuide).toBe(true);
    });
  });

  describe('DOM Updates', () => {
    it('applies font size scale to DOM', () => {
      const { result } = renderHook(() => useAccessibility(), {
        wrapper: AccessibilityProvider,
      });

      act(() => {
        result.current.updateSetting('fontSize', 'extra-large');
      });

      const root = document.documentElement;
      expect(root.style.getPropertyValue('--accessibility-scale-multiplier')).toBe('1.5');
    });

    it('applies line height to DOM', () => {
      const { result } = renderHook(() => useAccessibility(), {
        wrapper: AccessibilityProvider,
      });

      act(() => {
        result.current.updateSetting('lineHeight', 1.8);
      });

      const root = document.documentElement;
      expect(root.style.getPropertyValue('--accessibility-line-height')).toBe('1.8');
    });

    it('applies letter spacing to DOM', () => {
      const { result } = renderHook(() => useAccessibility(), {
        wrapper: AccessibilityProvider,
      });

      act(() => {
        result.current.updateSetting('letterSpacing', 3);
      });

      const root = document.documentElement;
      expect(root.style.getPropertyValue('--accessibility-letter-spacing')).toBe('3px');
    });

    it('applies contrast mode to DOM', () => {
      const { result } = renderHook(() => useAccessibility(), {
        wrapper: AccessibilityProvider,
      });

      act(() => {
        result.current.updateSetting('contrast', 'high');
      });

      const root = document.documentElement;
      expect(root.getAttribute('data-contrast')).toBe('high');
    });

    it('applies color scheme to DOM', () => {
      const { result } = renderHook(() => useAccessibility(), {
        wrapper: AccessibilityProvider,
      });

      act(() => {
        result.current.updateSetting('colorScheme', 'dark-bg');
      });

      const root = document.documentElement;
      expect(root.getAttribute('data-color-scheme')).toBe('dark');
    });

    it('applies grayscale filter to DOM', () => {
      const { result } = renderHook(() => useAccessibility(), {
        wrapper: AccessibilityProvider,
      });

      act(() => {
        result.current.updateSetting('grayscale', true);
      });

      const root = document.documentElement;
      expect(root.style.filter).toBe('grayscale(100%)');
    });

    it('removes grayscale filter when disabled', () => {
      const { result } = renderHook(() => useAccessibility(), {
        wrapper: AccessibilityProvider,
      });

      act(() => {
        result.current.updateSetting('grayscale', true);
      });

      act(() => {
        result.current.updateSetting('grayscale', false);
      });

      const root = document.documentElement;
      expect(root.style.filter).toBe('');
    });

    it('pauses animations when enabled', () => {
      const { result } = renderHook(() => useAccessibility(), {
        wrapper: AccessibilityProvider,
      });

      act(() => {
        result.current.updateSetting('pauseAnimations', true);
      });

      const root = document.documentElement;
      expect(root.style.getPropertyValue('--animation-duration')).toBe('0s');
      expect(root.style.getPropertyValue('--transition-duration')).toBe('0s');
    });
  });

  describe('Storage Synchronization', () => {
    it('syncs settings across tabs/windows', async () => {
      const { result } = renderHook(() => useAccessibility(), {
        wrapper: AccessibilityProvider,
      });

      const newSettings: AccessibilitySettings = {
        ...defaultAccessibilitySettings,
        fontSize: 'large',
        contrast: 'high',
      };

      // Simulate storage event from another tab
      const storageEvent = new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: JSON.stringify(newSettings),
        oldValue: JSON.stringify(defaultAccessibilitySettings),
      });

      act(() => {
        window.dispatchEvent(storageEvent);
      });

      await waitFor(() => {
        expect(result.current.settings.fontSize).toBe('large');
        expect(result.current.settings.contrast).toBe('high');
      });
    });

    it('ignores storage events for other keys', async () => {
      const { result } = renderHook(() => useAccessibility(), {
        wrapper: AccessibilityProvider,
      });

      const initialSettings = { ...result.current.settings };

      const storageEvent = new StorageEvent('storage', {
        key: 'some-other-key',
        newValue: JSON.stringify({ foo: 'bar' }),
      });

      act(() => {
        window.dispatchEvent(storageEvent);
      });

      expect(result.current.settings).toEqual(initialSettings);
    });

    it('handles invalid storage event data gracefully', async () => {
      const { result } = renderHook(() => useAccessibility(), {
        wrapper: AccessibilityProvider,
      });

      const initialSettings = { ...result.current.settings };

      const storageEvent = new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: 'invalid json',
      });

      act(() => {
        window.dispatchEvent(storageEvent);
      });

      // Settings should remain unchanged
      expect(result.current.settings).toEqual(initialSettings);
    });
  });

  describe('Error Handling', () => {
    it('throws error when useAccessibility is used outside provider', () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = vi.fn();

      expect(() => {
        renderHook(() => useAccessibility());
      }).toThrow('useAccessibility must be used within an AccessibilityProvider');

      console.error = originalError;
    });
  });
});
