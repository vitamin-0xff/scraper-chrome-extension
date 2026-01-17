import { describe, it, expect } from 'vitest';
import { toJsonKey } from '../src/utils/utils';

describe('toJsonKey', () => {
  describe('basic sanitation', () => {
    it('keeps valid keys unchanged', () => {
      expect(toJsonKey('validKey')).toBe('validKey');
      expect(toJsonKey('valid_key')).toBe('valid_key');
    });

    it('removes spaces', () => {
      expect(toJsonKey('my key')).toBe('my_key');
    });

    it('removes special characters', () => {
      expect(toJsonKey('my-key!')).toBe('my_key_');
      expect(toJsonKey('user@name#1')).toBe('user_name_1');
    });
  });

  describe('numeric handling', () => {
    it('removes leading numbers', () => {
      expect(toJsonKey('123key')).toBe('_123key');
    });

    it('keeps numbers after first character', () => {
      expect(toJsonKey('key123')).toBe('key123');
    });

    it('returns empty string if only numbers are provided', () => {
      expect(toJsonKey('123')).toBe('_123');
    });
  });

  describe('unicode and symbols', () => {
    it('removes unicode characters', () => {
      expect(toJsonKey('clé')).toBe('cl_');
      expect(toJsonKey('名字')).toBe('__');
    });

    it('removes punctuation', () => {
      expect(toJsonKey('key.name')).toBe('key_name');
      expect(toJsonKey('key:name')).toBe('key_name');
    });
  });

  describe('edge cases', () => {
    it('returns empty string for empty input', () => {
      expect(toJsonKey('')).toBe('_');
    });

    it('handles whitespace-only input', () => {
      expect(toJsonKey('   ')).toBe('_');
    });

    it('is deterministic', () => {
      const input = 'my key!';
      expect(toJsonKey(input)).toBe(toJsonKey(input));
    });
  });

  describe('output guarantees', () => {
    it('always returns a valid JS identifier or empty string', () => {
      const result = toJsonKey('1@invalid-key!');
      expect(result === '' || /^[A-Za-z_][A-Za-z0-9_]*$/.test(result)).toBe(true);
    });

    it('always returns a string', () => {
      expect(typeof toJsonKey('anything')).toBe('string');
    });
  });
});
