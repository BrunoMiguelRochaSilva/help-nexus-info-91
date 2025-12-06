export type FontSizeLevel = 'default' | 'medium' | 'large' | 'extra-large';
export type ContrastMode = 'default' | 'high' | 'inverted';
export type ColorScheme = 'default' | 'grayscale' | 'light-bg' | 'dark-bg';
export type FontFamily = 'default' | 'readable' | 'dyslexia-friendly';

export interface AccessibilitySettings {
  fontSize: FontSizeLevel;
  lineHeight: number;
  letterSpacing: number;
  fontFamily: FontFamily;
  contrast: ContrastMode;
  colorScheme: ColorScheme;
  grayscale: boolean;
  highlightLinks: boolean;
  underlineLinks: boolean;
  largePointer: boolean;
  readingGuide: boolean;
  textToSpeech: boolean;
  hideImages: boolean;
  pauseAnimations: boolean;
  enableKeyboardNav: boolean;
}

export interface AccessibilityFeature {
  id: keyof AccessibilitySettings;
  labelPT: string;
  labelEN: string;
  type: 'toggle' | 'increment' | 'select';
  options?: { value: string | number | boolean; labelPT: string; labelEN: string }[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue: string | number | boolean;
}

export type AccessibilityProfileType = 'default' | 'dyslexia' | 'low-vision' | 'motor-impairment' | 'photosensitive';

export interface AccessibilityProfile {
  id: AccessibilityProfileType;
  namePT: string;
  nameEN: string;
  descriptionPT: string;
  descriptionEN: string;
  iconPT: string;
  iconEN: string;
  settings: Partial<AccessibilitySettings>;
}
