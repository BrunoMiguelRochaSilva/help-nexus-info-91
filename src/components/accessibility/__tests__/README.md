# Accessibility Testing Suite

This directory contains comprehensive automated tests for the accessibility features of the application.

## Test Coverage

### 1. AccessibilityProfiles.test.tsx
Tests the Quick Profiles component with 27 test cases:
- **Rendering**: Verifies all 5 profiles render correctly in both Portuguese and English
- **Active Profile Indicator**: Tests the "Ativo/Active" badge functionality
- **User Interactions**: Click and keyboard interactions for profile selection
- **Keyboard Navigation**: Tab, Enter, and Space key support
- **Feature Tags**: Visual indicators for profile features
- **Theme Support**: Custom theme color application
- **WCAG 2.1 Level AA Compliance**: Automated accessibility audits
- **Bilingual Support**: Portuguese/English language switching
- **Grid Layout**: 2-column responsive layout

### 2. AccessibilityToolbar.test.tsx
Tests the main toolbar component with 22 test cases:
- **Rendering**: Toolbar button visibility and labels
- **Menu Toggle**: Open/close functionality via click and keyboard
- **Keyboard Navigation**: Full keyboard support including ESC to close
- **Profile Selection**: Integration with profile system
- **Settings Persistence**: State management across menu toggles
- **WCAG 2.1 Level AA Compliance**: Accessibility audits
- **Language Switching**: Portuguese/English support
- **Context Integration**: Proper integration with AccessibilityContext

### 3. AccessibilityContext.test.tsx
Tests the global accessibility state management with 28 test cases:
- **Provider Initialization**: Default settings and localStorage loading
- **updateSetting**: Individual setting updates
- **resetSettings**: Resetting to defaults
- **applyProfile**: Mutually exclusive profile application
- **DOM Updates**: CSS variable and attribute updates
- **Storage Synchronization**: Cross-tab/window synchronization
- **Error Handling**: Graceful error handling for invalid data

### 4. WCAG.test.tsx
Comprehensive WCAG 2.1 Level AA compliance tests with 25 test cases covering:

#### Perceivable (Principle 1)
- **1.1.1 Non-text Content**: Accessible names for all elements
- **1.3.1 Info and Relationships**: Semantic HTML structure
- **1.4.3 Contrast (Minimum)**: Color contrast ratios
- **1.4.4 Resize Text**: Text scaling up to 200%
- **1.4.10 Reflow**: No horizontal scrolling at 320px
- **1.4.11 Non-text Contrast**: UI component contrast
- **1.4.12 Text Spacing**: Handles increased spacing
- **1.4.13 Content on Hover or Focus**: Dismissible hover content

#### Operable (Principle 2)
- **2.1.1 Keyboard**: Full keyboard accessibility
- **2.1.2 No Keyboard Trap**: Focus can move freely
- **2.4.3 Focus Order**: Logical tab order
- **2.4.7 Focus Visible**: Visible focus indicators
- **2.5.3 Label in Name**: Visible labels match accessible names

#### Understandable (Principle 3)
- **3.2.1 On Focus**: No unexpected context changes on focus
- **3.2.2 On Input**: No unexpected changes on input

#### Robust (Principle 4)
- **4.1.2 Name, Role, Value**: Proper ARIA roles and states
- **4.1.3 Status Messages**: Status communication

#### Comprehensive Audits
- Full axe-core WCAG AA automated testing
- All components pass accessibility validation

## Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test AccessibilityProfiles.test.tsx
```

## Test Results

✅ **102/102 tests passing** (100% pass rate)

- 4 test files
- 28 AccessibilityContext tests
- 27 AccessibilityProfiles tests
- 22 AccessibilityToolbar tests
- 25 WCAG compliance tests

## Technologies Used

- **Vitest**: Fast unit test framework
- **@testing-library/react**: React component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **axe-core**: Automated accessibility testing engine
- **jest-axe**: Vitest integration for axe-core
- **jsdom**: DOM implementation for Node.js

## Key Features Tested

### Mutually Exclusive Profiles
Tests verify that when a new profile is selected, the previous profile's settings are completely reset before applying the new profile. This ensures profiles don't accumulate settings.

### Keyboard Accessibility
- All interactive elements are keyboard accessible
- Tab order is logical
- ESC closes menus
- Enter/Space activate buttons
- No keyboard traps

### WCAG 2.1 Level AA Compliance
All components pass automated accessibility audits for:
- Color contrast
- Keyboard navigation
- Screen reader support
- Focus management
- ARIA attributes

### Cross-browser Compatibility
Tests verify proper behavior across different DOM environments and ensure features degrade gracefully.

### Bilingual Support
All tests run for both Portuguese and English to ensure internationalization works correctly.

## Expected Console Output

Some tests intentionally trigger error handling code, which may log to console.error. This is expected behavior for:
- Invalid localStorage data tests
- Invalid storage event tests
- Provider error boundary tests

These errors are caught and handled gracefully in the production code.
