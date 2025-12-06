import { Accessibility } from 'lucide-react';

interface AccessibilityButtonProps {
  isOpen: boolean;
  onClick: () => void;
  language: 'pt' | 'en';
}

export function AccessibilityButton({ isOpen, onClick, language }: AccessibilityButtonProps) {
  const label = language === 'pt' ? 'Acessibilidade' : 'Accessibility';
  const ariaLabel = language === 'pt'
    ? `Menu de acessibilidade. ${isOpen ? 'Aberto' : 'Fechado'}`
    : `Accessibility menu. ${isOpen ? 'Open' : 'Closed'}`;

  return (
    <button
      onClick={onClick}
      className="accessibility-toolbar-btn"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '56px',
        height: '56px',
        minWidth: '56px',
        minHeight: '56px',
        zIndex: 60,
        borderRadius: '9999px',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
        backgroundColor: 'hsl(222.2 47.4% 11.2%)',
        color: 'hsl(210 40% 98%)',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.2s, background-color 0.2s',
        outline: 'none',
        pointerEvents: 'auto',
        willChange: 'transform',
      }}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      title={label}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <Accessibility style={{ width: '24px', height: '24px' }} />
    </button>
  );
}
