import { useState, useEffect } from 'react';
import { AccessibilityButton } from './AccessibilityButton';
import { AccessibilityMenu } from './AccessibilityMenu';
import { useAccessibility } from '@/contexts/AccessibilityContext';

interface AccessibilityToolbarProps {
  language?: 'pt' | 'en';
}

export function AccessibilityToolbar({ language = 'pt' }: AccessibilityToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, activeProfile, updateSetting, resetSettings, applyProfile } = useAccessibility();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC to close menu
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <AccessibilityButton
        isOpen={isOpen}
        onClick={() => setIsOpen(prev => !prev)}
        language={language}
      />
      <AccessibilityMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        settings={settings}
        activeProfile={activeProfile}
        onUpdateSetting={updateSetting}
        onReset={resetSettings}
        onApplyProfile={applyProfile}
        language={language}
      />
    </>
  );
}
