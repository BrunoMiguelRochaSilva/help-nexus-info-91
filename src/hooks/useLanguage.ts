import { useState, useEffect } from 'react';

const LANGUAGE_STORAGE_KEY = 'help-nexus-language';

export function useLanguage() {
  const [language, setLanguage] = useState<'pt' | 'en'>(() => {
    // Try to load from localStorage
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === 'pt' || stored === 'en') {
      return stored;
    }

    // Default to Portuguese
    return 'pt';
  });

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'pt' ? 'en' : 'pt');
  };

  return { language, setLanguage, toggleLanguage };
}
