import { accessibilityProfiles } from '@/lib/accessibility';
import type { AccessibilityProfile, AccessibilityProfileType } from '@/types/accessibility';

interface AccessibilityProfilesProps {
  language: 'pt' | 'en';
  activeProfile: AccessibilityProfileType | null;
  onSelectProfile: (profile: AccessibilityProfile) => void;
  theme?: {
    textColor: string;
    borderColor: string;
    isDarkBg: boolean;
  };
}

export function AccessibilityProfiles({ language, activeProfile, onSelectProfile, theme }: AccessibilityProfilesProps) {
  const textColor = theme?.textColor || 'hsl(222.2 47.4% 11.2%)';
  const borderColor = theme?.borderColor || 'hsl(220 13% 91%)';
  const isDarkBg = theme?.isDarkBg || false;

  const title = language === 'pt' ? 'Perfis Rápidos' : 'Quick Profiles';
  const subtitle = language === 'pt' ? 'Selecione um perfil pré-configurado' : 'Select a pre-configured profile';
  const activeBadgeText = language === 'pt' ? 'Ativo' : 'Active';

  // Get visual feature tags for each profile
  const getFeatureTags = (profile: AccessibilityProfile) => {
    const tags: string[] = [];

    if (profile.settings.fontSize && profile.settings.fontSize !== 'default') {
      tags.push(language === 'pt' ? 'Texto Grande' : 'Large Text');
    }
    if (profile.settings.contrast && profile.settings.contrast !== 'default') {
      tags.push(language === 'pt' ? 'Alto Contraste' : 'High Contrast');
    }
    if (profile.settings.fontFamily && profile.settings.fontFamily !== 'default') {
      tags.push(language === 'pt' ? 'Fonte Especial' : 'Special Font');
    }
    if (profile.settings.readingGuide) {
      tags.push(language === 'pt' ? 'Guia de Leitura' : 'Reading Guide');
    }
    if (profile.settings.largePointer) {
      tags.push(language === 'pt' ? 'Cursor Grande' : 'Large Cursor');
    }
    if (profile.settings.pauseAnimations) {
      tags.push(language === 'pt' ? 'Sem Animações' : 'No Animations');
    }
    if (profile.settings.colorScheme && profile.settings.colorScheme !== 'default') {
      tags.push(language === 'pt' ? 'Modo Escuro' : 'Dark Mode');
    }

    return tags.slice(0, 2); // Show max 2 tags to avoid overcrowding
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ marginBottom: '12px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: textColor, marginBottom: '4px' }}>
          {title}
        </h3>
        <p style={{ fontSize: '13px', color: theme?.textColor ? 'hsl(0 0% 70%)' : 'hsl(220 9% 46%)', marginBottom: 0 }}>
          {subtitle}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
        }}
      >
        {accessibilityProfiles.map((profile) => {
          const name = language === 'pt' ? profile.namePT : profile.nameEN;
          const description = language === 'pt' ? profile.descriptionPT : profile.descriptionEN;
          const icon = language === 'pt' ? profile.iconPT : profile.iconEN;
          const featureTags = getFeatureTags(profile);
          const isActive = activeProfile === profile.id;

          return (
            <button
              key={profile.id}
              onClick={() => onSelectProfile(profile)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '12px',
                backgroundColor: isActive
                  ? (isDarkBg ? 'hsl(210 100% 15%)' : 'hsl(210 100% 97%)')
                  : (isDarkBg ? 'hsl(0 0% 20%)' : 'white'),
                border: isActive
                  ? '2px solid hsl(210 100% 45%)'
                  : `1px solid ${borderColor}`,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = isDarkBg ? 'hsl(0 0% 25%)' : 'hsl(210 100% 98%)';
                  e.currentTarget.style.borderColor = 'hsl(210 100% 45%)';
                }
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = isDarkBg ? 'hsl(0 0% 20%)' : 'white';
                  e.currentTarget.style.borderColor = borderColor;
                }
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '6px', lineHeight: 1 }}>
                {icon}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', width: '100%' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: textColor }}>
                  {name}
                </div>
                {isActive && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: 'hsl(142 71% 45%)',
                      color: 'white',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {activeBadgeText}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '11px', color: theme?.textColor ? 'hsl(0 0% 70%)' : 'hsl(220 9% 46%)', lineHeight: 1.3, marginBottom: featureTags.length > 0 ? '6px' : '0' }}>
                {description}
              </div>
              {featureTags.length > 0 && (
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                  {featureTags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        fontSize: '9px',
                        fontWeight: 600,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: 'hsl(210 100% 45% / 0.15)',
                        color: 'hsl(210 100% 40%)',
                        border: '1px solid hsl(210 100% 45% / 0.3)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.3px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
