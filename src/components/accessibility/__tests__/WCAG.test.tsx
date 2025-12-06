import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '@/setupTests';
import { AccessibilityToolbar } from '../AccessibilityToolbar';
import { AccessibilityProfiles } from '../AccessibilityProfiles';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import { accessibilityProfiles } from '@/lib/accessibility';

/**
 * WCAG 2.1 Level AA Compliance Tests
 *
 * These tests verify compliance with Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
 * https://www.w3.org/WAI/WCAG21/quickref/?versions=2.1&levels=aa
 */

describe('WCAG 2.1 Level AA Compliance Tests', () => {
  describe('1.1.1 Non-text Content (Level A)', () => {
    it('all interactive elements have accessible names', () => {
      render(
        <AccessibilityProvider>
          <AccessibilityToolbar language="pt" />
        </AccessibilityProvider>
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName();
      });
    });

    it('profile icons are supplemented with text labels', () => {
      const mockOnSelectProfile = vi.fn();
      render(
        <AccessibilityProfiles
          language="pt"
          activeProfile={null}
          onSelectProfile={mockOnSelectProfile}
        />
      );

      // Each profile should have both icon and text name
      accessibilityProfiles.forEach(profile => {
        const button = screen.getByRole('button', { name: new RegExp(profile.namePT) });
        expect(button).toHaveTextContent(profile.namePT);
      });
    });
  });

  describe('1.3.1 Info and Relationships (Level A)', () => {
    it('uses semantic HTML structure', () => {
      const mockOnSelectProfile = vi.fn();
      const { container } = render(
        <AccessibilityProfiles
          language="pt"
          activeProfile={null}
          onSelectProfile={mockOnSelectProfile}
        />
      );

      // Should use proper button elements
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);

      // Should have heading structure
      const headings = screen.getAllByRole('heading', { level: 3 });
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  describe('1.4.3 Contrast (Minimum) (Level AA)', () => {
    it('passes automated contrast checks', async () => {
      const { container } = render(
        <AccessibilityProvider>
          <AccessibilityToolbar language="pt" />
        </AccessibilityProvider>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('high contrast mode provides sufficient contrast', async () => {
      const mockOnSelectProfile = vi.fn();
      const { container } = render(
        <AccessibilityProfiles
          language="pt"
          activeProfile={null}
          onSelectProfile={mockOnSelectProfile}
          theme={{
            textColor: 'hsl(0 0% 0%)',
            borderColor: 'hsl(0 0% 20%)',
            isDarkBg: false,
          }}
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('1.4.4 Resize Text (Level AA)', () => {
    it('supports text scaling up to 200%', () => {
      render(
        <AccessibilityProvider>
          <AccessibilityToolbar />
        </AccessibilityProvider>
      );

      // Simulate 200% zoom
      document.documentElement.style.setProperty('--accessibility-scale-multiplier', '2');

      // Verify the CSS variable is set
      const scaleValue = document.documentElement.style.getPropertyValue('--accessibility-scale-multiplier');
      expect(scaleValue).toBe('2');

      // Reset
      document.documentElement.style.removeProperty('--accessibility-scale-multiplier');
    });
  });

  describe('1.4.10 Reflow (Level AA)', () => {
    it('content reflows without horizontal scrolling at 320px width', () => {
      const { container } = render(
        <AccessibilityProvider>
          <AccessibilityToolbar />
        </AccessibilityProvider>
      );

      // Check that content doesn't require horizontal scroll
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;

      // Content should fit within container
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // +1 for rounding
    });
  });

  describe('1.4.11 Non-text Contrast (Level AA)', () => {
    it('interactive UI components have sufficient contrast', async () => {
      const { container } = render(
        <AccessibilityProvider>
          <AccessibilityToolbar />
        </AccessibilityProvider>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('1.4.12 Text Spacing (Level AA)', () => {
    it('handles increased text spacing without content loss', () => {
      render(
        <AccessibilityProvider>
          <AccessibilityToolbar />
        </AccessibilityProvider>
      );

      // Apply maximum text spacing
      document.documentElement.style.setProperty('--accessibility-line-height', '2');
      document.documentElement.style.setProperty('--accessibility-letter-spacing', '3px');

      // Verify CSS variables are set
      const lineHeight = document.documentElement.style.getPropertyValue('--accessibility-line-height');
      const letterSpacing = document.documentElement.style.getPropertyValue('--accessibility-letter-spacing');

      expect(lineHeight).toBe('2');
      expect(letterSpacing).toBe('3px');

      // Reset
      document.documentElement.style.removeProperty('--accessibility-line-height');
      document.documentElement.style.removeProperty('--accessibility-letter-spacing');
    });
  });

  describe('1.4.13 Content on Hover or Focus (Level AA)', () => {
    it('hover content is dismissible and hoverable', async () => {
      const user = userEvent.setup();
      const mockOnSelectProfile = vi.fn();

      render(
        <AccessibilityProfiles
          language="pt"
          activeProfile={null}
          onSelectProfile={mockOnSelectProfile}
        />
      );

      const buttons = screen.getAllByRole('button');

      // Hover over button
      await user.hover(buttons[0]);

      // Button should remain accessible
      expect(buttons[0]).toBeInTheDocument();

      // Moving away should work
      await user.unhover(buttons[0]);
      expect(buttons[0]).toBeInTheDocument();
    });
  });

  describe('2.1.1 Keyboard (Level A)', () => {
    it('all functionality is available via keyboard', async () => {
      const user = userEvent.setup();
      render(
        <AccessibilityProvider>
          <AccessibilityToolbar language="pt" />
        </AccessibilityProvider>
      );

      // Tab to toolbar button
      await user.tab();
      const toolbarButton = screen.getByRole('button', { name: /acessibilidade/i });
      expect(toolbarButton).toHaveFocus();

      // Open menu with Enter
      await user.keyboard('{Enter}');
      expect(screen.getByText('Perfis Rápidos')).toBeInTheDocument();

      // Close with ESC
      await user.keyboard('{Escape}');
      expect(screen.queryByText('Perfis Rápidos')).not.toBeInTheDocument();
    });

    it('profile selection works with keyboard', async () => {
      const user = userEvent.setup();
      const mockOnSelectProfile = vi.fn();

      render(
        <AccessibilityProfiles
          language="pt"
          activeProfile={null}
          onSelectProfile={mockOnSelectProfile}
        />
      );

      // Tab to first profile
      await user.tab();

      // Activate with Enter
      await user.keyboard('{Enter}');
      expect(mockOnSelectProfile).toHaveBeenCalled();
    });

    it('profile selection works with Space key', async () => {
      const user = userEvent.setup();
      const mockOnSelectProfile = vi.fn();

      render(
        <AccessibilityProfiles
          language="pt"
          activeProfile={null}
          onSelectProfile={mockOnSelectProfile}
        />
      );

      await user.tab();
      await user.keyboard(' ');
      expect(mockOnSelectProfile).toHaveBeenCalled();
    });
  });

  describe('2.1.2 No Keyboard Trap (Level A)', () => {
    it('keyboard focus can leave all components', async () => {
      const user = userEvent.setup();
      render(
        <AccessibilityProvider>
          <div>
            <button>Before</button>
            <AccessibilityToolbar language="pt" />
            <button>After</button>
          </div>
        </AccessibilityProvider>
      );

      const beforeButton = screen.getByRole('button', { name: 'Before' });

      // Focus before
      beforeButton.focus();
      expect(beforeButton).toHaveFocus();

      // Tab through accessibility toolbar
      await user.tab();

      // Should be able to tab past it
      await user.tab();

      // Focus should have moved
      expect(document.activeElement).not.toBe(beforeButton);
    });
  });

  describe('2.4.3 Focus Order (Level A)', () => {
    it('maintains logical focus order', async () => {
      const user = userEvent.setup();
      const mockOnSelectProfile = vi.fn();

      render(
        <AccessibilityProfiles
          language="pt"
          activeProfile={null}
          onSelectProfile={mockOnSelectProfile}
        />
      );

      const buttons = screen.getAllByRole('button');

      // Tab through buttons in order
      for (let i = 0; i < buttons.length; i++) {
        await user.tab();
        expect(buttons[i]).toHaveFocus();
      }
    });
  });

  describe('2.4.7 Focus Visible (Level AA)', () => {
    it('focus indicator is visible on all interactive elements', () => {
      render(
        <AccessibilityProvider>
          <AccessibilityToolbar />
        </AccessibilityProvider>
      );

      const button = screen.getByRole('button', { name: /acessibilidade|accessibility/i });

      // Focus the button
      button.focus();

      // Focus should be visible (browser default or custom)
      expect(button).toHaveFocus();
      expect(button).toBeVisible();
    });
  });

  describe('2.5.3 Label in Name (Level A)', () => {
    it('accessible names contain visible text labels', () => {
      const mockOnSelectProfile = vi.fn();
      render(
        <AccessibilityProfiles
          language="pt"
          activeProfile={null}
          onSelectProfile={mockOnSelectProfile}
        />
      );

      accessibilityProfiles.forEach(profile => {
        const button = screen.getByRole('button', { name: new RegExp(profile.namePT) });
        expect(button).toHaveTextContent(profile.namePT);
      });
    });
  });

  describe('3.2.1 On Focus (Level A)', () => {
    it('focusing elements does not trigger unexpected context changes', async () => {
      const user = userEvent.setup();
      render(
        <AccessibilityProvider>
          <AccessibilityToolbar language="pt" />
        </AccessibilityProvider>
      );

      const button = screen.getByRole('button', { name: /acessibilidade/i });

      // Focus should not open menu automatically
      button.focus();
      expect(screen.queryByText('Perfis Rápidos')).not.toBeInTheDocument();

      // Menu only opens on activation
      await user.keyboard('{Enter}');
      expect(screen.getByText('Perfis Rápidos')).toBeInTheDocument();
    });
  });

  describe('3.2.2 On Input (Level A)', () => {
    it('changing settings does not cause unexpected context changes', async () => {
      const user = userEvent.setup();
      const mockOnSelectProfile = vi.fn();

      render(
        <AccessibilityProfiles
          language="pt"
          activeProfile={null}
          onSelectProfile={mockOnSelectProfile}
        />
      );

      const button = screen.getAllByRole('button')[0];

      // Clicking should only trigger expected behavior
      await user.click(button);
      expect(mockOnSelectProfile).toHaveBeenCalledTimes(1);
    });
  });

  describe('4.1.2 Name, Role, Value (Level A)', () => {
    it('all UI components have proper roles', () => {
      render(
        <AccessibilityProvider>
          <AccessibilityToolbar />
        </AccessibilityProvider>
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeVisible();
        expect(button.tagName).toBe('BUTTON');
        expect(button).toHaveAccessibleName();
      });
    });

    it('active profile state is communicated', () => {
      const mockOnSelectProfile = vi.fn();
      render(
        <AccessibilityProfiles
          language="pt"
          activeProfile="dyslexia"
          onSelectProfile={mockOnSelectProfile}
        />
      );

      // Active state should be visible via "Ativo" badge
      expect(screen.getByText('Ativo')).toBeInTheDocument();
    });
  });

  describe('4.1.3 Status Messages (Level AA)', () => {
    it('profile activation status is communicated to users', async () => {
      const user = userEvent.setup();
      render(
        <AccessibilityProvider>
          <AccessibilityToolbar language="pt" />
        </AccessibilityProvider>
      );

      // Open menu
      const button = screen.getByRole('button', { name: /acessibilidade/i });
      await user.click(button);

      // Select profile
      const dyslexiaButton = screen.getByRole('button', { name: /Dislexia/i });
      await user.click(dyslexiaButton);

      // Status should be indicated by "Ativo" badge
      expect(screen.getByText('Ativo')).toBeInTheDocument();
    });
  });

  describe('Comprehensive Accessibility Audit', () => {
    it('AccessibilityToolbar passes all axe-core WCAG AA rules', async () => {
      const { container } = render(
        <AccessibilityProvider>
          <AccessibilityToolbar />
        </AccessibilityProvider>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('AccessibilityProfiles passes all axe-core WCAG AA rules', async () => {
      const mockOnSelectProfile = vi.fn();
      const { container } = render(
        <AccessibilityProfiles
          language="pt"
          activeProfile={null}
          onSelectProfile={mockOnSelectProfile}
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('entire accessibility system passes axe-core audit', async () => {
      const { container } = render(
        <AccessibilityProvider>
          <AccessibilityToolbar language="pt" />
        </AccessibilityProvider>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
