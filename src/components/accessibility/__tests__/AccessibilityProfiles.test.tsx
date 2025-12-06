import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '@/setupTests';
import { AccessibilityProfiles } from '../AccessibilityProfiles';
import { accessibilityProfiles } from '@/lib/accessibility';
import type { AccessibilityProfile } from '@/types/accessibility';

describe('AccessibilityProfiles', () => {
  const mockOnSelectProfile = vi.fn();

  const defaultProps = {
    language: 'pt' as const,
    activeProfile: null,
    onSelectProfile: mockOnSelectProfile,
  };

  beforeEach(() => {
    mockOnSelectProfile.mockClear();
  });

  describe('Rendering', () => {
    it('renders all accessibility profiles', () => {
      render(<AccessibilityProfiles {...defaultProps} />);

      accessibilityProfiles.forEach((profile) => {
        const name = defaultProps.language === 'pt' ? profile.namePT : profile.nameEN;
        expect(screen.getByText(name)).toBeInTheDocument();
      });
    });

    it('renders title and subtitle in Portuguese', () => {
      render(<AccessibilityProfiles {...defaultProps} language="pt" />);

      expect(screen.getByText('Perfis Rápidos')).toBeInTheDocument();
      expect(screen.getByText('Selecione um perfil pré-configurado')).toBeInTheDocument();
    });

    it('renders title and subtitle in English', () => {
      render(<AccessibilityProfiles {...defaultProps} language="en" />);

      expect(screen.getByText('Quick Profiles')).toBeInTheDocument();
      expect(screen.getByText('Select a pre-configured profile')).toBeInTheDocument();
    });

    it('displays profile descriptions correctly', () => {
      render(<AccessibilityProfiles {...defaultProps} language="pt" />);

      const dyslexiaProfile = accessibilityProfiles.find(p => p.id === 'dyslexia');
      expect(screen.getByText(dyslexiaProfile!.descriptionPT)).toBeInTheDocument();
    });

    it('displays profile icons', () => {
      render(<AccessibilityProfiles {...defaultProps} language="pt" />);

      accessibilityProfiles.forEach((profile) => {
        const icon = defaultProps.language === 'pt' ? profile.iconPT : profile.iconEN;
        expect(screen.getByText(icon)).toBeInTheDocument();
      });
    });
  });

  describe('Active Profile Indicator', () => {
    it('shows "Ativo" badge when profile is active (Portuguese)', () => {
      render(<AccessibilityProfiles {...defaultProps} activeProfile="dyslexia" language="pt" />);

      expect(screen.getByText('Ativo')).toBeInTheDocument();
    });

    it('shows "Active" badge when profile is active (English)', () => {
      render(<AccessibilityProfiles {...defaultProps} activeProfile="dyslexia" language="en" />);

      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('does not show active badge when no profile is selected', () => {
      render(<AccessibilityProfiles {...defaultProps} activeProfile={null} />);

      expect(screen.queryByText('Ativo')).not.toBeInTheDocument();
      expect(screen.queryByText('Active')).not.toBeInTheDocument();
    });

    it('shows active badge only on the selected profile', () => {
      render(<AccessibilityProfiles {...defaultProps} activeProfile="dyslexia" language="pt" />);

      const badges = screen.queryAllByText('Ativo');
      expect(badges).toHaveLength(1);
    });
  });

  describe('User Interactions', () => {
    it('calls onSelectProfile when a profile button is clicked', async () => {
      const user = userEvent.setup();
      render(<AccessibilityProfiles {...defaultProps} />);

      const dyslexiaProfile = accessibilityProfiles.find(p => p.id === 'dyslexia')!;
      const dyslexiaButton = screen.getByRole('button', { name: new RegExp(dyslexiaProfile.namePT) });

      await user.click(dyslexiaButton);

      expect(mockOnSelectProfile).toHaveBeenCalledTimes(1);
      expect(mockOnSelectProfile).toHaveBeenCalledWith(dyslexiaProfile);
    });

    it('calls onSelectProfile with correct profile data', async () => {
      const user = userEvent.setup();
      render(<AccessibilityProfiles {...defaultProps} />);

      const lowVisionProfile = accessibilityProfiles.find(p => p.id === 'low-vision')!;
      const lowVisionButton = screen.getByRole('button', { name: new RegExp(lowVisionProfile.namePT) });

      await user.click(lowVisionButton);

      expect(mockOnSelectProfile).toHaveBeenCalledWith(lowVisionProfile);
    });

    it('allows clicking on active profile', async () => {
      const user = userEvent.setup();
      render(<AccessibilityProfiles {...defaultProps} activeProfile="dyslexia" />);

      const dyslexiaProfile = accessibilityProfiles.find(p => p.id === 'dyslexia')!;
      const dyslexiaButton = screen.getByRole('button', { name: new RegExp(dyslexiaProfile.namePT) });

      await user.click(dyslexiaButton);

      expect(mockOnSelectProfile).toHaveBeenCalledTimes(1);
    });
  });

  describe('Keyboard Navigation', () => {
    it('allows keyboard navigation through profiles', async () => {
      const user = userEvent.setup();
      render(<AccessibilityProfiles {...defaultProps} />);

      const buttons = screen.getAllByRole('button');

      // Tab to first button
      await user.tab();
      expect(buttons[0]).toHaveFocus();

      // Tab to next button
      await user.tab();
      expect(buttons[1]).toHaveFocus();
    });

    it('activates profile with Enter key', async () => {
      const user = userEvent.setup();
      render(<AccessibilityProfiles {...defaultProps} />);

      const buttons = screen.getAllByRole('button');

      await user.tab();
      await user.keyboard('{Enter}');

      expect(mockOnSelectProfile).toHaveBeenCalledTimes(1);
    });

    it('activates profile with Space key', async () => {
      const user = userEvent.setup();
      render(<AccessibilityProfiles {...defaultProps} />);

      const buttons = screen.getAllByRole('button');

      await user.tab();
      await user.keyboard(' ');

      expect(mockOnSelectProfile).toHaveBeenCalledTimes(1);
    });
  });

  describe('Feature Tags', () => {
    it('displays feature tags for profiles with settings', () => {
      render(<AccessibilityProfiles {...defaultProps} language="pt" />);

      // Dyslexia profile should show tags
      const dyslexiaButton = screen.getByRole('button', { name: /Dislexia/i });
      expect(dyslexiaButton).toBeInTheDocument();
    });

    it('limits feature tags to maximum of 2', () => {
      render(<AccessibilityProfiles {...defaultProps} language="pt" />);

      // Check that no profile shows more than 2 tags
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        const tags = button.querySelectorAll('[style*="fontSize: 9px"]');
        expect(tags.length).toBeLessThanOrEqual(2);
      });
    });
  });

  describe('Theme Support', () => {
    it('applies custom theme colors when provided', () => {
      const customTheme = {
        textColor: 'rgb(255, 0, 0)',
        borderColor: 'rgb(0, 255, 0)',
        isDarkBg: true,
      };

      render(<AccessibilityProfiles {...defaultProps} theme={customTheme} />);

      const title = screen.getByText('Perfis Rápidos');
      expect(title).toHaveStyle({ color: customTheme.textColor });
    });

    it('uses default theme when no theme is provided', () => {
      render(<AccessibilityProfiles {...defaultProps} />);

      const title = screen.getByText('Perfis Rápidos');
      expect(title).toBeInTheDocument();
    });
  });

  describe('WCAG 2.1 Level AA Compliance', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(<AccessibilityProfiles {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('all profile buttons are keyboard accessible', () => {
      render(<AccessibilityProfiles {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeVisible();
        expect(button.tagName).toBe('BUTTON');
      });
    });

    it('buttons have accessible names', () => {
      render(<AccessibilityProfiles {...defaultProps} />);

      accessibilityProfiles.forEach((profile) => {
        const name = defaultProps.language === 'pt' ? profile.namePT : profile.nameEN;
        const button = screen.getByRole('button', { name: new RegExp(name) });
        expect(button).toHaveAccessibleName();
      });
    });

    it('maintains focus visibility on all interactive elements', async () => {
      const user = userEvent.setup();
      render(<AccessibilityProfiles {...defaultProps} />);

      const buttons = screen.getAllByRole('button');

      for (const button of buttons) {
        await user.tab();
        const focusedElement = document.activeElement;
        expect(focusedElement).toBe(button);
      }
    });
  });

  describe('Bilingual Support', () => {
    it('switches all text to English when language is "en"', () => {
      render(<AccessibilityProfiles {...defaultProps} language="en" />);

      expect(screen.getByText('Quick Profiles')).toBeInTheDocument();
      expect(screen.getByText('Select a pre-configured profile')).toBeInTheDocument();

      accessibilityProfiles.forEach((profile) => {
        expect(screen.getByText(profile.nameEN)).toBeInTheDocument();
      });
    });

    it('switches all text to Portuguese when language is "pt"', () => {
      render(<AccessibilityProfiles {...defaultProps} language="pt" />);

      expect(screen.getByText('Perfis Rápidos')).toBeInTheDocument();
      expect(screen.getByText('Selecione um perfil pré-configurado')).toBeInTheDocument();

      accessibilityProfiles.forEach((profile) => {
        expect(screen.getByText(profile.namePT)).toBeInTheDocument();
      });
    });
  });

  describe('Grid Layout', () => {
    it('renders profiles in a 2-column grid', () => {
      const { container } = render(<AccessibilityProfiles {...defaultProps} />);

      const grid = container.querySelector('[style*="grid-template-columns"]');
      expect(grid).toBeInTheDocument();
    });

    it('renders all 5 profiles', () => {
      render(<AccessibilityProfiles {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(5);
    });
  });
});
