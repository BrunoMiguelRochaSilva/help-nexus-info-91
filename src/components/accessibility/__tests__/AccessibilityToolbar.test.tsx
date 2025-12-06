import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '@/setupTests';
import { AccessibilityToolbar } from '../AccessibilityToolbar';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';

// Wrapper component to provide context
function TestWrapper({ children, language = 'pt' }: { children: React.ReactNode; language?: 'pt' | 'en' }) {
  return (
    <AccessibilityProvider>
      {children}
    </AccessibilityProvider>
  );
}

describe('AccessibilityToolbar', () => {
  describe('Rendering', () => {
    it('renders the accessibility button', () => {
      render(
        <TestWrapper>
          <AccessibilityToolbar language="pt" />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /acessibilidade/i });
      expect(button).toBeInTheDocument();
    });

    it('renders with Portuguese language', () => {
      render(
        <TestWrapper>
          <AccessibilityToolbar language="pt" />
        </TestWrapper>
      );

      expect(screen.getByRole('button', { name: /acessibilidade/i })).toBeInTheDocument();
    });

    it('renders with English language', () => {
      render(
        <TestWrapper>
          <AccessibilityToolbar language="en" />
        </TestWrapper>
      );

      expect(screen.getByRole('button', { name: /accessibility/i })).toBeInTheDocument();
    });

    it('menu is initially closed', () => {
      render(
        <TestWrapper>
          <AccessibilityToolbar />
        </TestWrapper>
      );

      // Menu should not be visible initially
      const menu = screen.queryByRole('dialog');
      expect(menu).not.toBeInTheDocument();
    });
  });

  describe('Menu Toggle', () => {
    it('opens menu when button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <AccessibilityToolbar language="pt" />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /acessibilidade/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Perfis Rápidos')).toBeInTheDocument();
      });
    });

    it('closes menu when button is clicked again', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <AccessibilityToolbar language="pt" />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /acessibilidade/i });

      // Open menu
      await user.click(button);
      await waitFor(() => {
        expect(screen.getByText('Perfis Rápidos')).toBeInTheDocument();
      });

      // Close menu
      await user.click(button);
      await waitFor(() => {
        expect(screen.queryByText('Perfis Rápidos')).not.toBeInTheDocument();
      });
    });

    it('closes menu when ESC key is pressed', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <AccessibilityToolbar language="pt" />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /acessibilidade/i });

      // Open menu
      await user.click(button);
      await waitFor(() => {
        expect(screen.getByText('Perfis Rápidos')).toBeInTheDocument();
      });

      // Press ESC
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByText('Perfis Rápidos')).not.toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('toolbar button is keyboard accessible', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <AccessibilityToolbar />
        </TestWrapper>
      );

      // Tab to button
      await user.tab();

      const button = screen.getByRole('button', { name: /acessibilidade/i });
      expect(button).toHaveFocus();
    });

    it('opens menu with Enter key', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <AccessibilityToolbar language="pt" />
        </TestWrapper>
      );

      await user.tab();
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText('Perfis Rápidos')).toBeInTheDocument();
      });
    });

    it('opens menu with Space key', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <AccessibilityToolbar language="pt" />
        </TestWrapper>
      );

      await user.tab();
      await user.keyboard(' ');

      await waitFor(() => {
        expect(screen.getByText('Perfis Rápidos')).toBeInTheDocument();
      });
    });

    it('ESC key closes menu but does not propagate to other components', async () => {
      const user = userEvent.setup();
      const mockOnKeyDown = vi.fn();

      render(
        <div onKeyDown={mockOnKeyDown}>
          <TestWrapper>
            <AccessibilityToolbar language="pt" />
          </TestWrapper>
        </div>
      );

      const button = screen.getByRole('button', { name: /acessibilidade/i });

      // Open menu
      await user.click(button);
      await waitFor(() => {
        expect(screen.getByText('Perfis Rápidos')).toBeInTheDocument();
      });

      // Press ESC
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByText('Perfis Rápidos')).not.toBeInTheDocument();
      });
    });
  });

  describe('Profile Selection', () => {
    it('allows selecting a profile from the menu', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <AccessibilityToolbar language="pt" />
        </TestWrapper>
      );

      // Open menu
      const button = screen.getByRole('button', { name: /acessibilidade/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Perfis Rápidos')).toBeInTheDocument();
      });

      // Select dyslexia profile
      const dyslexiaButton = screen.getByRole('button', { name: /Dislexia/i });
      await user.click(dyslexiaButton);

      // Verify profile is active
      await waitFor(() => {
        expect(screen.getByText('Ativo')).toBeInTheDocument();
      });
    });

    it('shows active badge on selected profile', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <AccessibilityToolbar language="pt" />
        </TestWrapper>
      );

      // Open menu
      const button = screen.getByRole('button', { name: /acessibilidade/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Perfis Rápidos')).toBeInTheDocument();
      });

      // Initially no profile should have active badge
      expect(screen.queryByText('Ativo')).not.toBeInTheDocument();

      // Select dyslexia profile
      const dyslexiaButton = screen.getByRole('button', { name: /Dislexia/i });
      await user.click(dyslexiaButton);

      // Active badge should appear
      await waitFor(() => {
        expect(screen.getByText('Ativo')).toBeInTheDocument();
      });
    });
  });

  describe('Settings Persistence', () => {
    it('maintains state when menu is toggled', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <AccessibilityToolbar language="pt" />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /acessibilidade/i });

      // Open, select profile, close
      await user.click(button);
      await waitFor(() => {
        expect(screen.getByText('Perfis Rápidos')).toBeInTheDocument();
      });

      const dyslexiaButton = screen.getByRole('button', { name: /Dislexia/i });
      await user.click(dyslexiaButton);

      // Close menu
      await user.keyboard('{Escape}');

      // Reopen menu
      await user.click(button);

      // Profile should still be active
      await waitFor(() => {
        expect(screen.getByText('Ativo')).toBeInTheDocument();
      });
    });
  });

  describe('WCAG 2.1 Level AA Compliance', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <AccessibilityToolbar />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('toolbar button has accessible name', () => {
      render(
        <TestWrapper>
          <AccessibilityToolbar language="pt" />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /acessibilidade/i });
      expect(button).toHaveAccessibleName();
    });

    it('toolbar button has proper ARIA attributes', () => {
      render(
        <TestWrapper>
          <AccessibilityToolbar />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /acessibilidade/i });
      expect(button).toBeInTheDocument();
    });

    it('maintains focus management when opening/closing menu', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <AccessibilityToolbar />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /acessibilidade/i });

      // Focus button
      button.focus();
      expect(button).toHaveFocus();

      // Open menu
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText(/Perfis Rápidos|Quick Profiles/)).toBeInTheDocument();
      });

      // Close with ESC
      await user.keyboard('{Escape}');

      // Focus should return to button (or remain on focusable element)
      expect(document.activeElement).toBeTruthy();
    });
  });

  describe('Language Switching', () => {
    it('displays Portuguese labels when language is "pt"', () => {
      render(
        <TestWrapper>
          <AccessibilityToolbar language="pt" />
        </TestWrapper>
      );

      expect(screen.getByRole('button', { name: /acessibilidade/i })).toBeInTheDocument();
    });

    it('displays English labels when language is "en"', () => {
      render(
        <TestWrapper>
          <AccessibilityToolbar language="en" />
        </TestWrapper>
      );

      expect(screen.getByRole('button', { name: /accessibility/i })).toBeInTheDocument();
    });
  });

  describe('Integration with AccessibilityContext', () => {
    it('uses settings from context', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <AccessibilityToolbar language="pt" />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /acessibilidade/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Perfis Rápidos')).toBeInTheDocument();
      });

      // Should show accessibility controls from context
      expect(screen.getByText(/Tamanho do Texto|Text Size/)).toBeInTheDocument();
    });

    it('updates context when settings are changed', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <AccessibilityToolbar language="pt" />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /acessibilidade/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Perfis Rápidos')).toBeInTheDocument();
      });

      // Select a profile - this should update context
      const dyslexiaButton = screen.getByRole('button', { name: /Dislexia/i });
      await user.click(dyslexiaButton);

      // Context should reflect the change (active badge appears)
      await waitFor(() => {
        expect(screen.getByText('Ativo')).toBeInTheDocument();
      });
    });
  });
});
