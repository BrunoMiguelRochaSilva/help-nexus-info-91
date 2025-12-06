import { X, RotateCcw } from 'lucide-react';
import { FixedButton } from './FixedButton';
import { AccessibilityControl } from './AccessibilityControl';
import { AccessibilityProfiles } from './AccessibilityProfiles';
import { accessibilityFeatures, defaultAccessibilitySettings } from '@/lib/accessibility';
import type { AccessibilitySettings, AccessibilityProfile, AccessibilityProfileType } from '@/types/accessibility';

interface AccessibilityMenuProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  activeProfile: AccessibilityProfileType | null;
  onUpdateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  onReset: () => void;
  onApplyProfile: (profileId: AccessibilityProfileType, profileSettings: Partial<AccessibilitySettings>) => void;
  language: 'pt' | 'en';
}

export function AccessibilityMenu({
  isOpen,
  onClose,
  settings,
  activeProfile,
  onUpdateSetting,
  onReset,
  onApplyProfile,
  language,
}: AccessibilityMenuProps) {
  if (!isOpen) return null;

  const title = language === 'pt' ? 'Acessibilidade' : 'Accessibility';
  const resetLabel = language === 'pt' ? 'Restaurar Padrões' : 'Reset to Defaults';
  const closeLabel = language === 'pt' ? 'Fechar (ESC)' : 'Close (ESC)';

  const handleProfileSelect = (profile: AccessibilityProfile) => {
    onApplyProfile(profile.id, profile.settings);
  };

  // Count how many settings are modified from defaults
  const modifiedCount = Object.keys(settings).filter(
    (key) => settings[key as keyof AccessibilitySettings] !== defaultAccessibilitySettings[key as keyof AccessibilitySettings]
  ).length;

  // Adapt colors based on color scheme
  const isDarkBg = settings.colorScheme === 'dark-bg';
  const bgColor = isDarkBg ? 'hsl(0 0% 15%)' : 'white';
  const textColor = isDarkBg ? 'hsl(0 0% 95%)' : 'hsl(222.2 47.4% 11.2%)';
  const borderColor = isDarkBg ? 'hsl(0 0% 30%)' : 'hsl(220 13% 91%)';
  const progressBarBg = isDarkBg ? 'hsl(0 0% 30%)' : 'hsl(240 5.9% 90%)';

  const handleWheel = (e: React.WheelEvent) => {
    // Prevent page scroll when mouse is over the menu
    e.stopPropagation();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    // Don't close if clicking on a Select dropdown (which renders in a portal outside the menu)
    const isSelectDropdown =
      target.closest('[data-radix-select-content]') !== null ||
      target.closest('[data-radix-popper-content-wrapper]') !== null;

    if (!isSelectDropdown) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop for click-outside */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 59,
          backgroundColor: 'transparent',
        }}
        onClick={handleBackdropClick}
      />

      {/* Menu */}
      <div
        className="accessibility-toolbar-menu"
        onWheel={handleWheel}
        style={{
          position: 'fixed',
          bottom: '96px',
          right: '24px',
          width: '320px',
          maxWidth: '320px',
          minWidth: '320px',
          zIndex: 60,
          backgroundColor: bgColor,
          color: textColor,
          border: `1px solid ${borderColor}`,
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
          fontSize: '16px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          pointerEvents: 'auto',
          willChange: 'auto',
          transform: 'translate3d(0, 0, 0)', // Force GPU acceleration and fixed positioning
        }}
      >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          borderBottom: `1px solid ${borderColor}`
        }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>{title}</h2>
        <FixedButton
          size="sm"
          variant="ghost"
          onClick={onClose}
          aria-label={closeLabel}
          isDarkTheme={isDarkBg}
        >
          <X style={{ width: '16px', height: '16px' }} />
        </FixedButton>
      </div>

      <div
        style={{
          height: '500px',
          maxHeight: '500px',
          overflowY: 'auto',
          padding: '16px'
        }}
      >
        {/* Accessibility Profiles */}
        <AccessibilityProfiles
          language={language}
          activeProfile={activeProfile}
          onSelectProfile={handleProfileSelect}
          theme={{
            textColor,
            borderColor,
            isDarkBg,
          }}
        />

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: borderColor, margin: '16px 0' }} />

        {/* Individual Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {accessibilityFeatures.map((feature) => (
            <AccessibilityControl
              key={feature.id}
              feature={feature}
              value={settings[feature.id]}
              onChange={(value) => onUpdateSetting(feature.id, value)}
              language={language}
              theme={{
                textColor,
                borderColor,
                progressBarBg,
                isDarkBg,
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ height: '1px', backgroundColor: borderColor }} />

      <div style={{ padding: '16px' }}>
        <FixedButton
          onClick={onReset}
          variant="outline"
          style={{
            width: '100%',
            position: 'relative',
            opacity: modifiedCount === 0 ? 0.5 : 1,
            cursor: modifiedCount === 0 ? 'not-allowed' : 'pointer'
          }}
          aria-label={`${resetLabel} (${modifiedCount} ${language === 'pt' ? 'modificadas' : 'modified'})`}
          isDarkTheme={isDarkBg}
          disabled={modifiedCount === 0}
        >
          <RotateCcw style={{ width: '16px', height: '16px', marginRight: '8px' }} />
          {resetLabel}
          {modifiedCount > 0 && (
            <span
              style={{
                marginLeft: '8px',
                fontSize: '12px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: 'hsl(210 100% 45%)',
                color: 'white',
                minWidth: '24px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {modifiedCount}
            </span>
          )}
        </FixedButton>
      </div>
    </div>
    </>
  );
}
