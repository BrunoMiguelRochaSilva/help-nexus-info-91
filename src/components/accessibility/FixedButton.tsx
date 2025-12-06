import * as React from 'react';

interface FixedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm';
  children: React.ReactNode;
  isDarkTheme?: boolean;
}

export const FixedButton = React.forwardRef<HTMLButtonElement, FixedButtonProps>(
  ({ variant = 'default', size = 'default', children, style, disabled, isDarkTheme = false, ...props }, ref) => {
    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'nowrap',
      borderRadius: '6px',
      fontSize: '18px',
      fontWeight: 500,
      transition: 'background-color 0.2s, border-color 0.2s, color 0.2s, opacity 0.2s',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      pointerEvents: disabled ? 'none' : 'auto',
      border: 'none',
      outline: 'none',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    };

    const sizeStyles: React.CSSProperties = size === 'sm'
      ? { height: '36px', padding: '0 12px' }
      : { height: '40px', padding: '0 16px' };

    const variantStyles: React.CSSProperties =
      variant === 'outline'
        ? {
            backgroundColor: 'transparent',
            border: isDarkTheme ? '1px solid hsl(0 0% 30%)' : '1px solid hsl(220 13% 91%)',
            color: isDarkTheme ? 'hsl(0 0% 95%)' : 'hsl(222.2 47.4% 11.2%)',
          }
        : variant === 'ghost'
        ? {
            backgroundColor: 'transparent',
            color: isDarkTheme ? 'hsl(0 0% 95%)' : 'hsl(222.2 47.4% 11.2%)',
          }
        : {
            backgroundColor: isDarkTheme ? 'hsl(0 0% 25%)' : 'hsl(222.2 47.4% 11.2%)',
            color: 'hsl(210 40% 98%)',
          };

    const hoverStyles = !disabled ? {
      ':hover': variant === 'outline'
        ? { backgroundColor: 'hsl(220 13% 95%)' }
        : variant === 'ghost'
        ? { backgroundColor: 'hsl(220 13% 95%)' }
        : { backgroundColor: 'hsl(222.2 47.4% 20%)' }
    } : {};

    return (
      <button
        ref={ref}
        style={{
          ...baseStyles,
          ...sizeStyles,
          ...variantStyles,
          ...style,
        }}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

FixedButton.displayName = 'FixedButton';
