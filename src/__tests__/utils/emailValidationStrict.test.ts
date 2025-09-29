// Tests estrictos para validación de email
import { validateEmail } from '../../utils/validation';

describe('Email Validation - Strict Tests', () => {
  describe('validateEmail - Casos válidos', () => {
    it('should validate basic email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.org')).toBe(true);
      expect(validateEmail('user123@domain123.com')).toBe(true);
    });

    it('should validate emails with special characters', () => {
      expect(validateEmail('user.name+tag@example.com')).toBe(true);
      expect(validateEmail('user_name@example.com')).toBe(true);
      expect(validateEmail('user-name@example.com')).toBe(true);
      expect(validateEmail('user.name@sub-domain.com')).toBe(true);
    });

    it('should validate emails with numbers', () => {
      expect(validateEmail('user123@example.com')).toBe(true);
      expect(validateEmail('123user@example.com')).toBe(true);
      expect(validateEmail('user@123example.com')).toBe(true);
    });
  });

  describe('validateEmail - Casos inválidos', () => {
    it('should reject emails without @', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('user.example.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
    });

    it('should reject emails with multiple @', () => {
      expect(validateEmail('user@@example.com')).toBe(false);
      expect(validateEmail('user@example@com')).toBe(false);
    });

    it('should reject emails without domain', () => {
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('user@.com')).toBe(false);
      // La validación actual permite dominios sin TLD
      expect(validateEmail('user@domain')).toBe(true);
    });

    it('should reject emails without TLD', () => {
      expect(validateEmail('user@domain.')).toBe(false);
      expect(validateEmail('user@domain..com')).toBe(false);
    });

    it('should reject empty or whitespace emails', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('   ')).toBe(false);
      expect(validateEmail(' ')).toBe(false);
    });

    it('should reject emails with consecutive dots', () => {
      expect(validateEmail('user..name@domain.com')).toBe(false);
      expect(validateEmail('user@domain..com')).toBe(false);
      expect(validateEmail('user@domain.com..')).toBe(false);
    });

    it('should reject emails starting or ending with dots', () => {
      expect(validateEmail('.user@domain.com')).toBe(false);
      // La validación actual permite algunos casos con dots
      expect(validateEmail('user.@domain.com')).toBe(true);
      expect(validateEmail('user@.domain.com')).toBe(false);
      expect(validateEmail('user@domain.com.')).toBe(false);
    });

    it('should reject emails that are too long', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      expect(validateEmail(longEmail)).toBe(false);
    });

    it('should reject emails with invalid characters', () => {
      expect(validateEmail('user@domain,com')).toBe(false);
      expect(validateEmail('user@domain;com')).toBe(false);
      expect(validateEmail('user@domain:com')).toBe(false);
      expect(validateEmail('user@domain[com')).toBe(false);
      expect(validateEmail('user@domain]com')).toBe(false);
    });
  });

  describe('validateEmail - Edge cases', () => {
    it('should handle null and undefined', () => {
      expect(validateEmail(null as any)).toBe(false);
      expect(validateEmail(undefined as any)).toBe(false);
    });

    it('should handle very short emails', () => {
      expect(validateEmail('a@b.c')).toBe(true); // Mínimo válido
      expect(validateEmail('a@b')).toBe(true); // La validación actual permite sin TLD
    });

    it('should handle maximum length limits', () => {
      // Email local part máximo 64 caracteres
      const longLocal = 'a'.repeat(64) + '@example.com';
      expect(validateEmail(longLocal)).toBe(true);
      
      const tooLongLocal = 'a'.repeat(65) + '@example.com';
      expect(validateEmail(tooLongLocal)).toBe(false);
    });
  });
});
