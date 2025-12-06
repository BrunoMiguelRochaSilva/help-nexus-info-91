import 'vitest';
import type { AxeResults } from 'axe-core';

declare module 'vitest' {
  interface Assertion<T = any> {
    toHaveNoViolations(): T;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}

declare module 'jest-axe' {
  export function configureAxe(options?: any): (html: Element | string) => Promise<AxeResults>;
  export function toHaveNoViolations(results: AxeResults): { pass: boolean; message: () => string };
  export function axe(html: Element | string, options?: any): Promise<AxeResults>;
}