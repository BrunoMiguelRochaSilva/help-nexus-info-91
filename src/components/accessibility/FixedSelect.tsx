import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';

const FixedSelect = SelectPrimitive.Root;

const FixedSelectValue = SelectPrimitive.Value;

const FixedSelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ children, style, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    style={{
      display: 'flex',
      height: '40px',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: '6px',
      border: '1px solid hsl(220 13% 91%)',
      backgroundColor: 'white',
      padding: '0 12px',
      fontSize: '18px',
      color: 'hsl(222.2 47.4% 11.2%)',
      cursor: 'pointer',
      outline: 'none',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      transition: 'border-color 0.2s',
      ...style,
    }}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown style={{ height: '16px', width: '16px', opacity: 0.5 }} />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
FixedSelectTrigger.displayName = 'FixedSelectTrigger';

const FixedSelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ children, style, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position="popper"
      sideOffset={4}
      style={{
        position: 'relative',
        zIndex: 61,
        maxHeight: '384px',
        minWidth: '128px',
        overflow: 'hidden',
        borderRadius: '6px',
        border: '1px solid hsl(220 13% 91%)',
        backgroundColor: 'white',
        color: 'hsl(222.2 47.4% 11.2%)',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
        fontSize: '18px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        ...style,
      }}
      {...props}
    >
      <SelectPrimitive.Viewport
        style={{
          padding: '4px',
          width: '100%',
          minWidth: 'var(--radix-select-trigger-width)',
        }}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
FixedSelectContent.displayName = 'FixedSelectContent';

const FixedSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ children, style, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    style={{
      position: 'relative',
      display: 'flex',
      width: '100%',
      cursor: 'pointer',
      userSelect: 'none',
      alignItems: 'center',
      borderRadius: '4px',
      padding: '6px 8px 6px 32px',
      fontSize: '18px',
      outline: 'none',
      transition: 'background-color 0.2s',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      ...style,
    }}
    {...props}
  >
    <span
      style={{
        position: 'absolute',
        left: '8px',
        display: 'flex',
        height: '14px',
        width: '14px',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <SelectPrimitive.ItemIndicator>
        <Check style={{ height: '16px', width: '16px' }} />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
FixedSelectItem.displayName = 'FixedSelectItem';

export { FixedSelect, FixedSelectValue, FixedSelectTrigger, FixedSelectContent, FixedSelectItem };
