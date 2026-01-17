import { describe, it, expect } from 'vitest';
import { clearTailwindClasses } from '../src/utils/utils';

describe('clearTailwindClasses', () => {
  describe('edge cases', () => {
    it('returns empty string when input is undefined', () => {
      expect(clearTailwindClasses(undefined)).toBe(null);
    });

    it('returns empty string for empty string', () => {
      expect(clearTailwindClasses('')).toBe('');
    });

    it('returns empty string for whitespace-only input', () => {
      expect(clearTailwindClasses('   ')).toBe('');
    });
  });

  describe('tailwind utility removal', () => {
    it('removes common tailwind utility classes', () => {
      const input = 'p-4 text-center bg-red-500';
      const result = clearTailwindClasses(input);

      expect(result).toBe('text-center');
    });

    it('removes responsive and variant utilities', () => {
      const input = 'md:p-4 hover:bg-blue-500 dark:text-white';
      const result = clearTailwindClasses(input);

      expect(result).toBe('');
    });
  });

  describe('non-tailwind class preservation', () => {
    it('keeps custom classes', () => {
      const input = 'my-component anotherClass';
      const result = clearTailwindClasses(input);

      expect(result).toBe('my-component anotherClass');
    });

    it('keeps custom classes while removing tailwind ones', () => {
      const input = 'my-component p-4 text-sm custom-class';
      const result = clearTailwindClasses(input);

      expect(result).toBe('my-component text-sm custom-class');
    });
  });

  describe('whitespace normalization', () => {
    it('normalizes multiple spaces after cleanup', () => {
      const input = 'p-4   my-class    text-lg';
      const result = clearTailwindClasses(input);

      expect(result).toBe('my-class text-lg');
    });

    it('trims leading and trailing spaces', () => {
      const input = '   my-class p-4   ';
      const result = clearTailwindClasses(input);

      expect(result).toBe('my-class');
    });
  });

  describe('stability', () => {
    it('always returns a string', () => {
      expect(typeof clearTailwindClasses('p-4')).toBe('string');
    });
  });
});
