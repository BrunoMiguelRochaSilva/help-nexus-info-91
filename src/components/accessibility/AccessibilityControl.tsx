import { Plus, Minus } from 'lucide-react';
import { FixedButton } from './FixedButton';
import { Switch } from '@/components/ui/switch';
import { FixedSelect, FixedSelectContent, FixedSelectItem, FixedSelectTrigger, FixedSelectValue } from './FixedSelect';
import type { AccessibilityFeature, AccessibilitySettings } from '@/types/accessibility';

interface AccessibilityControlProps {
  feature: AccessibilityFeature;
  value: AccessibilitySettings[keyof AccessibilitySettings];
  onChange: (value: any) => void;
  language: 'pt' | 'en';
  theme?: {
    textColor: string;
    borderColor: string;
    progressBarBg: string;
    isDarkBg: boolean;
  };
}

export function AccessibilityControl({ feature, value, onChange, language, theme }: AccessibilityControlProps) {
  const label = language === 'pt' ? feature.labelPT : feature.labelEN;
  const textColor = theme?.textColor || 'hsl(222.2 47.4% 11.2%)';
  const borderColor = theme?.borderColor || 'hsl(220 13% 91%)';
  const progressBarBg = theme?.progressBarBg || 'hsl(240 5.9% 90%)';
  const isDarkBg = theme?.isDarkBg || false;

  // Check if value is different from default
  const isModified = value !== feature.defaultValue;
  const modifiedBadgeText = language === 'pt' ? 'Modificado' : 'Modified';

  if (feature.type === 'toggle') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '8px',
          paddingBottom: '8px',
          backgroundColor: isModified ? (isDarkBg ? 'hsl(210 100% 15%)' : 'hsl(210 100% 97%)') : 'transparent',
          paddingLeft: isModified ? '12px' : '0',
          paddingRight: isModified ? '12px' : '0',
          borderRadius: isModified ? '6px' : '0',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label
            htmlFor={feature.id}
            style={{ fontSize: '18px', fontWeight: 500, color: textColor }}
          >
            {label}
          </label>
          {isModified && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: 'hsl(210 100% 45%)',
                color: 'white',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {modifiedBadgeText}
            </span>
          )}
        </div>
        <Switch
          id={feature.id}
          checked={value as boolean}
          onCheckedChange={onChange}
        />
      </div>
    );
  }

  if (feature.type === 'increment') {
    const numValue = value as number;
    const canDecrease = numValue > (feature.min ?? 0);
    const canIncrease = numValue < (feature.max ?? 100);

    return (
      <div
        style={{
          paddingTop: '8px',
          paddingBottom: '8px',
          backgroundColor: isModified ? (isDarkBg ? 'hsl(210 100% 15%)' : 'hsl(210 100% 97%)') : 'transparent',
          paddingLeft: isModified ? '12px' : '0',
          paddingRight: isModified ? '12px' : '0',
          borderRadius: isModified ? '6px' : '0',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <label
            style={{
              fontSize: '18px',
              fontWeight: 500,
              color: textColor
            }}
          >
            {label}: <span style={{ fontWeight: 400 }}>{numValue.toFixed(1)}</span>
          </label>
          {isModified && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: 'hsl(210 100% 45%)',
                color: 'white',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {modifiedBadgeText}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FixedButton
            size="sm"
            variant="outline"
            onClick={() => {
              onChange(Math.max((feature.min ?? 0), numValue - (feature.step ?? 1)));
            }}
            disabled={!canDecrease}
            aria-label={language === 'pt' ? 'Diminuir' : 'Decrease'}
            isDarkTheme={isDarkBg}
          >
            <Minus style={{ width: '16px', height: '16px' }} />
          </FixedButton>
          <div
            style={{
              flex: 1,
              height: '8px',
              backgroundColor: progressBarBg,
              borderRadius: '9999px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                height: '100%',
                backgroundColor: 'hsl(210 100% 45%)',
                transition: 'width 0.2s',
                width: `${((numValue - (feature.min ?? 0)) / ((feature.max ?? 100) - (feature.min ?? 0))) * 100}%`
              }}
            />
          </div>
          <FixedButton
            size="sm"
            variant="outline"
            onClick={() => {
              onChange(Math.min((feature.max ?? 100), numValue + (feature.step ?? 1)));
            }}
            disabled={!canIncrease}
            aria-label={language === 'pt' ? 'Aumentar' : 'Increase'}
            isDarkTheme={isDarkBg}
          >
            <Plus style={{ width: '16px', height: '16px' }} />
          </FixedButton>
        </div>
      </div>
    );
  }

  if (feature.type === 'select' && feature.options) {
    return (
      <div
        style={{
          paddingTop: '8px',
          paddingBottom: '8px',
          backgroundColor: isModified ? (isDarkBg ? 'hsl(210 100% 15%)' : 'hsl(210 100% 97%)') : 'transparent',
          paddingLeft: isModified ? '12px' : '0',
          paddingRight: isModified ? '12px' : '0',
          borderRadius: isModified ? '6px' : '0',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <label
            htmlFor={feature.id}
            style={{
              fontSize: '18px',
              fontWeight: 500,
              color: textColor
            }}
          >
            {label}
          </label>
          {isModified && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: 'hsl(210 100% 45%)',
                color: 'white',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {modifiedBadgeText}
            </span>
          )}
        </div>
        <FixedSelect value={String(value)} onValueChange={onChange}>
          <FixedSelectTrigger
            id={feature.id}
            style={{
              backgroundColor: isDarkBg ? 'hsl(0 0% 20%)' : 'white',
              color: textColor,
              border: `1px solid ${borderColor}`,
            }}
          >
            <FixedSelectValue />
          </FixedSelectTrigger>
          <FixedSelectContent
            style={{
              backgroundColor: isDarkBg ? 'hsl(0 0% 15%)' : 'white',
              color: textColor,
              border: `1px solid ${borderColor}`,
            }}
          >
            {feature.options.map((option) => (
              <FixedSelectItem
                key={String(option.value)}
                value={String(option.value)}
              >
                {language === 'pt' ? option.labelPT : option.labelEN}
              </FixedSelectItem>
            ))}
          </FixedSelectContent>
        </FixedSelect>
      </div>
    );
  }

  return null;
}
